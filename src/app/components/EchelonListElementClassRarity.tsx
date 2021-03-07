import React from 'react';
import '../styles/echelon-list-element.less'
import '../styles/echelon-list-doll-class.less'
import {TDollClass} from "@app/model/TDollClass";
import {Rarity} from "@app/model/Rarity";
import {hot} from "react-hot-loader";
import {FormControl, Grid, MenuItem, Select} from "@material-ui/core";
import TDoll from "@app/model/TDoll";

interface EchelonListElementClassRarityProps {
    tDoll: TDoll;
    updateTDoll: () => void;
}

class EchelonListElementClassRarity extends React.Component<EchelonListElementClassRarityProps> {
    containerRef = React.createRef<HTMLDivElement>();

    tDollDummiesChange = (dummies: number) => {
        this.props.tDoll.dummies = dummies;
        this.props.updateTDoll();
    }

    render(): JSX.Element {
        const tDoll = this.props.tDoll;
        const rarity = tDoll.rarity();
        const tDollClass = tDoll.class();

        return <Grid container justify="space-between" alignItems="flex-start" className={"echelon-list-element-class-rarity-dummies"}>
                <Grid container justify="space-between" alignItems="flex-start" className={"echelon-list-element-class-rarity"}>
                    <Grid item>
                        <div className={`echelon-list-element-class ${TDollClass[tDollClass]?.toLowerCase()}${rarity}`}/>
                    </Grid>
                    <Grid item>
                        <div className="echelon-list-element-rarity">
                            {[...Array(rarity === Rarity.EXTRA ? 1 : rarity).keys()].map(() => "⭐").join("")}
                        </div>
                    </Grid>
                </Grid>
                <Grid container justify="space-between" alignItems="center" className={"echelon-list-element-dummies-ce"}>
                    <Grid item/>
                    <Grid item>
                        <div className="echelon-list-element-dummies">
                            <FormControl size="small" className="echelon-list-element-dummies-form-control">
                                <Select className="echelon-list-element-dummies-select"
                                        MenuProps={{disableScrollLock: true}}
                                        value={tDoll.dummies}
                                        onChange={(event) => this.tDollDummiesChange(event.target.value as number)}
                                        inputProps={{name: 'dummies'}}>
                                    {[...Array(tDoll.maxDummies()).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>X{i}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
    }

}

export default hot(module)(EchelonListElementClassRarity);
