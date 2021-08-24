import React from 'react';
import '../styles/coalition-echelon-list.less'
import {hot} from 'react-hot-loader';
import slash from "slash";
import EchelonSelect from "@app/components/EchelonSelect";
import CoalitionUnit from "@app/model/CoalitionUnit";
import {Rarity} from "@app/model/Rarity";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Tooltip} from "@material-ui/core";
import FittyText from "@app/components/FittyText";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";
import {CoalitionUnitType} from "@app/model/CoalitionUnitType";
import {CoalitionUnitSize} from "@app/model/CoalitionUnitSize";
import CoalitionChip from "@app/model/CoalitionChip";
import {coalitionChips} from "@app/model/CoalitionChips";

interface CoalitionEchelonListLeaderProps {
    leader: CoalitionUnit;
    coalitionUnitPickerOpen: () => void;
    updateCoalitionEchelon: () => void;
}

interface CoalitionEchelonListLeaderState {
    leaderChipIndex: number;
    leaderChipPickerIsOpen: boolean;
}

class CoalitionEchelonListLeader extends React.Component<CoalitionEchelonListLeaderProps, CoalitionEchelonListLeaderState> {
    readonly state: CoalitionEchelonListLeaderState = {
        leaderChipIndex: undefined,
        leaderChipPickerIsOpen: false
    };

    updateRarity(rarity: Rarity) {
        this.props.leader.rarity = rarity;
        this.props.updateCoalitionEchelon();
    }

    updateLevel(value: number) {
        this.props.leader.level = value;
        this.props.updateCoalitionEchelon();
    }

    updateDummies(value: number) {
        this.props.leader.dummies = value;
        this.props.updateCoalitionEchelon();
    }

    updateOath(oathed: number) {
        this.props.leader.oathed = !!oathed;
        this.props.updateCoalitionEchelon();
    }

    updateSize(value: number) {
        this.props.leader.size = value;
        this.props.updateCoalitionEchelon();
    }

    updateAffection(value: number) {
        this.props.leader.affection = value;
        this.props.updateCoalitionEchelon();
    }

    updateSkillOne(value: number) {
        this.props.leader.skillOne = value;
        this.props.updateCoalitionEchelon();
    }

    updateSkillTwo(value: number) {
        this.props.leader.skillTwo = value;
        this.props.updateCoalitionEchelon();
    }

    updateSkillThree(value: number) {
        this.props.leader.skillThree = value;
        this.props.updateCoalitionEchelon();
    }

    updateSkillFour(value: number) {
        this.props.leader.skillFour = value;
        this.props.updateCoalitionEchelon();
    }

    chipPick = (chipId: number | undefined) => {
        const coalitionChip = undefined == chipId ? undefined : new CoalitionChip(chipId);

        if (this.state.leaderChipIndex === 1) {
            this.props.leader.chipOne = coalitionChip;
        } else {
            this.props.leader.chipTwo = coalitionChip;
        }

        this.chipPickerClose();
        this.props.updateCoalitionEchelon();
    }


    chipPickerOpen = (leaderChipIndex: number) => {
        this.setState({
                          leaderChipIndex: leaderChipIndex,
                          leaderChipPickerIsOpen: true
                      });
    }

    chipPickerClose = () => {
        this.setState({leaderChipPickerIsOpen: false});
    }

