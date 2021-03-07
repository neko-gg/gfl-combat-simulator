import path from "path";
import {inDev, nonWebpackPath} from "./dev";

export function getStaticPath(relativePath: string): string {
    if (inDev) return path.resolve('.webpack', 'renderer', 'main_window', 'static', relativePath);
    if (nonWebpackPath) return path.resolve(__dirname, '..', '..', 'static', relativePath);

    const dirname = path.join(__dirname).endsWith(path.join('.webpack', 'main'))
                    ? path.join(__dirname, '..', 'renderer', 'main_window')
                    : path.join(__dirname);
    return path.resolve(dirname, 'static', relativePath);
}
