import fs from "fs";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";

const assetBuffer = fs.readFileSync(getStaticPath(path.join('asset', 'text', 'enemy_character_type.txt')));
const assetString = assetBuffer?.toString();
const assetArray = assetString?.split('\n');

export function getAssetEnemyCharacterType(assetCode: string): string | undefined {
    const assetLine = assetArray?.find(line => line.startsWith(assetCode));
    return assetLine?.split(',')?.splice(1)?.join(',')?.trim();
}
