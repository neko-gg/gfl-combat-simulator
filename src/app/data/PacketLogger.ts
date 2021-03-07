import * as net from 'net';
import {Socket} from 'net';
import logger from '../utils/logger';
import Proxy from 'http-mitm-proxy';
import pako from "pako";
import {decryptPacketBody} from "../utils/auth";

const pipeSockets = (socketA: Socket, socketB: Socket) => {
    socketB.pipe(socketA);
    socketA.pipe(socketB);
};

const proxy = Proxy();

const startProxy = (port = 9002): void => {
    let queueSignKey = 'yundoudou';
    let signKey = queueSignKey;

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

        if (ctx.clientToProxyRequest.headers.host.includes('sunborngame.com')) {
            const chunks: Buffer[] = [];
            const reqChunks: Buffer[] = [];

            ctx.onRequestData(function (ctx, chunk, callback) {
                reqChunks.push(chunk);
                return callback(null, chunk);
            });

            ctx.onRequestEnd(function (ctx, callback) {
                logger.silly(`request to ${ctx.clientToProxyRequest.url}: "${reqChunks.toString()}"`);
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
                    let decryptedResponseBody = decryptPacketBody(decodedResponseBody, signKey);

                    if (ctx.clientToProxyRequest.url.endsWith('getUidEnMicaQueue')) {
                        decryptedResponseBody = decryptPacketBody(decodedResponseBody, queueSignKey);
                        signKey = JSON.parse(decryptedResponseBody).sign;
                    }
                    logger.silly(`decrypted ${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url} response: ${decryptedResponseBody}`);
                } catch (error) {
                    logger.error(`error decoding response: ${error}`);
                }

                return callback();
            });

            logger.silly(`letting ${ctx.clientToProxyRequest.method} request through to ${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url}`);
            return callback();
        }
    });

    const onSocketError = (error: Error, description: string) => {
        logger.warn(`unexpected proxy socket error on ${description}, ignoring. ${error}`);
    }

    proxy.listen({port: port});
}

startProxy();
