import React from 'react';
import '../styles/battle.less'
import {Checkbox, FormControl, FormControlLabel, FormLabel, List, ListItem, MenuItem, Paper, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";
import {StrategyFairySkill, StrategyFairySkillInfo, StrategyFairySkillInfoPacket} from "@app/model/StrategyFairySkill";
import {hot} from "react-hot-loader";
import {ipcRenderer} from "electron";

interface BattleProps {
    isDay: boolean;
    setIsDay: (isDay: boolean) => void;
    nodeBelongsTo: NodeBelongsTo;
    setNodeBelongsTo: (nodeBelongsTo: NodeBelongsTo) => void;
}

interface BattleState {
    strategyFairySkillEnabled: boolean[],
    strategyFairySkillLevels: number[],
    strategyFairySkillStacks: number[]
}

class Battle extends React.Component<BattleProps, BattleState> {
    private strategyFairySkills = [...Object.keys(StrategyFairySkill)].map((strategyFairySkill: keyof typeof StrategyFairySkill) => StrategyFairySkill[strategyFairySkill]);

    readonly state: BattleState = {
        strategyFairySkillEnabled: this.strategyFairySkills.map(() => false),
        strategyFairySkillLevels: this.strategyFairySkills.map(() => 10),
        strategyFairySkillStacks: this.strategyFairySkills.map(strategyFairySkill => strategyFairySkill.maxStacks)
    };

    constructor(props: Readonly<BattleProps> | BattleProps) {
        super(props);
        this.setIsDay = this.setIsDay.bind(this);
    }

    setIsDay = (isDay: boolean) => {
        this.props.setIsDay(isDay);
    };

    setStrategyFairySkillEnabled(index: number, enabled: boolean) {
        this.setState(({strategyFairySkillEnabled}) => ({
            strategyFairySkillEnabled: [
                ...strategyFairySkillEnabled.slice(0, index),
                enabled,
                ...strategyFairySkillEnabled.slice(index + 1)
            ]
        }));
    }

    setStrategyFairySkillStack(index: number, stack: number) {
        this.setState(({strategyFairySkillStacks}) => ({
            strategyFairySkillStacks: [
                ...strategyFairySkillStacks.slice(0, index),
                stack,
                ...strategyFairySkillStacks.slice(index + 1)
            ]
        }));
    }

    setStrategyFairySkillLevel(index: number, level: number) {
        this.setState(({strategyFairySkillLevels}) => ({
            strategyFairySkillLevels: [
                ...strategyFairySkillLevels.slice(0, index),
                level,
                ...strategyFairySkillLevels.slice(index + 1)
            ]
        }));

    }

    componentDidUpdate() {
        if (this.state.strategyFairySkillEnabled.findIndex(strategyFairySkillEnabled => strategyFairySkillEnabled) < 0) {
            ipcRenderer.send('fairy-skill-on-team-updated', undefined);
            return;
        }

        const strategyFairySkillInfos = this.strategyFairySkills
                                            .map((strategyFairySkill, i) => strategyFairySkill.getStrategyFairySkillWithIndex(this.state.strategyFairySkillLevels[i], this.state.strategyFairySkillStacks[i]))
                                            .filter((_, i) => this.state.strategyFairySkillEnabled[i])
                                            .reduce((a, b) => a.concat(b), [])
                                            .map((strategyFairySkillInfo, i) => ({index: i + 1, strategyFairySkillInfo: strategyFairySkillInfo}))
                                            .reduce((accumulator: { [key in string]: StrategyFairySkillInfo }, current) => {
                                                accumulator[current.index] = current.strategyFairySkillInfo;
                                                return accumulator;
                                            }, {});

        const strategyFairySkillInfoPacket: StrategyFairySkillInfoPacket = {"1": strategyFairySkillInfos}
        ipcRenderer.send('fairy-skill-on-team-updated', strategyFairySkillInfoPacket);
    }

    render(): JSX.Element {
        return (
            <List>
                <ListItem>
                    <FormControl className="battle-list-form-control" component="fieldset">
                        <FormLabel className="battle-list-item-label" component="legend">Battle time</FormLabel>
                        <Paper className="battle-list-item-paper">
                            <RadioGroup row>
                                <FormControlLabel className="battle-list-item-radio-label"
                                                  label="Day"
                                                  control={<Radio checked={this.props.isDay}
                                                                  onChange={() => this.setIsDay(true)}/>}/>
                                <FormControlLabel className="battle-list-item-radio-label"
                                                  label="Night"
                                                  control={<Radio checked={!this.props.isDay}
                                                                  onChange={() => this.setIsDay(false)}/>}/>
                            </RadioGroup>
                        </Paper>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className="battle-list-form-control" component="fieldset">
                        <FormLabel className="battle-list-item-label" component="legend">Node captured by</FormLabel>
                        <Paper className="battle-list-item-paper">
                            <RadioGroup row>
                                <FormControlLabel className="battle-list-item-radio-label"
                                                  label="White"
                                                  control={<Radio checked={NodeBelongsTo.WHITE === this.props.nodeBelongsTo}
                                                                  onChange={() => this.props.setNodeBelongsTo(NodeBelongsTo.WHITE)}/>}/>
                                <FormControlLabel className="battle-list-item-radio-label"
                                                  label="Blue"
                                                  control={<Radio checked={NodeBelongsTo.BLUE === this.props.nodeBelongsTo}
                                                                  onChange={() => this.props.setNodeBelongsTo(NodeBelongsTo.BLUE)}/>}/>
                                <FormControlLabel className="battle-list-item-radio-label"
                                                  label="Red"
                                                  control={<Radio checked={NodeBelongsTo.RED === this.props.nodeBelongsTo}
                                                                  onChange={() => this.props.setNodeBelongsTo(NodeBelongsTo.RED)}/>}/>
                                <FormControlLabel className="battle-list-item-radio-label"
                                                  label="Yellow"
                                                  control={<Radio checked={NodeBelongsTo.YELLOW === this.props.nodeBelongsTo}
                                                                  onChange={() => this.props.setNodeBelongsTo(NodeBelongsTo.YELLOW)}/>}/>
                            </RadioGroup>
                        </Paper>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <div className="battle-list-form-control">
                        <FormLabel className="battle-list-item-label" component="legend">Buffs ∕ Debuffs on echelon</FormLabel>
                        <TableContainer className="battle-list-item-table" component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell>Buff ∕ Debuff</TableCell>
                                        <TableCell>Skill Level</TableCell>
                                        <TableCell>Stacks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.strategyFairySkills.map((strategyFairySkill, i) => (
                                        <TableRow key={i}>
                                            <TableCell padding="checkbox">
                                                <Checkbox onChange={event => this.setStrategyFairySkillEnabled(i, event.target.checked)}
                                                          checked={this.state.strategyFairySkillEnabled[i]}/>
                                            </TableCell>
                                            <TableCell>{strategyFairySkill.name}</TableCell>
                                            <TableCell>
                                                <Select className="battle-strategy-skill-select"
                                                        value={this.state.strategyFairySkillLevels[i]}
                                                        onChange={event => this.setStrategyFairySkillLevel(i, event.target.value as number)}>
                                                    {[...Array(10).keys()].map(i => i + 1)
                                                                          .reverse()
                                                                          .map(level => (<MenuItem key={level}
                                                                                                   value={level}>
                                                                              {level}
                                                                          </MenuItem>))}
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select className="battle-strategy-skill-select"
                                                        value={this.state.strategyFairySkillStacks[i]}
                                                        onChange={event => this.setStrategyFairySkillStack(i, event.target.value as number)}
                                                        disabled={!strategyFairySkill.maxStacks}>
                                                    {strategyFairySkill.maxStacks ? [...Array(strategyFairySkill.maxStacks).keys()]
                                                                                      .map(i => i + 1)
                                                                                      .reverse()
                                                                                      .map(stack => (<MenuItem key={stack}
                                                                                                               value={stack}>
                                                                                          {stack}
                                                                                      </MenuItem>))
                                                                                  : (<MenuItem value={0}>N/A</MenuItem>)}
                                                </Select>
                                            </TableCell>
                                        </TableRow>))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </ListItem>
            </List>
        );
    }

}

export default hot(module)(Battle);
