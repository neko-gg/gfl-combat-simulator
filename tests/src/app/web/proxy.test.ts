import {startProxy, stopProxy} from "@src/app/web/proxy";

import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import ip from "ip";
import {SuperAgentRequest} from "superagent";
import superagentProxy from "superagent-proxy";

chai.use(chaiHttp);
chai.use(chaiAsPromised);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
superagentProxy(chai.request);

describe('Proxy tests', () => {

    before(() => startProxy());
    after(() => stopProxy());

    const proxyRequest = (request: unknown) => (request as SuperAgentRequest).proxy(`http://${ip.address()}:9002`);

    it('Internet available', () => {
        return expect(chai.request('http://www.google.com')
                          .get('/'))
            .to.eventually.be.fulfilled
    });

    it('Block unknown urls', () => {
        return expect(proxyRequest(chai.request('http://www.google.com')
                                       .get('/')
                                       .timeout(2500)))
            .to.eventually.be.rejected
    }).timeout(5000);

    it('Allow known urls', () => {
        return expect(proxyRequest(chai.request('http://gf-transit.sunborngame.com/index.php')
                                       .get('')))
            .to.eventually.be.fulfilled
    }).timeout(5000);

    it('Get UID', () => {
        return expect(proxyRequest(chai.request('gf-game.sunborngame.com')
                                       .post('/index.php/1001/Index/getUidEnMicaQueue'))
                          .type('form')
                          .send({
                                    'openid': '1337',
                                    'sid': 'beef',
                                    'req_id': '707'
                                })
                          .then(res => {
                                    expect(res).to.have.status(200);
                                    // todo: test mocked body
                                    //const body = res.body;
                                    //const decryptedBody = decryptPacketBody(body, 'youdondon');
                                    //expect(decryptedBody).to.have('uid').not.null
                                }
                          ))
            .to.eventually.be.fulfilled
    });

//

});
