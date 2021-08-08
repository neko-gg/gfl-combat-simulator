import React from 'react';
import '../styles/coalition-echelon-list.less'
import CoalitionEchelon from "@app/model/CoalitionEchelon";
import CoalitionEchelonListLeader from "@app/components/CoalitionEchelonListLeader";
import {hot} from "react-hot-loader";
import CoalitionEchelonListElement from "@app/components/CoalitionEchelonListElement";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import slash from "slash";
import CoalitionUnit from "@app/model/CoalitionUnit";
import {allCoalitionUnits, notRingleadersCoalitionUnits} from "@app/model/CoalitionUnits";
import FittyText from "@app/components/FittyText";
import CoalitionUnitInEchelon from "@app/model/CoalitionUnitInEchelon";

interface CoalitionEchelonListProps {
    coalitionEchelon: CoalitionEchelon;
    updateCoalitionEchelon: () => void;
}

interface CoalitionEchelonListState {
    coalitionUnitPickerListPosition: number;
    coalitionUnitPickerIsOpen: boolean;
}

class CoalitionEchelonList extends React.Component<CoalitionEchelonListProps, CoalitionEchelonListState> {
    readonly state: CoalitionEchelonListState = {
        coalitionUnitPickerListPosition: undefined,
        coalitionUnitPickerIsOpen: false
    };

    private firstFreeGridPosition() {
        return [...Array(9).keys()].filter(i => !this.props.coalitionEchelon.unitsInEchelon.map(unitInEchelon => unitInEchelon.gridPosition).includes(i))[0];
    }

    private getGridPosition() {
        const gridPosition = this.props.coalitionEchelon.unitsInEchelon[this.state.coalitionUnitPickerListPosition]?.gridPosition;
        if (gridPosition == undefined) return this.firstFreeGridPosition();
        return gridPosition;
    }

    coalitionUnitPick = (coalitionUnit: CoalitionUnit | undefined) => {
        if (coalitionUnit) {
            this.props.coalitionEchelon.unitsInEchelon = [...this.props.coalitionEchelon.unitsInEchelon.slice(0, this.state.coalitionUnitPickerListPosition),
                                                          new CoalitionUnitInEchelon(coalitionUnit, this.getGridPosition()),
                                                          ...this.props.coalitionEchelon.unitsInEchelon.slice(this.state.coalitionUnitPickerListPosition + 1)];
        } else {
            this.props.coalitionEchelon.unitsInEchelon = [...this.props.coalitionEchelon.unitsInEchelon.slice(0, this.state.coalitionUnitPickerListPosition),
                                                          ...this.props.coalitionEchelon.unitsInEchelon.slice(this.state.coalitionUnitPickerListPosition + 1)];
        }

        this.coalitionUnitPickerClose();
        this.props.updateCoalitionEchelon();
    }


    coalitionUnitPickerOpen = (coalitionUnitListPosition: number) => {
        this.setState({
                          coalitionUnitPickerListPosition: coalitionUnitListPosition,
                          coalitionUnitPickerIsOpen: true
                      });
    }

    coalitionUnitPickerClose = () => {
        this.setState({coalitionUnitPickerIsOpen: false});
    }

    render(): JSX.Element {
        const coalitionEchelon = this.props.coalitionEchelon;
        const leader = coalitionEchelon.leader()?.coalitionUnit;
        const totalCost = coalitionEchelon.unitsInEchelon.map(unitInEchelon => unitInEchelon?.coalitionUnit?.cost()).filter(cost => cost).reduce((a, b) => a + b, 0);

        return <div className="coalition-echelon-list-container">
            <div className="coalition-echelon-list-leader-container">
                <CoalitionEchelonListLeader leader={leader}
                                            coalitionUnitPickerOpen={() => this.coalitionUnitPickerOpen(0)}
                                            updateCoalitionEchelon={this.props.updateCoalitionEchelon}/>
            </div>
            <div className="coalition-echelon-list-elements-container">
                {[2, 4, 6, 8, // this is the way
                  1, 3, 5, 7].map(i => <CoalitionEchelonListElement key={i}
                                                                    previousCoalitionUnit={coalitionEchelon.unitsInEchelon[i - 1]?.coalitionUnit}
                                                                    coalitionUnit={coalitionEchelon.unitsInEchelon[i]?.coalitionUnit}
                                                                    coalitionUnitPickerOpen={() => this.coalitionUnitPickerOpen(i)}
                                                                    updateCoalitionEchelon={this.props.updateCoalitionEchelon}/>)}
                <div className="coalition-echelon-list-total-cost">Coalition cost:&nbsp;
                    <span className={`coalition-echelon-list-total-cost-value${totalCost > 36 ? " coalition-echelon-list-total-cost-value-overflow" : ""}`}>{totalCost}</span>
                    /36
                </div>
            </div>
            <Dialog onClose={this.coalitionUnitPickerClose} open={this.state.coalitionUnitPickerIsOpen}>
                <DialogTitle>Coalition Unit picker</DialogTitle>
                <DialogContent>
                    <div className="coalition-echelon-list-coalition-unit-picker-container">
                        {(this.state.coalitionUnitPickerListPosition > 0
                          ? notRingleadersCoalitionUnits
                          : allCoalitionUnits).map(coalitionUnit => new CoalitionUnit(coalitionUnit.id))
                                              .map(coalitionUnit => (
                                                  <div key={coalitionUnit.id}
                                                       className="coalition-echelon-list-coalition-unit-picker-container-coalition-unit-container">
                                                      <div className="coalition-echelon-list-coalition-unit-name-container">
                                                          <FittyText minSize={1} maxSize={14}>{coalitionUnit.name()}</FittyText>
                                                      </div>
                                                      <div onClick={() => this.coalitionUnitPick(coalitionUnit)}
                                                           className="coalition-echelon-list-coalition-unit-picker-container-coalition-unit"
                                                           style={{backgroundImage: coalitionUnit ? `url("${slash(coalitionUnit.profilePic())}")` : 'none'}}/>
                                                  </div>))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.coalitionUnitPickerClose} color="primary">Cancel</Button>
                    <Button onClick={() => this.coalitionUnitPick(undefined)} color="primary">Remove Coalition Unit</Button>
                </DialogActions>
            </Dialog>
        </div>;
    }
}

export default hot(module)(CoalitionEchelonList);
