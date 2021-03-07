import React from 'react';
import Fairy from "@app/model/Fairy";
import {Textfit} from 'react-textfit';
import slash from "slash";
import '../styles/echelon-fairy.less'
import EchelonSelect from "@app/components/EchelonSelect";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem} from "@material-ui/core";
import {FairyTalent} from "@app/model/FairyTalent";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";
import {fairies} from "@app/model/Fairies";
import {hot} from "react-hot-loader";
import FairyInEchelon from "@app/model/FairyInEchelon";

interface EchelonFairyProps {
    fairyInEchelon: FairyInEchelon;
    updateFairy: () => void;
    pickFairy: (fairyInEchelon: FairyInEchelon) => void;
}

interface EchelonFairyState {
    fairyPickerIsOpen: boolean;
}

class EchelonFairy extends React.Component<EchelonFairyProps, EchelonFairyState> {
    talents = Object.keys(FairyTalent);

    readonly state: EchelonFairyState = {
        fairyPickerIsOpen: false
    };

    updateFairy() {
        this.props.updateFairy();
    }

    updateRarity(rarity: number) {
        this.props.fairyInEchelon.fairy.rarity = rarity;
        this.updateFairy();
    }

    updateTalent(talentIndex: number) {
        this.props.fairyInEchelon.fairy.talent = FairyTalent[this.talents[talentIndex] as keyof typeof FairyTalent];
        this.updateFairy();
    }

    updateLevel(level: number) {
        this.props.fairyInEchelon.fairy.level = level;
        this.updateFairy();
    }

    updateSkill(skill: number) {
        this.props.fairyInEchelon.fairy.skill = skill;
        this.updateFairy();
    }

    updateSkillActive(skillActive: number) {
        this.props.fairyInEchelon.skillActive = !!skillActive;
        this.updateFairy();
    }

    updateTalentTriggers(talentTriggers: number) {
        this.props.fairyInEchelon.talentTriggers = !!talentTriggers;
        this.updateFairy();
    }

    fairyPick = (fairy: Fairy) => {
        this.props.pickFairy(new FairyInEchelon(fairy, true, true));
        this.fairyPickerClose();
    }

    fairyPickerOpen = () => {
        this.setState({fairyPickerIsOpen: true})
    }

    fairyPickerClose = () => {
        this.setState({fairyPickerIsOpen: false})
    }

