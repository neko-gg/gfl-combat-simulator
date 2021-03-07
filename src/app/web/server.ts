import express from 'express';
import * as http from "http";
import {AddressInfo} from 'net';
import logger from "@app/utils/logger";
import ip from "ip";

const app = express();

let server: http.Server;

export const startServer = (): void => {
    server = app.listen(0, () => {
        const serverAddress = server.address() as AddressInfo;
        logger.debug(`server listening at ${ip.address()}:${serverAddress.port}`);
    });
};

export const getServerAddress = (): AddressInfo => server?.address() as AddressInfo;

app.get('*', (req, res) => {
    logger.info("req received");
    res.send('Express + TypeScript Server');
});
