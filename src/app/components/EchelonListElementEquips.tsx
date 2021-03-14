import React from 'react';
import '../styles/echelon-list-element.less'
import '../styles/echelon-list-doll-class.less'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip} from "@material-ui/core";
import TDoll from "@app/model/TDoll";
import slash from "slash";
import Equip from "@app/model/Equip";
import {EquipSlot} from "@app/model/EquipSlot";
import {EquipType} from "@app/model/EquipType";
import {hot} from "react-hot-loader";
import {CurrentEquipStats, getFormattedStatName, getFormattedStatValue} from "@app/model/EquipStats";

interface EchelonListElementEquipsProps {
    tDoll: TDoll;
    equipPick: (equipSlot: EquipSlot, equip: Equip) => void;
}

interface EchelonListElementEquipsState {
    equipPickerIsOpen: boolean;
    equipPickerSlot: EquipSlot | undefined;
}

class EchelonListElementEquips extends React.Component<EchelonListElementEquipsProps, EchelonListElementEquipsState> {

    readonly state: EchelonListElementEquipsState = {
        equipPickerIsOpen: false,
        equipPickerSlot: undefined
    };

    equipPick = (equip: Equip) => {
        this.props.equipPick(this.state.equipPickerSlot, equip);
        this.equipPickerClose();
    }

    equipPickerOpen = (equipPickerSlot: EquipSlot) => {
        this.setState({equipPickerSlot: equipPickerSlot, equipPickerIsOpen: true})
    }

    equipPickerClose = () => {
        this.setState({equipPickerIsOpen: false})
    }

    EquipTooltip(props: { equip: Equip, children: React.ReactElement }) {
        const maxStats = props.equip.maxStats();

        return <Tooltip arrow
                        title={
                            <div className="echelon-list-element-equip-picker-type-element-tooltip">
                                {props.equip.name()}
                                {Object.keys(maxStats)
                                       .map((stat: keyof CurrentEquipStats) => ({key: stat, value: maxStats[stat]}))
                                       .filter(keyValue => keyValue.value)
                                       .map(keyValue => ({key: getFormattedStatName(keyValue.key), value: getFormattedStatValue(keyValue.key, keyValue.value as number)}))
                                       .map((keyValue, index) => (<div key={index}>{keyValue.key}: {keyValue.value}</div>))
                                }
                            </div>}
                        {...props}>
            {props.children}
        </Tooltip>
    }

    render(): JSX.Element {
        const tDoll = this.props.tDoll;

        return <>
            <Grid container justify="space-between" alignItems="flex-start" className={"echelon-list-element-equips"}>
                {
                    [tDoll?.equipOne,
                     tDoll?.equipTwo,
                     tDoll?.equipThree].map((equip, index) => {
                        return (
                            <Grid key={index} item xs={4}>
                                {equip
                                 ? (<this.EquipTooltip equip={equip}>
                                        <div onClick={() => this.equipPickerOpen(index + 1)}
                                             className={`echelon-list-element-equip equip-rarity${equip.rarity()}`}
                                             style={{backgroundImage: `url("${slash(equip.icon())}")`}}>
                                        </div>
                                    </this.EquipTooltip>)
                                 : tDoll.equipsForSlot(index + 1)
                                   ? (<div onClick={() => this.equipPickerOpen(index + 1)} className={'echelon-list-element-equip pickable'}/>)
                                   : (<div className={'echelon-list-element-equip locked'}/>)}
                            </Grid>
                        );
                    })
                }
            </Grid>

            <Dialog onClose={this.equipPickerClose} open={this.state.equipPickerIsOpen} maxWidth={"xl"}>
                <DialogTitle>Equip picker</DialogTitle>
                <DialogContent>
                    {
                        [...tDoll.equipsForSlot(this.state.equipPickerSlot)]
                            .reduce((accumulator: { equipType: EquipType, equips: Equip[] }[], currentEquip: Equip) => {
                                const equipType = currentEquip.type();
                                const currentGroup = accumulator.find(e => e.equipType === equipType);
                                currentGroup ? currentGroup.equips.push(currentEquip) : accumulator.push({equipType: equipType, equips: [currentEquip]});
                                return accumulator;
                            }, [])
                            .map((equipGroup, index) => (
                                <div key={index} className="echelon-list-element-equip-picker-type">
                                    {equipGroup.equips
                                               .map((equip, index) => (
                                                   <this.EquipTooltip equip={equip} key={index}>
                                                       <div onClick={() => this.equipPick(equip)}
                                                            className={`echelon-list-element-equip-picker-type-element equip-rarity${equip.rarity()}`}
                                                            style={{backgroundImage: `url("${slash(equip.icon())}")`}}>
                                                       </div>
                                                   </this.EquipTooltip>
                                               ))}
                                </div>
                            ))
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.equipPickerClose} color="primary">Cancel</Button>
                    <Button onClick={() => this.equipPick(undefined)} color="primary">Remove equip</Button>
                </DialogActions>
            </Dialog>
        </>
    }

}

export default hot(module)(EchelonListElementEquips);
