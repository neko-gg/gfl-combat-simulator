import sangvisChipInfo from "@static/stc/SangvisChip.json"
import {getAssetSangvisChip} from "@app/model/asset/AssetSangvisChip";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";

export default class CoalitionChip {
    id: number;

    private chipInfo;

    constructor(id: number) {
        this.id = id;
        this.chipInfo = this.findFromSangvisChipInfo();
    }

    private findFromSangvisChipInfo() {
        return sangvisChipInfo.find(sangvisChipInfoElement => this.id === sangvisChipInfoElement.id);
    }

    name(): string | undefined {
        const sangvisChipName = this.chipInfo.name;
        const assetName = getAssetSangvisChip(sangvisChipName);
        if (!assetName || assetName.trim() === '') return this.chipInfo.code;
        return assetName;
    }

    icon(): string | undefined {
        const code = this.chipInfo?.code?.toLowerCase();
        if (!code) return undefined;

        return getStaticPath(path.join('icon', 'chip', `${code}.png`));
    }

    description(): string | undefined {
        const sangvisChipDes = this.chipInfo.des;
        const assetName = getAssetSangvisChip(sangvisChipDes);
        if (!assetName || assetName.trim() === '') return '';
        return assetName;
    }

}
