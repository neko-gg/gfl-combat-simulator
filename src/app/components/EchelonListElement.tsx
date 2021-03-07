import React from 'react';
import '../styles/echelon-list-element.less'
import '../styles/echelon-list-doll-class.less'
import TDollInEchelon from "@app/model/TDollInEchelon";
import {Textfit} from 'react-textfit';
import {hot} from "react-hot-loader";
import TDoll from "@app/model/TDoll";
import EchelonListElementClassRarity from "@app/components/EchelonListElementClassRarity";
import EchelonListElementStats from "@app/components/EchelonListElementStats";
import EchelonListElementSelectGroup from "@app/components/EchelonListElementSelectGroup";
import EchelonListElementEquips from "@app/components/EchelonListElementEquips";
import EchelonListElementPickCE from "@app/components/EchelonListElementPickCE";
import Equip from "@app/model/Equip";
import {EquipSlot} from "@app/model/EquipSlot";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, Typography} from "@material-ui/core";
import {TDollClass} from "@app/model/TDollClass";
import {tDolls} from "@app/model/TDolls";
import slash from "slash";
import Fairy from "@app/model/Fairy";

interface EchelonListElementProps {
    tDollInEchelon: TDollInEchelon;
    updateTDollInEchelon: () => void;
    fairy: Fairy;
}

interface EchelonListElementState {
    tDollPickerIsOpen: boolean;
    tDollPickerTab: number;
}

class EchelonListElement extends React.Component<EchelonListElementProps, EchelonListElementState> {
    readonly state: EchelonListElementState = {
        tDollPickerIsOpen: false,
        tDollPickerTab: 0
    };

    updateTDoll = () => {
        this.props.updateTDollInEchelon();
    }

    tDollPick = (tDoll: TDoll) => {
        this.tDollPickerClose();
        this.props.tDollInEchelon.tDoll = tDoll;
        this.props.updateTDollInEchelon();
    }

    tDollPickerOpen = () => {
        this.setState({tDollPickerIsOpen: true});
    }

    tDollPickerClose = () => {
        this.setState({tDollPickerIsOpen: false});
    }

    tDollPickerTabChange = (newTab: number) => {
        this.setState({tDollPickerTab: newTab});
    }

    equipPick = (equipSlot: EquipSlot, equip: Equip) => {
        switch (equipSlot) {
            case EquipSlot.ONE:
                this.props.tDollInEchelon.tDoll.equipOne = equip;
                break;
            case EquipSlot.TWO:
                this.props.tDollInEchelon.tDoll.equipTwo = equip;
                break;
            case EquipSlot.THREE:
                this.props.tDollInEchelon.tDoll.equipThree = equip;
                break;
        }
        this.props.updateTDollInEchelon();
    }

    render(): JSX.Element {
        const tDoll = this.props.tDollInEchelon.tDoll;

        return (<>
            {tDoll ? <div className="echelon-list-element-container">
                       <Textfit min={1} max={14} className="echelon-list-element-name">
                           {tDoll.name()}
                       </Textfit>
                       <EchelonListElementClassRarity tDoll={tDoll} updateTDoll={this.updateTDoll}/>
                       <EchelonListElementStats tDoll={tDoll} fairy={this.props.fairy}/>
                       <EchelonListElementSelectGroup tDoll={tDoll} updateTDoll={this.updateTDoll}/>
                       <EchelonListElementEquips tDoll={tDoll} equipPick={this.equipPick}/>
                       <EchelonListElementPickCE tDoll={tDoll} tDollPick={this.tDollPick} tDollPickerOpen={this.tDollPickerOpen} fairy={this.props.fairy}/>
                   </div>
                   : <div className="echelon-list-element-container-no-tdoll"
                          onClick={this.tDollPickerOpen}/>}
            <Dialog onClose={this.tDollPickerClose} open={this.state.tDollPickerIsOpen}>
                <DialogTitle>T-Doll picker</DialogTitle>
                <DialogContent>
                    <div>
                        <Tabs value={this.state.tDollPickerTab}
                              variant="fullWidth"
                              onChange={(event, newTab: TDollClass) => this.tDollPickerTabChange(newTab)}>
                            {Object.keys(TDollClass)
                                   .filter(key => 'number' === typeof TDollClass[key as never])
                                   .map(key => <Tab key={TDollClass[key as never]} className="echelon-list-element-tdoll-picker-tab" label={key}/>)}
                        </Tabs>
                        {Object.keys(TDollClass)
                               .filter(key => 'number' === typeof TDollClass[key as never])
                               .map((key, index) => (
                                   <Typography component="div"
                                               key={index}
                                               role="tabpanel"
                                               hidden={this.state.tDollPickerTab !== index}>
                                       <div className="echelon-list-element-tdoll-picker-tdoll-container">
                                           {this.state.tDollPickerTab === index &&
                                           tDolls.filter(tDoll => TDollClass[tDoll.class()] === key)
                                                 .map(tDoll => new TDoll(tDoll.id))
                                                 .map(tDoll => (
                                                     <div key={tDoll.id}
                                                          onClick={() => this.tDollPick(tDoll)}
                                                          className="echelon-list-element-tdoll-picker-tdoll"
                                                          style={{backgroundImage: tDoll ? `url("${slash(tDoll.profilePic())}")` : 'none'}}>
                                                         <div className="echelon-list-element-tdoll-picker-tdoll-name-container">
                                                             <Textfit min={1}
                                                                      max={14}
                                                                      mode="single"
                                                                      className="echelon-list-element-tdoll-picker-tdoll-name">
                                                                 {tDoll.name()}
                                                             </Textfit>
                                                         </div>
                                                     </div>
                                                 ))}
                                       </div>
                                   </Typography>))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.tDollPickerClose} color="primary">Cancel</Button>
                    <Button onClick={() => this.tDollPick(undefined)} color="primary">Remove T-Doll</Button>
                </DialogActions>
            </Dialog>
        </>);

    }

}

export default hot(module)(EchelonListElement);
