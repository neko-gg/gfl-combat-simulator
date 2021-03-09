import * as net from 'net';
import {Socket} from 'net';
import logger from '@app/utils/logger';
import Proxy from 'http-mitm-proxy';
import path from 'path';
import fs from 'fs';
import pako from "pako";
import {decryptPacketBody, encryptPacketBody} from "@app/utils/auth";
import {getStaticPath} from "@app/utils/static-loader";
import {getStandNumber} from "@app/model/EchelonGridPosition";
import state from "@app/state/state";
import TDollInEchelon from "@app/model/TDollInEchelon";
import Equip from "@app/model/Equip";
import TDoll from "@app/model/TDoll";

const pipeSockets = (socketA: Socket, socketB: Socket) => {
    socketB.pipe(socketA);
    socketA.pipe(socketB);
};

const proxy = Proxy();

export const startProxy = (onError: (error: Error, port: number) => void = () => undefined, port = 9002): void => {
    const signKey = 'yundoudou';
    const userId = 69420;
    const signUpTime = "1611242069";
    const uidResponse = `{"uid":"${userId}","sign":"${signKey}","is_username_exist":true,"real_name":0,"authentication_url":"http:\\/\\/realauth.ucenter.ppgame.com\\/authoriz.html?appid={0}&openid={1}&accounttype=1&language=zh","tc_order_retry":0}`;

    proxy.onConnect(function (incomingMessage, clientToProxySocket) {
        logger.debug(`proxy tunnel to: ${incomingMessage.url}`);
        const [host, port] = incomingMessage.url.split(':');

        const connectionOptions = {
            port: parseInt(port),
            host: host,
            allowHalfOpen: true,
        };

        const proxyToServerSocket = net.connect(connectionOptions, () => {
            proxyToServerSocket.on('finish', () => clientToProxySocket.destroy());
            clientToProxySocket.on('close', () => proxyToServerSocket.end());
            clientToProxySocket.write('HTTP/1.1 200 OK\r\n\r\n',
                                      'utf-8',
                                      () => pipeSockets(clientToProxySocket, proxyToServerSocket));
        });

        proxyToServerSocket.on('error', error => onSocketError(error, 'proxy to server socket'));
        clientToProxySocket.on('error', error => onSocketError(error, 'client to proxy socket'));
    });

    proxy.onRequest((ctx, callback) => {
        logger.silly(`proxy request [${ctx.clientToProxyRequest.method.toUpperCase()}]: ${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url}`);

        if (ctx.clientToProxyRequest.url.endsWith('getUidEnMicaQueue')) {
            logger.silly(`sending simulated UID response to client: ${uidResponse}`);
            const encryptedResponseBody = encryptPacketBody(uidResponse, signKey);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Index/index')) {
            const tomorrowDate = new Date();
            tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
            tomorrowDate.setUTCHours(8, 0, 0, 0);
            const tomorrowEpoch = Math.round(tomorrowDate.getTime() / 1000) + '';

            const echelon = state.Instance.echelon;
            const fairyInEchelon = echelon.fairyInEchelon;
            const fairy = fairyInEchelon?.fairy;
            const enemyTeamId = state.Instance.enemyTeamId;
            const isDay = state.Instance.isDay;
            const nodeBelongsTo = state.Instance.nodeBelongsTo;
            const fairySkillsOnTeam = state.Instance.fairySkillsOnTeam;

            const templateIndexPacket = fs.readFileSync(getStaticPath(path.join('packet', 'index.tjson')), 'utf8');
            const indexPacket = templateIndexPacket.replace(/\${signUpTime}/g, signUpTime)
                                                   .replace(/\${tomorrowTime}/g, tomorrowEpoch)
                                                   .replace(/\${userId}/g, `${userId}`)
                                                   .replace(/\${userInfoId}/g, '123166')
                                                   .replace(/\${openId}/g, '3585422')
                                                   .replace(/\${skkName}/g, 'nerfthis')
                                                   .replace(/\${sign}/g, signKey)
                                                   .replace(/\${fairyCommandPoints}/g, fairyInEchelon?.skillActive ? '200' : '0');

            const indexPacketJson = JSON.parse(indexPacket);

            type EquipWithUserInfoElement = { "id": string }
            type EquipWithUserInfoAccumulator = { [key in string]: EquipWithUserInfoElement }
            indexPacketJson.equip_with_user_info = echelon.tDollsInEchelon
                                                          .filter(tDollsInEchelon => tDollsInEchelon.tDoll)
                                                          .map(tDollInEchelon => getEquipsWithUserInfo(tDollInEchelon, userId))
                                                          .reduce((accumulator, current) => accumulator.concat(current), [])
                                                          .reduce((accumulator: EquipWithUserInfoAccumulator, current: EquipWithUserInfoElement) => {
                                                              accumulator[current.id] = current;
                                                              return accumulator;
                                                          }, {});

            indexPacketJson.gun_with_user_info = echelon.tDollsInEchelon
                                                        .filter(tDollsInEchelon => tDollsInEchelon.tDoll)
                                                        .map(tDollInEchelon => getGunWithUserInfo(tDollInEchelon, userId));

            const templateFairyWithUserInfo = fs.readFileSync(getStaticPath(path.join('packet', 'fairy_with_user_info.tjson')), 'utf8');
            const fairyWithUserInfo = fairy ? templateFairyWithUserInfo.replace(/\${userId}/g, `${userId}`)
                                                                       .replace(/\${fairyId}/g, `${fairy.id}`)
                                                                       .replace(/\${fairyLevel}/g, `${fairy.level}`)
                                                                       .replace(/\${fairyExp}/g, `${fairy.exp()}`)
                                                                       .replace(/\${fairyRarity}/g, `${fairy.rarity}`)
                                                                       .replace(/\${fairyRarityExp}/g, `${fairy.rarityExp()}`)
                                                                       .replace(/\${fairySkill}/g, `${fairy.skill}`)
                                                                       .replace(/\${fairyTalent}/g, `${fairy.talent.id}`)
                                            : "[]";

            indexPacketJson.fairy_with_user_info = JSON.parse(fairyWithUserInfo);

            const templateSpotActInfo = fs.readFileSync(getStaticPath(path.join('packet', isDay ? 'spot_act_info.tjson' : 'spot_act_info_night.tjson')), 'utf8');
            const spotActInfo = templateSpotActInfo.replace(/\${enemyTeamId}/g, `${enemyTeamId}`)
                                                   .replace(/\${spotSeed}/g, fairyInEchelon?.talentTriggers ? '146' : '56')
                                                   .replace(/\${nodeBelongsTo}/g, `${nodeBelongsTo}`);
            const spotActInfoJson = JSON.parse(spotActInfo);
            indexPacketJson.spot_act_info = spotActInfoJson;

            const fairySkillsOnTeamJson = JSON.stringify(JSON.stringify(fairySkillsOnTeam)); // bruh
            type MissionActInfoSpotElement = { "spot_id": string }
            type MissionActInfoSpotAccumulator = { [key in string]: MissionActInfoSpotElement }
            const templateMissionActInfo = fs.readFileSync(getStaticPath(path.join('packet', isDay ? 'mission_act_info.tjson' : 'mission_act_info_night.tjson')), 'utf8');
            const missionActInfo = templateMissionActInfo.replace(/\${userId}/g, `${userId}`)
                                                         .replace(/\${enemyTeamId}/g, `${enemyTeamId}`)
                                                         .replace(/\${fairySkillsOnTeam}/g, fairySkillsOnTeamJson);
            const missionActInfoJson = JSON.parse(missionActInfo);

            const missionActInfoSpot = spotActInfoJson.reduce((accumulator: MissionActInfoSpotAccumulator, current: MissionActInfoSpotElement) => {
                accumulator[current.spot_id] = current;
                return accumulator;
            }, {});
            missionActInfoJson.spot = JSON.stringify(missionActInfoSpot);
            indexPacketJson.mission_act_info = missionActInfoJson;

            const encryptedResponseBody = encryptPacketBody(JSON.stringify(indexPacketJson), signKey);
            logger.silly(`sending simulated index response to client: ${JSON.stringify(indexPacketJson)}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Index/version') || ctx.clientToProxyRequest.url.endsWith('index.php')) {
            const chunks: Buffer[] = [];
            const reqChunks: Buffer[] = [];

            ctx.onRequestData(function (ctx, chunk, callback) {
                reqChunks.push(chunk);
                return callback(null, chunk);
            });

            ctx.onRequestEnd(function (ctx, callback) {
                logger.info(`request to ${ctx.clientToProxyRequest.url}: "${reqChunks.toString()}"`);
                return callback();
            });

            ctx.onResponseData(function (ctx, chunk, callback) {
                chunks.push(chunk);
                return callback(null, chunk);
            });

            ctx.onResponseEnd(function (ctx, callback) {
                try {
                    const responseBody = Buffer.concat(chunks);
                    const decompressedResponseBody = pako.ungzip(responseBody);
                    const decodedResponseBody = new TextDecoder().decode(decompressedResponseBody);

                    logger.silly(`decoded ${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url} response: ${decodedResponseBody}`);
                } catch (error) {
                    logger.error(`error decoding response: ${error}`);
                }

                return callback();
            });

            logger.silly(`letting ${ctx.clientToProxyRequest.method} request through to ${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url}`);
            return callback();
        }

        if (ctx.clientToProxyRequest.url.endsWith('Friend/dormInfo')) {
            const templateDormInfoPacket = fs.readFileSync(getStaticPath(path.join('packet', 'dorm_info.tjson')), 'utf8');
            const dormInfoPacket = templateDormInfoPacket.replace(/\${userId}/g, `${userId}`);
            const dormInfoPacketJson = JSON.parse(dormInfoPacket);

            const encryptedResponseBody = encryptPacketBody(JSON.stringify(dormInfoPacketJson), signKey);
            logger.silly(`sending simulated dorm info response to client: ${JSON.stringify(dormInfoPacketJson)}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Index/home')) {
            const templateHomePacket = fs.readFileSync(getStaticPath(path.join('packet', 'home.tjson')), 'utf8');
            const homePacket = templateHomePacket.replace(/\${signUpTime}/g, signUpTime);
            const homePacketJson = JSON.parse(homePacket);

            const encryptedResponseBody = encryptPacketBody(JSON.stringify(homePacketJson), signKey);
            logger.silly(`sending simulated home response to client: ${JSON.stringify(homePacketJson)}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Index/downloadSuccess')) {
            const responseBody = '1';
            const encryptedResponseBody = encryptPacketBody(responseBody, signKey);

            logger.silly(`sending simulated download success response to client: ${responseBody}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Index/gameSetting')) {
            const responseBody = '1';
            logger.silly(`sending simulated game settings response to client: ${responseBody}`);
            ctx.proxyToClientResponse.end(responseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Mall/staticTables')) {
            const templateMallPacket = fs.readFileSync(getStaticPath(path.join('packet', 'mall_static_tables.tjson')), 'utf8');
            const mallPacketJson = JSON.parse(templateMallPacket);

            const encryptedResponseBody = encryptPacketBody(JSON.stringify(mallPacketJson), signKey);
            logger.silly(`sending simulated mall static tables response to client: ${JSON.stringify(mallPacketJson)}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Mission/combinationInfo')) {
            const responseBody = '[]';
            const encryptedResponseBody = encryptPacketBody(responseBody, signKey);

            logger.silly(`sending simulated mission combination info response to client: ${responseBody}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (/^\/image\/ImageConfig\.txt\?r=\d+$/.test(ctx.clientToProxyRequest.url)) {
            logger.silly(`letting ${ctx.clientToProxyRequest.method} request through to ${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url}`);
            return callback();
        }

        if (ctx.clientToProxyRequest.url.endsWith('Index/crashLog')) {
            const reqChunks: Buffer[] = [];

            ctx.onRequestData(function (ctx, chunk, callback) {
                reqChunks.push(chunk);
                return callback(null, chunk);
            });

            ctx.onRequestEnd(() => {
                const requestBody = reqChunks.toString();
                const outDataCode = requestBody.split('&outdatacode=').pop().split('&req_id=')[0];
                const decodedCrashLog = decodeURIComponent(outDataCode);
                const decryptedCrashLog = decryptPacketBody(decodedCrashLog, signKey);
                logger.warn(`crash report: "${decryptedCrashLog}"`);
            });

            const responseBody = '1';
            const encryptedResponseBody = encryptPacketBody(responseBody, signKey);
            logger.silly(`sending simulated crash report response to client: ${responseBody}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return callback();
        }

        if (ctx.clientToProxyRequest.url.endsWith('Mission/battleFinish')) {
            const templateResponseBody = fs.readFileSync(getStaticPath(path.join('packet', 'battle_finish.tjson')), 'utf8');
            const responseBody = JSON.stringify(JSON.parse(templateResponseBody));
            const encryptedResponseBody = encryptPacketBody(responseBody, signKey);

            logger.silly(`sending simulated battle finish response to client: ${responseBody}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.url.endsWith('Mission/endEnemyTurn')) {
            const templateEndEnemyTurn = '{error:69}'; // invalid json to trigger re-login
            const encryptedResponseBody = encryptPacketBody(templateEndEnemyTurn, signKey);

            logger.silly(`sending simulated end enemy turn response to client: ${templateEndEnemyTurn}`);
            ctx.proxyToClientResponse.end(encryptedResponseBody);
            return;
        }

        if (ctx.clientToProxyRequest.headers.host.includes('girlfrontline') || ctx.clientToProxyRequest.headers.host.includes('sunborngame')) {
            const reqChunks: Buffer[] = [];

            ctx.onRequestData(function (ctx, chunk, callback) {
                reqChunks.push(chunk);
                return callback(null, chunk);
            });

            ctx.onRequestEnd(() => {
                try {
                    const requestBody = Buffer.concat(reqChunks).toString();

                    if (requestBody && requestBody.includes('outdatacode')) {
                        const outDataCode = requestBody.split('&outdatacode=').pop().split('&req_id=')[0];
                        const decodedRequest = decodeURIComponent(outDataCode);
                        const decryptedRequest = decryptPacketBody(decodedRequest, signKey);
                        logger.silly(`request to ${ctx.clientToProxyRequest.url}: "${decryptedRequest}"`);
                    } else {
                        logger.silly(`request to ${ctx.clientToProxyRequest.url}: "${requestBody}"`);
                    }
                } catch (error) {
                    logger.error(`error decoding request: ${error}`);
                }
            });

            const responseBody = '\n\n⚠ GFL Combat Simulator error!\nOperation not supported.';
            logger.silly(`sending simulated error response to client`);
            ctx.proxyToClientResponse.end(responseBody);
            return callback();
        }

        logger.silly(`eating ${ctx.clientToProxyRequest.method} request to ${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url}`);
    });

    const onSocketError = (error: Error, description: string) => {
        logger.warn(`unexpected proxy socket error on ${description}, ignoring. ${error}`);
    };

    proxy.onError((_, error) => onError(error, proxy.httpPort));
    proxy.listen({port: port});
};

export const changePort = (port: number): void => {
    proxy.close();
    proxy.listen({port: port});
}

export const stopProxy = (): void => {
    try {
        proxy && proxy.close();
    } catch (error) {
        logger.warn(`failed to close proxy. ${error}`);
    }
}

function getEquipsWithUserInfo(tDollInEchelon: TDollInEchelon, userId: number) {
    return [tDollInEchelon.tDoll.equipOne,
            tDollInEchelon.tDoll.equipTwo,
            tDollInEchelon.tDoll.equipThree].filter(equip => equip)
                                            .map((equip, index) => getEquipWithUserInfo(tDollInEchelon, userId, equip, index));
}

function getEquipWithUserInfo(tDollInEchelon: TDollInEchelon, userId: number, equip: Equip, index: number) {
    const equipsStats = equip.maxStats();
    const equipStatValue = 10_000;
    const tDollUID = 1000 + tDollInEchelon.listPosition;
    const equipUID = `${tDollUID}${index}`;
    const templateEquipWithUserInfo = fs.readFileSync(getStaticPath(path.join('packet', 'equip_with_user_info.tjson')), 'utf8');
    const equipWithUserInfo = templateEquipWithUserInfo.replace(/\${equipUID}/g, equipUID)
                                                       .replace(/\${userId}/g, `${userId}`)
                                                       .replace(/\${tDollUID}/g, `${tDollUID}`)
                                                       .replace(/\${equipId}/g, `${equip.id}`)
                                                       .replace(/\${equipExp}/g, `${equip.maxExp()}`)
                                                       .replace(/\${equipLevel}/g, `${equip.maxLevel()}`)
                                                       .replace(/\${equipDamage}/g, `${equipsStats.damage ? equipStatValue : 0}`)
                                                       .replace(/\${equipAccuracy}/g, `${equipsStats.accuracy ? equipStatValue : 0}`)
                                                       .replace(/\${equipEvasion}/g, `${equipsStats.evasion ? equipStatValue : 0}`)
                                                       .replace(/\${equipMovementSpeed}/g, `${equipsStats.movementSpeed ? equipStatValue : 0}`)
                                                       .replace(/\${equipRof}/g, `${equipsStats.rof ? equipStatValue : 0}`)
                                                       .replace(/\${equipCriticalRate}/g, `${equipsStats.criticalRate ? equipStatValue : 0}`)
                                                       .replace(/\${equipCriticalDamage}/g, `${equipsStats.criticalDamage ? equipStatValue : 0}`)
                                                       .replace(/\${equipArmorPenetration}/g, `${equipsStats.armorPenetration ? equipStatValue : 0}`)
                                                       .replace(/\${equipArmor}/g, `${equipsStats.armor ? equipStatValue : 0}`)
                                                       .replace(/\${equipNightViewPercent}/g, `${equipsStats.nightVision ? equipStatValue : 0}`)
                                                       .replace(/\${equipRounds}/g, `${equipsStats.rounds ? equipStatValue : 0}`);
    return JSON.parse(equipWithUserInfo);
}

function getGunWithUserInfo(tDollInEchelon: TDollInEchelon, userId: number) {
    const tDoll: TDoll = tDollInEchelon.tDoll;
    const tDollUID = 1000 + tDollInEchelon.listPosition;
    const templateGunWithUserInfo = fs.readFileSync(getStaticPath(path.join('packet', 'gun_with_user_info.tjson')), 'utf8');
    const gunWithUserInfo = templateGunWithUserInfo.replace(/\${tDollUID}/g, `${tDollUID}`)
                                                   .replace(/\${userId}/g, `${userId}`)
                                                   .replace(/\${tDollId}/g, `${tDoll.id}`)
                                                   .replace(/\${tDollExp}/g, `${tDoll.exp()}`)
                                                   .replace(/\${tDollLevel}/g, `${tDoll.level}`)
                                                   .replace(/\${tDollListPosition}/g, `${tDollInEchelon.listPosition + 1}`)
                                                   .replace(/\${tDollGridPosition}/g, `${getStandNumber(tDollInEchelon.gridPosition)}`)
                                                   .replace(/\${tDollMod}/g, `${tDoll.mod || 0}`)
                                                   .replace(/\${tDollHp}/g, `${tDoll.stats().hp}`)
                                                   .replace(/\${tDollDamage}/g, `${tDoll.calculateDeltaStat("damage")}`)
                                                   .replace(/\${tDollAccuracy}/g, `${tDoll.calculateDeltaStat("accuracy")}`)
                                                   .replace(/\${tDollEvasion}/g, `${tDoll.calculateDeltaStat("evasion")}`)
                                                   .replace(/\${tDollRof}/g, `${tDoll.calculateDeltaStat("rof")}`)
                                                   .replace(/\${tDollSkillOne}/g, `${tDoll.skillOne}`)
                                                   .replace(/\${tDollSkillTwo}/g, `${tDoll.skillTwo || 0}`)
                                                   .replace(/\${tDollDummies}/g, `${tDoll.dummies}`)
                                                   .replace(/\${tDollEquipOne}/g, `${tDoll.equipOne?.id ? `${tDollUID}0` : 0}`)
                                                   .replace(/\${tDollEquipTwo}/g, `${tDoll.equipTwo?.id ? `${tDollUID}1` : 0}`)
                                                   .replace(/\${tDollEquipThree}/g, `${tDoll.equipThree?.id ? `${tDollUID}2` : 0}`)
                                                   .replace(/\${tDollAffection}/g, `${tDoll.affection * 10_000}`)
                                                   .replace(/\${tDollMaxAffection}/g, `${tDoll.maxAffection() * 10_000}`)
                                                   .replace(/\${tDollOath}/g, `${tDoll.oathed ? 1 : 0}`);

    return JSON.parse(gunWithUserInfo);
}
