import wget from "wget-improved";

export async function downloadPromise(source: string, output: string, onProgess: (progress: number) => void = () => undefined): Promise<string> {
    const download = wget.download(source, output, {});

    return new Promise((resolve, reject) => {
        download.on('error', err => reject(err));
        download.on('end', () => resolve(output));
        download.on('progress', progress => {
            if (typeof progress === 'number') onProgess(progress);
        });
    });
}
