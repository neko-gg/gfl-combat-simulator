import React from 'react';
import '../styles/battle.less'
import {Checkbox, FormControl, FormControlLabel, FormLabel, List, ListItem, MenuItem, Paper, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";
import {EnemyFairySkill, FairySkill, StrategyFairySkill, StrategyFairySkillInfo, StrategyFairySkillInfoPacket} from "@app/model/StrategyFairySkill";
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
    strategyFairySkillStacks: number[],
    enemyFairySkillEnabled: boolean[],
    enemyFairySkillLevels: number[],
    enemyFairySkillStacks: number[]
}

class Battle extends React.Component<BattleProps, BattleState> {
    private readonly strategyFairySkills = [...Object.keys(StrategyFairySkill)].map((strategyFairySkill: keyof typeof StrategyFairySkill) => StrategyFairySkill[strategyFairySkill]);
    private readonly enemyFairySkills = [...Object.keys(EnemyFairySkill)].map((enemyFairySkill: keyof typeof EnemyFairySkill) => EnemyFairySkill[enemyFairySkill]);

    readonly state: BattleState = {
        strategyFairySkillEnabled: this.strategyFairySkills.map(() => false),
        strategyFairySkillLevels: this.strategyFairySkills.map(strategyFairySkills => strategyFairySkills.maxLevel),
        strategyFairySkillStacks: this.strategyFairySkills.map(strategyFairySkills => strategyFairySkills.maxStacks),
        enemyFairySkillEnabled: this.enemyFairySkills.map(() => false),
        enemyFairySkillLevels: this.enemyFairySkills.map(enemyFairySkills => enemyFairySkills.maxLevel),
        enemyFairySkillStacks: this.enemyFairySkills.map(enemyFairySkills => enemyFairySkills.maxStacks),
    };

    constructor(props: Readonly<BattleProps> | BattleProps) {
        super(props);
        this.setIsDay = this.setIsDay.bind(this);
        this.updateFairySkill = this.updateFairySkill.bind(this);
        this.setStrategyFairySkillEnabled = this.setStrategyFairySkillEnabled.bind(this);
        this.setStrategyFairySkillStack = this.setStrategyFairySkillStack.bind(this);
        this.setStrategyFairySkillLevel = this.setStrategyFairySkillLevel.bind(this);
        this.setEnemyFairySkillEnabled = this.setEnemyFairySkillEnabled.bind(this);
        this.setEnemyFairySkillStack = this.setEnemyFairySkillStack.bind(this);
        this.setEnemyFairySkillLevel = this.setEnemyFairySkillLevel.bind(this);
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
        this.setState(({strategyFairySkillStacks: strategyFairySkillStacks}) => ({
            strategyFairySkillStacks: [
                ...strategyFairySkillStacks.slice(0, index),
                stack,
                ...strategyFairySkillStacks.slice(index + 1)
            ]
        }));
    }

    setStrategyFairySkillLevel(index: number, level: number) {
        this.setState(({strategyFairySkillLevels: strategyFairySkillLevels}) => ({
            strategyFairySkillLevels: [
                ...strategyFairySkillLevels.slice(0, index),
                level,
                ...strategyFairySkillLevels.slice(index + 1)
            ]
        }));
    }

    setEnemyFairySkillEnabled(index: number, enabled: boolean) {
        this.setState(({enemyFairySkillEnabled}) => ({
            enemyFairySkillEnabled: [
                ...enemyFairySkillEnabled.slice(0, index),
                enabled,
                ...enemyFairySkillEnabled.slice(index + 1)
            ]
        }));
    }

    setEnemyFairySkillStack(index: number, stack: number) {
        this.setState(({enemyFairySkillStacks: enemyFairySkillStacks}) => ({
            enemyFairySkillStacks: [
                ...enemyFairySkillStacks.slice(0, index),
                stack,
                ...enemyFairySkillStacks.slice(index + 1)
            ]
        }));
    }

    setEnemyFairySkillLevel(index: number, level: number) {
        this.setState(({enemyFairySkillLevels: enemyFairySkillLevels}) => ({
            enemyFairySkillLevels: [
                ...enemyFairySkillLevels.slice(0, index),
                level,
                ...enemyFairySkillLevels.slice(index + 1)
            ]
        }));
    }