    render(): JSX.Element {
        const fairyInEchelon = this.props.fairyInEchelon;
        const fairy = fairyInEchelon.fairy;
        const fairyStats = fairy?.stats();
        return (
            <div className="echelon-fairy-container">
                <div className="echelon-fairy-inside-container">
                    <Textfit className="echelon-fairy-name">{fairy ? fairy.name() : 'Select a fairy'}</Textfit>
                    <div className={`echelon-fairy ${fairy ? 'present' : 'not-present'}`}
                         onClick={this.fairyPickerOpen}
                         style={{backgroundImage: `url("${slash(fairy ? fairy.icon() : getStaticPath(path.join('icon', 'misc', 'pick-doll.png')))}")`}}>
                        <div className="echelon-fairy-rarity">
                            <div className="echelon-fairy-rarity-line-one">{"⭐".repeat(Math.min(3, fairy?.effectiveRarity()))}</div>
                            <div className="echelon-fairy-rarity-line-two">
                                <div className={`echelon-fairy-rarity-line-two-element ${!fairy || fairy?.effectiveRarity() < 4 ? "hidden" : undefined}`}>⭐</div>
                                <div className={`echelon-fairy-rarity-line-two-element ${!fairy || fairy?.effectiveRarity() < 5 ? "hidden" : undefined}`}>⭐</div>
                            </div>
                        </div>
                        {(() => {
                            if (!fairy) return undefined;
                            return (
                                <div className="echelon-fairy-stats">
                                    {[Object.keys(fairyStats).map((fairyStat, i) => (<div key={i} className={`echelon-fairy-stats-stat ${fairyStat}`}>{fairyStats[fairyStat as keyof typeof fairyStats]}﹪</div>))]}
                                </div>);
                        })()}
                    </div>
                    <Dialog onClose={this.fairyPickerClose} open={this.state.fairyPickerIsOpen}>
                        <DialogTitle>Fairy picker</DialogTitle>
                        <DialogContent>
                            <div className="echelon-fairy-picker-fairy-container">
                                {fairies.map(fairy => new Fairy(fairy.id))
                                        .map(fairy => (
                                            <div key={fairy.id}
                                                 onClick={() => this.fairyPick(fairy)}
                                                 className="echelon-fairy-picker-fairy"
                                                 style={{backgroundImage: `url("${slash(fairy.icon())}")`}}>
                                                <div className="echelon-fairy-picker-fairy-name-container">
                                                    <Textfit min={1}
                                                             max={12}
                                                             mode="single"
                                                             className="echelon-fairy-picker-fairy-name">
                                                        {fairy.name()}
                                                    </Textfit>
                                                </div>
                                            </div>
                                        ))}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.fairyPickerClose} color="primary">Cancel</Button>
                            <Button onClick={() => this.fairyPick(undefined)} color="primary">Remove fairy</Button>
                        </DialogActions>
                    </Dialog>
                    <>{(() => {
                        if (fairy) {
                            return (<>
                                <div className="echelon-fairy-select-full-width">
                                    <EchelonSelect label="Rarity"
                                                   labelId="fairy-rarity"
                                                   value={fairy.rarity}
                                                   onChange={event => this.updateRarity(event.target.value as number)}
                                                   items={[...Array(5).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{"⭐".repeat(i)}</MenuItem>)}/>
                                </div>
                                <div className="echelon-fairy-select-full-width">
                                    <EchelonSelect label="Talent"
                                                   labelId="fairy-talent"
                                                   value={this.talents.findIndex((talent: keyof typeof FairyTalent) => FairyTalent[talent] === fairy.talent)}
                                                   onChange={event => this.updateTalent(event.target.value as number)}
                                                   items={this.talents.map((talent: keyof typeof FairyTalent, i) => <MenuItem key={i} value={i}>{FairyTalent[talent].name}</MenuItem>)}/>
                                </div>
                                <Grid container justify="space-around" alignItems="flex-start" className={"echelon-fairy-select-group"}>
                                    <Grid container justify="space-around" alignItems="flex-start" className={"echelon-fairy-select-group-row"}>
                                        <Grid item className="echelon-fairy-select-group-element">
                                            <EchelonSelect label="Level"
                                                           labelId="fairy-level"
                                                           value={fairy.level}
                                                           onChange={event => this.updateLevel(event.target.value as number)}
                                                           items={[...Array(100).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                                        </Grid>
                                        <Grid item className="echelon-fairy-select-group-element">
                                            <EchelonSelect label="Skill"
                                                           labelId="fairy-skill"
                                                           value={fairy.skill}
                                                           onChange={event => this.updateSkill(event.target.value as number)}
                                                           items={[...Array(10).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                                        </Grid>
                                    </Grid>
                                    <Grid container justify="space-around" alignItems="flex-start" className={"echelon-fairy-select-group-row"}>
                                        <Grid item className="echelon-fairy-select-group-element">
                                            <EchelonSelect label="Skill active?"
                                                           labelId="fairy-skill-on"
                                                           value={fairyInEchelon.skillActive ? 1 : 0}
                                                           onChange={event => this.updateSkillActive(event.target.value as number)}
                                                           items={[1, 0].map(i => <MenuItem key={i} value={i}>{i ? "Yes" : "No"}</MenuItem>)}/>
                                        </Grid>
                                        <Grid item className="echelon-fairy-select-group-element">
                                            <EchelonSelect label="Talent triggers?"
                                                           labelId="fairy-talent-triggers"
                                                           disabled={5 === fairy.rarity}
                                                           disabledValue="Yes"
                                                           value={5 === fairy.rarity || fairyInEchelon.talentTriggers ? 1 : 0}
                                                           onChange={event => this.updateTalentTriggers(event.target.value as number)}
                                                           items={[1, 0].map(i => <MenuItem key={i} value={i}>{i ? "Yes" : "No"}</MenuItem>)}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>)
                        }
                    })()}</>
                </div>
            </div>
        );
    }
}

export default hot(module)(EchelonFairy);
