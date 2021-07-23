import FormData from "form-data";
import {request, RequestOptions} from "http";

export interface DataVersion {
    dataVersion: string,
    abVersion: string,
    clientVersion: string
}

export async function getDataVersion(): Promise<DataVersion> {
    const versionFormData = new FormData();
    versionFormData.append('req_id', `${new Date().getTime() / 1000}00001`);

    const versionOptions: RequestOptions = {
        hostname: 'gf-game.sunborngame.com',
        port: 80,
        path: '/index.php/1001/Index/version',
        method: 'POST',
        headers: versionFormData.getHeaders()
    }

    const versionRequest = request(versionOptions);
    const chunks: Buffer[] = [];

    versionFormData.pipe(versionRequest);
    return new Promise((resolve, reject) => {
        versionRequest.on('response', function (res) {
            res.on('data', chunk => chunks.push(chunk));
            res.on('error', err => reject(err));
            res.on('end', () => {
                const responseBody = chunks.toString();
                const responseJson = JSON.parse(responseBody);
                const dataVersion = responseJson.data_version;
                const abVersion = responseJson.ab_version;
                const clientVersion = responseJson.client_version;

                resolve({dataVersion, abVersion, clientVersion});
            });
        });
    });
}