    updateFairySkill(fairySkills: FairySkill[], fairySkillEnabled: boolean[], ipcChannel: string) {
        if (fairySkillEnabled.findIndex(strategyFairySkillEnabled => strategyFairySkillEnabled) < 0) {
            ipcRenderer.send(ipcChannel, undefined);
            return;
        }

        const strategyFairySkillInfos = fairySkills
            .map((fairySkill, i) => fairySkill.getStrategyFairySkillWithIndex(this.state.strategyFairySkillLevels[i], this.state.strategyFairySkillStacks[i]))
            .filter((_, i) => fairySkillEnabled[i])
            .reduce((a, b) => a.concat(b), [])
            .map((strategyFairySkillInfo, i) => ({index: i + 1, strategyFairySkillInfo: strategyFairySkillInfo}))
            .reduce((accumulator: { [key in string]: StrategyFairySkillInfo }, current) => {
                accumulator[current.index] = current.strategyFairySkillInfo;
                return accumulator;
            }, {});

        const strategyFairySkillInfoPacket: StrategyFairySkillInfoPacket = {"1": strategyFairySkillInfos}
        ipcRenderer.send(ipcChannel, strategyFairySkillInfoPacket);
    }


    componentDidUpdate() {
        this.updateFairySkill(this.strategyFairySkills, this.state.strategyFairySkillEnabled, 'fairy-skill-on-team-updated');
        this.updateFairySkill(this.enemyFairySkills, this.state.enemyFairySkillEnabled, 'fairy-skill-on-enemy-updated');
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
                    <this.FairySkillSelector label="Buffs ∕ Debuffs on echelon"
                                             fairySkills={this.strategyFairySkills}
                                             fairySkillEnabled={this.state.strategyFairySkillEnabled}
                                             setFairySkillEnabled={this.setStrategyFairySkillEnabled}
                                             fairySkillLevels={this.state.strategyFairySkillLevels}
                                             setFairySkillLevel={this.setStrategyFairySkillLevel}
                                             fairySkillStacks={this.state.strategyFairySkillStacks}
                                             setFairySkillStack={this.setStrategyFairySkillStack}/>
                </ListItem>
                <ListItem>
                    <this.FairySkillSelector label="Buffs ∕ Debuffs on enemy"
                                             fairySkills={this.enemyFairySkills}
                                             fairySkillEnabled={this.state.enemyFairySkillEnabled}
                                             setFairySkillEnabled={this.setEnemyFairySkillEnabled}
                                             fairySkillLevels={this.state.enemyFairySkillLevels}
                                             setFairySkillLevel={this.setEnemyFairySkillLevel}
                                             fairySkillStacks={this.state.enemyFairySkillStacks}
                                             setFairySkillStack={this.setEnemyFairySkillStack}/>
                </ListItem>
            </List>
        );
    }

    private FairySkillSelector = ({
                                      label,
                                      fairySkills,
                                      fairySkillEnabled,
                                      setFairySkillEnabled,
                                      fairySkillLevels,
                                      setFairySkillLevel,
                                      fairySkillStacks,
                                      setFairySkillStack
                                  }:
                                      {
                                          label: string,
                                          fairySkills: StrategyFairySkill[],
                                          fairySkillEnabled: boolean[],
                                          setFairySkillEnabled: (index: number, enabled: boolean) => void,
                                          fairySkillLevels: number[],
                                          setFairySkillLevel: (index: number, level: number) => void,
                                          fairySkillStacks: number[],
                                          setFairySkillStack: (index: number, stack: number) => void
                                      }) => (
        <div className="battle-list-form-control">
            <FormLabel className="battle-list-item-label" component="legend">{label}</FormLabel>
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
                        {fairySkills.map((fairySkill, i) => (
                            <TableRow key={i}>
                                <TableCell padding="checkbox">
                                    <Checkbox onChange={event => setFairySkillEnabled(i, event.target.checked)}
                                              checked={fairySkillEnabled[i]}/>
                                </TableCell>
                                <TableCell>{fairySkill.name}</TableCell>
                                <TableCell>
                                    <Select className="battle-strategy-skill-select"
                                            value={fairySkillLevels[i]}
                                            onChange={event => setFairySkillLevel(i, event.target.value as number)}
                                            disabled={!fairySkill.maxLevel}>
                                        {fairySkill.maxLevel ? [...Array(fairySkill.maxLevel).keys()].map(i => i + 1)
                                                                                                     .reverse()
                                                                                                     .map(level => (<MenuItem key={level}
                                                                                                                              value={level}>
                                                                                                         {level}
                                                                                                     </MenuItem>))
                                                             : (<MenuItem value={0}>N/A</MenuItem>)}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select className="battle-strategy-skill-select"
                                            value={fairySkillStacks[i]}
                                            onChange={event => setFairySkillStack(i, event.target.value as number)}
                                            disabled={!fairySkill.maxStacks}>
                                        {fairySkill.maxStacks ? [...Array(fairySkill.maxStacks).keys()]
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
        </div>);
}

export default hot(module)(React.memo(Battle));
