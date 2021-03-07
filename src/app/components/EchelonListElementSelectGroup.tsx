import React from 'react';
import '../styles/echelon-list-element.less'
import '../styles/echelon-list-doll-class.less'
import {hot} from "react-hot-loader";
import {Grid, MenuItem} from "@material-ui/core";
import TDoll from "@app/model/TDoll";
import EchelonSelect from "@app/components/EchelonSelect";

interface EchelonListElementSelectGroupProps {
    tDoll: TDoll;
    updateTDoll: () => void;
}

class EchelonListElementSelectGroup extends React.Component<EchelonListElementSelectGroupProps> {

    tDollLevelChange = (level: number) => {
        this.props.tDoll.level = level;
        this.props.updateTDoll();
    }

    tDollAffectionChange = (affection: number) => {
        this.props.tDoll.affection = affection;
        this.props.updateTDoll();
    }

    tDollSkillOneChange = (skillOneLevel: number) => {
        this.props.tDoll.skillOne = Math.max(1, Math.min(skillOneLevel, 10));
        this.props.updateTDoll();
    }

    tDollSkillTwoChange = (skillTwoLevel: number) => {
        this.props.tDoll.skillTwo = Math.max(1, Math.min(skillTwoLevel, 10));
        this.props.updateTDoll();
    }

    tDollOathChange = (oathed: number) => {
        this.props.tDoll.oathed = !!oathed;
        this.props.updateTDoll();
    }

    tDollModChange = (mod: number) => {
        this.props.tDoll.mod = mod;
        this.props.updateTDoll();
    }

    render(): JSX.Element {
        const tDoll = this.props.tDoll;

        return <Grid container justify="space-between" alignItems="flex-start" className={"echelon-list-element-select-group"}>
            <Grid container justify="space-between" alignItems="flex-start" className={"echelon-list-element-select-group-row"}>
                <Grid item>
                    {EchelonListElementSelectGroup.selectComponent("Level",
                                                                   "level",
                                                                   tDoll.level,
                                                                   (event) => this.tDollLevelChange(event.target.value as number),
                                                                   [...Array(tDoll.maxLevel() - tDoll.minLevel() + 1).keys()].map(i => i + tDoll.minLevel()).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>))}
                </Grid>
                <Grid item>
                    {EchelonListElementSelectGroup.selectComponent("Affection",
                                                                   "affection",
                                                                   tDoll.affection,
                                                                   (event) => this.tDollAffectionChange(event.target.value as number),
                                                                   [...Array(tDoll.maxAffection() + 1).keys()].reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>))}
                </Grid>
            </Grid>
            <Grid container justify="space-between" alignItems="center" className={"echelon-list-element-select-group-row"}>
                <Grid item>
                    {EchelonListElementSelectGroup.selectComponent("Skill 1",
                                                                   "skill-one",
                                                                   tDoll.skillOne,
                                                                   (event) => this.tDollSkillOneChange(event.target.value as number),
                                                                   [...Array(10).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>))}
                </Grid>
                <Grid item>
                    {EchelonListElementSelectGroup.selectComponent("Skill 2",
                                                                   "skill-two",
                                                                   tDoll.skillTwo,
                                                                   (event) => this.tDollSkillTwoChange(event.target.value as number),
                                                                   [...Array(10).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>))}
                </Grid>
            </Grid>
            <Grid container justify="space-between" alignItems="center" className={"echelon-list-element-select-group-row"}>
                <Grid item>
                    {EchelonListElementSelectGroup.selectComponent("Oath",
                                                                   "oath",
                                                                   tDoll.oathed ? 1 : 0,
                                                                   (event) => this.tDollOathChange(event.target.value as number),
                                                                   [...Array(2).keys()].reverse().map(i => <MenuItem key={i} value={i}>{i ? "Yes" : "No"}</MenuItem>))}
                </Grid>
                <Grid item>
                    <Grid item>
                        {EchelonListElementSelectGroup.selectComponent("Mod",
                                                                       "mod",
                                                                       tDoll.mod,
                                                                       (event) => this.tDollModChange(event.target.value as number),
                                                                       [...Array(4).keys()].reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>))}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    }

    private static selectComponent(label: string, labelId: string, value: number, onChange: (event: React.ChangeEvent<{ value: string | number }>) => void, items: JSX.Element[]) {
        return <EchelonSelect label={label} labelId={labelId} value={value} onChange={onChange} items={items}/>;
    }

}

export default hot(module)(EchelonListElementSelectGroup);
