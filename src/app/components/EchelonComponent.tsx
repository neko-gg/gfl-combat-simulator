import React from 'react';
import Echelon from "@app/model/Echelon";
import '../styles/echelon-component.less'
import EchelonGrid from "@app/components/GriffinEchelonGrid";
import EchelonListFairy from "@app/components/EchelonListFairy";
import {hot} from "react-hot-loader";
import {AppBar, Tab, Tabs} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {TabPanel} from "@app/components/TabPanel";
import EchelonCoalition from "@app/components/CoalitionEchelonComponent";
import CoalitionEchelon from "@app/model/CoalitionEchelon";
import {ipcRenderer} from "electron";

interface EchelonComponentState {
    tabIndex: number;
}

interface EchelonComponentProps {
    echelon: Echelon;
    updateEchelon: () => void;
    coalitionEchelon: CoalitionEchelon;
    updateCoalitionEchelon: () => void;
}

class EchelonComponent extends React.Component<EchelonComponentProps, EchelonComponentState> {
    readonly state: EchelonComponentState = {
        tabIndex: 0
    };

    constructor(props: EchelonComponentProps) {
        super(props);
        this.changeTab = this.changeTab.bind(this);
    }

    changeTab(event: React.ChangeEvent, newTab: number) {
        ipcRenderer.send('selected-echelon-type-updated', newTab ? 'coalition' : 'griffin');
        this.setState({tabIndex: newTab});
    }

    render(): JSX.Element {
        return (
            <div className="echelon-component-container">
                <AppBar position="static" color="primary" className="echelon-component-app-bar">
                    <Tabs value={this.state.tabIndex} onChange={this.changeTab} variant="fullWidth">
                        <Tab label="Griffin"/>
                        <Tab label="Coalition"/>
                    </Tabs>
                </AppBar>
                <SwipeableViews axis="x"
                                index={this.state.tabIndex}
                                onChangeIndex={index => this.changeTab(undefined, index)}>
                    <TabPanel index={0} value={this.state.tabIndex}>
                        <EchelonGrid echelon={this.props.echelon} updateEchelon={this.props.updateEchelon}/>
                        <EchelonListFairy echelon={this.props.echelon} updateEchelon={this.props.updateEchelon}/>
                    </TabPanel>
                    <TabPanel index={1} value={this.state.tabIndex}>
                        <EchelonCoalition coalitionEchelon={this.props.coalitionEchelon} updateCoalitionEchelon={this.props.updateCoalitionEchelon}/>
                    </TabPanel>
                </SwipeableViews>
            </div>
        );
    }
}

export default hot(module)(EchelonComponent);
