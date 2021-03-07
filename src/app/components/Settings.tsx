import React from 'react';
import {hot} from 'react-hot-loader';
import '../styles/settings.less'
import {FormControl, IconButton, InputLabel, List, ListItem, Paper, Snackbar} from "@material-ui/core";
import Select from "react-select-virtualized";
import CloseIcon from '@material-ui/icons/Close';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {ipcRenderer} from "electron";
import ip from "ip";
import {CopyToClipboard} from 'react-copy-to-clipboard';

interface SettingsProps {
    proxyPort: number;
    setProxyPort: (proxyPort: number) => void;
}

interface SettingsState {
    openProxyPortToast: boolean;
    proxyPortInUse: number | undefined;
    openCopyProxyAddressToast: boolean;
}


class Settings extends React.Component<SettingsProps, SettingsState> {
    readonly ports = [...Array(65535 - 1024).keys()].map(i => i + 1024).map(port => this.toOption(port));

    readonly state: SettingsState = {
        openProxyPortToast: false,
        proxyPortInUse: undefined,
        openCopyProxyAddressToast: false
    };

    constructor(props: Readonly<SettingsProps> | SettingsProps) {
        super(props);
        this.setProxyPort = this.setProxyPort.bind(this);
        this.openProxyPortToast = this.openProxyPortToast.bind(this);

        ipcRenderer.on('proxy-port-already-in-use', (event: Electron.IpcRendererEvent, arg: number) => {
            this.openProxyPortToast(arg);
        });
    }

    setProxyPort = (port: number) => {
        this.props.setProxyPort(port);
    };

    openProxyPortToast = (port: number) => {
        this.setState({openProxyPortToast: true, proxyPortInUse: port});
    };

    hideProxyPortToast = () => {
        this.setState({openProxyPortToast: false});
    };

    openCopyProxyAddressToast = () => {
        this.setState({openCopyProxyAddressToast: true});
    };

    hideCopyProxyAddressToast = () => {
        this.setState({openCopyProxyAddressToast: false});
    };

    toOption(port: number) {
        return {value: `${port}`, label: `${port}`};
    }

    onCopyProxyAddress() {
        //copy(`${ip.address()}:${this.props.proxyPort}`);
    }

    render(): JSX.Element {
        return (
            <List>
                <ListItem>
                    <FormControl className="settings-list-item-form-control">
                        <InputLabel className="settings-list-item-input-label">Proxy port</InputLabel>
                        <Select className="settings-list-item-select"
                                value={this.toOption(this.props.proxyPort)}
                                isClearable={false}
                                onChange={(event: { value: string }) => this.setProxyPort(Number.parseInt(event?.value))}
                                options={this.ports}/>
                    </FormControl>
                    <Snackbar className="proxy-port-is-use-toast"
                              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                              open={this.state.openProxyPortToast}
                              autoHideDuration={4000}
                              onClose={this.hideProxyPortToast}
                              message={
                                  <div className="proxy-port-is-use-toast-content">
                                      <ErrorOutlineIcon/>
                                      <span className="proxy-port-is-use-toast-content-text">Proxy port {this.state.proxyPortInUse} already in use!</span>
                                  </div>}
                              action={
                                  <React.Fragment>
                                      <IconButton size="small" onClick={this.hideProxyPortToast}>
                                          <CloseIcon fontSize="small"/>
                                      </IconButton>
                                  </React.Fragment>
                              }/>
                </ListItem>
                <ListItem>
                    <FormControl className="settings-list-item-form-control">
                        <InputLabel className="settings-list-item-input-label">Proxy address</InputLabel>
                        <Paper className="settings-list-item-paper">
                            <div className="settings-list-item-paper-div">{ip.address()}:{this.props.proxyPort}</div>
                            <CopyToClipboard text={`${ip.address()}:${this.props.proxyPort}`}
                                             onCopy={this.openCopyProxyAddressToast}>
                                <FileCopyOutlinedIcon className="settings-list-item-copy-icon" onClick={this.onCopyProxyAddress}/>
                            </CopyToClipboard>
                        </Paper>
                    </FormControl>
                    <Snackbar className="copy-proxy-address-to-clipboard-toast"
                              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                              open={this.state.openCopyProxyAddressToast}
                              autoHideDuration={1500}
                              onClose={this.hideCopyProxyAddressToast}
                              message={
                                  <div className="copy-proxy-address-to-clipboard-toast-content">
                                      <ErrorOutlineIcon/>
                                      <span className="copy-proxy-address-to-clipboard-toast-content-text">Proxy address copied to clipboard</span>
                                  </div>}
                              action={
                                  <React.Fragment>
                                      <IconButton size="small" onClick={this.hideCopyProxyAddressToast}>
                                          <CloseIcon fontSize="small"/>
                                      </IconButton>
                                  </React.Fragment>
                              }/>
                </ListItem>
            </List>
        );
    }

}


export default hot(module)(Settings);
