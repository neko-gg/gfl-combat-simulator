import React from 'react';
import {hot} from 'react-hot-loader';
import '../styles/app.less';
import Echelon from "@app/model/Echelon";
import EchelonGrid from "@app/components/EchelonGrid";
import state from "@app/state/state";
import {ipcRenderer} from "electron";
import EchelonListFairy from "@app/components/EchelonListFairy";
import {AppBar, Tab, Tabs} from "@material-ui/core";
import EchelonEnemy from "@app/components/Enemy";
import Battle from "@app/components/Battle";
import SettingsIcon from '@material-ui/icons/Settings';
import Settings from "@app/components/Settings";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";

interface AppState {
    echelon: Echelon;
    enemyTeamId: number;
    isDay: boolean;
    proxyPort: number;
    nodeBelongsTo: NodeBelongsTo;
    tabIndex: number;
}

class App extends React.Component<unknown, AppState> {
    readonly state: AppState = {
        echelon: state.Instance.echelon,
        enemyTeamId: state.Instance.enemyTeamId,
        isDay: state.Instance.isDay,
        proxyPort: state.Instance.proxyPort,
        nodeBelongsTo: state.Instance.nodeBelongsTo,
        tabIndex: 0
    };

    constructor(props: unknown) {
        super(props);
        this.updateEchelon = this.updateEchelon.bind(this);
        this.updateEnemyTeam = this.updateEnemyTeam.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.setIsDay = this.setIsDay.bind(this);
        this.setProxyPort = this.setProxyPort.bind(this);
        this.setNodeBelongsTo = this.setNodeBelongsTo.bind(this);
    }

    updateEchelon() {
        this.setState({echelon: this.state.echelon});
        ipcRenderer.send('echelon-updated', this.state.echelon);
    }

    updateEnemyTeam(enemyTeamId: number) {
        this.setState({enemyTeamId: enemyTeamId});
        ipcRenderer.send('enemy-updated', enemyTeamId);
    }

    setIsDay(isDay: boolean) {
        this.setState({isDay: isDay});
        ipcRenderer.send('is-day-updated', isDay);
    }

    setProxyPort(port: number) {
        this.setState({proxyPort: port});
        ipcRenderer.send('proxy-port-updated', port);
    }

    setNodeBelongsTo(nodeBelongsTo: NodeBelongsTo) {
        this.setState({nodeBelongsTo: nodeBelongsTo});
        ipcRenderer.send('node-belongs-to-updated', nodeBelongsTo);
    }

    changeTab(event: React.ChangeEvent, newTab: number) {
        this.setState({tabIndex: newTab});
    }

    render(): JSX.Element {
        return <>
            <AppBar position="static" color="default">
                <Tabs value={this.state.tabIndex} onChange={this.changeTab} variant="fullWidth">
                    <Tab label="Echelon"/>
                    <Tab label="Enemy"/>
                    <Tab label="Battle"/>
                    <Tab className="settings-tab-icon" icon={<SettingsIcon/>}/>
                </Tabs>
            </AppBar>
            <TabPanel index={0} value={this.state.tabIndex}>
                <EchelonGrid echelon={this.state.echelon} updateEchelon={this.updateEchelon}/>
                <EchelonListFairy echelon={this.state.echelon} updateEchelon={this.updateEchelon}/>
            </TabPanel>
            <TabPanel index={1} value={this.state.tabIndex}>
                <EchelonEnemy enemyTeamId={this.state.enemyTeamId} updateEnemyTeam={this.updateEnemyTeam}/>
            </TabPanel>
            <TabPanel index={2} value={this.state.tabIndex}>
                <Battle isDay={this.state.isDay} setIsDay={this.setIsDay} nodeBelongsTo={this.state.nodeBelongsTo} setNodeBelongsTo={this.setNodeBelongsTo}/>
            </TabPanel>
            <TabPanel index={3} value={this.state.tabIndex}>
                <Settings proxyPort={this.state.proxyPort} setProxyPort={this.setProxyPort}/>
            </TabPanel>
        </>
    }
}

function TabPanel(props: { index: number, value: number, children?: React.ReactNode }) {
    const {children, value, index, ...other} = props;

    return (
        <div role="tabpanel"
             hidden={value !== index}
             {...other}>
            {children}
        </div>
    );
}

export default hot(module)(App);
