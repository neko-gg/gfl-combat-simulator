import React from 'react';
import {hot} from 'react-hot-loader';
import '../styles/battle.less'
import {FormControl, FormControlLabel, FormLabel, List, ListItem, Paper, Radio, RadioGroup} from "@material-ui/core";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";

interface BattleProps {
    isDay: boolean;
    setIsDay: (isDay: boolean) => void;
    nodeBelongsTo: NodeBelongsTo;
    setNodeBelongsTo: (nodeBelongsTo: NodeBelongsTo) => void;
}

class Battle extends React.Component<BattleProps> {

    constructor(props: Readonly<BattleProps> | BattleProps) {
        super(props);
        this.setIsDay = this.setIsDay.bind(this);
    }

    setIsDay = (isDay: boolean) => {
        this.props.setIsDay(isDay);
    };

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
            </List>
        );
    }

}

export default hot(module)(Battle);