    render() {
        const leader = this.props.leader;

        if (!leader) return <div className="coalition-echelon-list-leader">
            <div className="coalition-echelon-list-leader-pick" onClick={this.props.coalitionUnitPickerOpen}/>
        </div>

        return <div className="coalition-echelon-list-leader">
            <div className="coalition-echelon-list-leader-name">
                <FittyText minSize={1} maxSize={18}>{leader.name()}</FittyText>
            </div>
            <div className="coalition-echelon-list-leader-picture"
                 onClick={this.props.coalitionUnitPickerOpen}
                 style={{backgroundImage: `url("${slash(leader.profilePic())}")`}}/>
            <div className="coalition-echelon-select-full-width">
                <EchelonSelect label="Rarity"
                               labelId="coalition-unit-rarity"
                               value={leader.rarity}
                               onChange={(event) => this.updateRarity(event.target.value as number)}
                               items={[...Array(leader.maxRarity() - leader.initialRarity() + 1).keys()].map(i => i + leader.initialRarity()).reverse().map(i => <MenuItem key={i} value={i}>{"⭐".repeat(i)}</MenuItem>)}/>
            </div>
            <div className="coalition-echelon-select-block">
                <div className="coalition-echelon-select-block-row">
                    <div className="coalition-echelon-leader-select-block-row-cell">
                        <EchelonSelect label="Level"
                                       labelId="coalition-unit-level"
                                       value={leader.level}
                                       onChange={(event) => this.updateLevel(event.target.value as number)}
                                       items={[...Array(leader.maxLevel() - leader.minLevel() + 1).keys()].map(i => i + leader.minLevel()).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-leader-select-block-row-cell">
                        <EchelonSelect label="Dummies"
                                       labelId="coalition-unit-dummies"
                                       value={leader.dummies}
                                       onChange={(event) => this.updateDummies(event.target.value as number)}
                                       items={[...Array(leader.maxDummies()).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>X{i}</MenuItem>)}/>
                    </div>
                </div>
                <div className="coalition-echelon-select-block-row">
                    <div className="coalition-echelon-leader-select-block-row-cell">
                        {CoalitionUnitType.Ringleader === leader.type()
                         ? <EchelonSelect label="Oath"
                                          labelId="coalition-unit-oath"
                                          value={leader.oathed ? 1 : 0}
                                          onChange={(event) => this.updateOath(event.target.value as number)}
                                          items={[...Array(2).keys()].reverse().map(i => <MenuItem key={i} value={i}>{i ? "Yes" : "No"}</MenuItem>)}/>
                         : <EchelonSelect label="Size"
                                          labelId="coalition-unit-size"
                                          value={leader.size}
                                          onChange={(event) => this.updateSize(event.target.value as number)}
                                          items={[...Array(5).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{Object.values(CoalitionUnitSize)[i - 1]}</MenuItem>)}/>}
                    </div>
                    <div className="coalition-echelon-leader-select-block-row-cell">
                        <EchelonSelect label="Affection"
                                       labelId="coalition-unit-affection"
                                       value={leader.affection}
                                       onChange={(event) => this.updateAffection(event.target.value as number)}
                                       items={[...Array(leader.maxAffection() + 1).keys()].reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                </div>
                <div className="coalition-echelon-select-block-row">
                    <div className="coalition-echelon-leader-select-block-row-cell-small">
                        <EchelonSelect label="Skill 1"
                                       labelId="coalition-unit-skill-one"
                                       value={leader.skillOne}
                                       onChange={(event) => this.updateSkillOne(event.target.value as number)}
                                       items={[...Array(leader.maxSkillOneTwo()).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-leader-select-block-row-cell-small">
                        <EchelonSelect label="Skill 2"
                                       labelId="coalition-unit-skill-two"
                                       value={leader.skillTwo}
                                       onChange={(event) => this.updateSkillTwo(event.target.value as number)}
                                       items={[...Array(leader.maxSkillOneTwo()).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-leader-select-block-row-cell-small">
                        <EchelonSelect label="Skill 3"
                                       labelId="coalition-unit-skill-three"
                                       value={leader.skillThree}
                                       onChange={(event) => this.updateSkillThree(event.target.value as number)}
                                       items={[...Array(5).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-leader-select-block-row-cell-small">
                        <EchelonSelect label="Skill 4"
                                       labelId="coalition-unit-skill-four"
                                       value={leader.skillFour}
                                       onChange={(event) => this.updateSkillFour(event.target.value as number)}
                                       items={[...Array(5).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                </div>
                <div className="coalition-echelon-select-block-row coalition-echelon-select-block-row-spacing">
                    <div className="coalition-echelon-leader-select-block-row-cell-third">
                        <div className="coalition-echelon-leader-select-chips-cost coalition-echelon-leader-select-cost-label">
                            Cost
                            <div className="coalition-echelon-leader-select-cost-cost">{leader.cost()}</div>
                        </div>
                    </div>
                    <div className="coalition-echelon-leader-select-block-row-cell-third">
                        {leader.canEquipChipOne()
                         ? <ChipTooltip chip={leader.chipOne}>
                             <div className="coalition-echelon-leader-select-chips-cost coalition-echelon-leader-select-chip coalition-echelon-leader-select-chip-pickable"
                                  onClick={() => this.chipPickerOpen(1)}
                                  style={{backgroundImage: `url("${slash(leader.chipOne ? leader.chipOne.icon() : getStaticPath(path.join('icon', 'misc', 'pick-equip.png')))}")`}}/>
                         </ChipTooltip>
                         : <div className="coalition-echelon-leader-select-chips-cost coalition-echelon-leader-select-chip"
                                style={{backgroundImage: `url("${slash(getStaticPath(path.join('icon', 'misc', 'lock.png')))}")`}}/>}
                    </div>
                    <div className="coalition-echelon-leader-select-block-row-cell-third">
                        {leader.canEquipChipTwo()
                         ? <ChipTooltip chip={leader.chipTwo}>
                             <div className="coalition-echelon-leader-select-chips-cost coalition-echelon-leader-select-chip coalition-echelon-leader-select-chip-pickable"
                                  onClick={() => this.chipPickerOpen(2)}
                                  style={{backgroundImage: `url("${slash(leader.chipTwo ? leader.chipTwo.icon() : getStaticPath(path.join('icon', 'misc', 'pick-equip.png')))}")`}}/>
                         </ChipTooltip>
                         : <div className="coalition-echelon-leader-select-chips-cost coalition-echelon-leader-select-chip"
                                style={{backgroundImage: `url("${slash(getStaticPath(path.join('icon', 'misc', 'lock.png')))}")`}}/>}
                    </div>
                </div>
            </div>
            <Dialog onClose={this.chipPickerClose} open={this.state.leaderChipPickerIsOpen}>
                <DialogTitle>Coalition Chip picker</DialogTitle>
                <DialogContent>
                    <div className="coalition-echelon-list-coalition-chip-picker-container">
                        {coalitionChips.map(coalitionChip => new CoalitionChip(coalitionChip.id))
                                       .filter(coalitionChip => ![leader.chipOne?.id, leader.chipTwo?.id].includes(coalitionChip.id))
                                       .map(coalitionChip => (
                                           <div key={coalitionChip.id}
                                                onClick={() => this.chipPick(coalitionChip.id)}
                                                className="coalition-echelon-list-coalition-chip-picker-container-chip-container">
                                               <div className="coalition-echelon-list-coalition-chip-picker-container-chip-icon"
                                                    style={{backgroundImage: `url("${slash(coalitionChip.icon())}")`}}/>
                                               <div className="coalition-echelon-list-coalition-chip-picker-container-chip-name-description-container">
                                                   <div className="coalition-echelon-list-coalition-chip-picker-container-chip-name">
                                                       {coalitionChip.name()}
                                                   </div>
                                                   <div className="coalition-echelon-list-coalition-chip-picker-container-chip-name-description">
                                                       {coalitionChip.description()}
                                                   </div>
                                               </div>
                                           </div>))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.chipPickerClose} color="primary">Cancel</Button>
                    <Button onClick={() => this.chipPick(undefined)} color="primary">Remove Coalition Chip</Button>
                </DialogActions>
            </Dialog>
        </div>;
    }
}

function ChipTooltip(props: { chip: CoalitionChip, children: React.ReactElement }) {
    if (!props.chip) return props.children;

    return <Tooltip arrow
                    title={<div className="coalition-echelon-leader-select-chip-tooltip">
                        <div className="coalition-echelon-leader-select-chip-tooltip-name">{props.chip.name()}</div>
                        <div className="coalition-echelon-leader-select-chip-tooltip-description">{props.chip.description()}</div>
                    </div>}
                    {...props}>
        {props.children}
    </Tooltip>
}

export default hot(module)(React.memo(CoalitionEchelonListLeader));
