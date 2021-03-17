import React from 'react';
import '../styles/hoc.less'
import {Checkbox, FormLabel, List, ListItem, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import VirtualizedSelect from "react-select-virtualized";
import {hot} from "react-hot-loader";
import ModelHOC, {alliedHOCs, HOCAssistStats} from "@app/model/HOC";
import {ipcRenderer} from "electron";

interface HOCState {
    hocsActive: number[],
    hocs: ModelHOC[];
}

class HOC extends React.Component<unknown, HOCState> {

    readonly state: HOCState = {
        hocsActive: [],
        hocs: [...alliedHOCs]
    };

    constructor(props: unknown) {
        super(props);
        this.updateHoc = this.updateHoc.bind(this);
    }

    setHocsActive(index: number, enabled: boolean) {
        this.setState(({hocsActive}) => {
            if (enabled && !hocsActive.includes(index)) {
                hocsActive.push(index);
            } else if (!enabled && hocsActive.includes(index)) {
                let i = hocsActive.indexOf(index);
                while (i > -1) {
                    hocsActive.splice(i, 1);
                    i = hocsActive.indexOf(index);
                }
            }

            return {hocsActive};
        });
    }

    updateHoc(hocIndex: number, property: keyof ModelHOC, value: ModelHOC[keyof ModelHOC]) {
        this.setState(({hocs}) => {
            const hoc = hocs[hocIndex];
            hoc[property] = value as never;
            return ({hocs: hocs});
        });
    }

    updateHocStat(hocIndex: number, property: keyof HOCAssistStats, value: number) {
        this.setState(({hocs}) => {
            const hoc = hocs[hocIndex];
            hoc.currentStats = {...hoc.currentStats, [property]: value};
            return ({hocs: hocs});
        });
    }

    componentDidUpdate() {
        const hocs = [...this.state.hocs].filter((hoc, index) => this.state.hocsActive.includes(index));
        ipcRenderer.send('hocs-updated', hocs);
    }

    render(): JSX.Element {
        return (
            <List>
                <ListItem>
                    <div className="hoc-list-form-control">
                        <FormLabel className="hoc-list-item-label" component="legend">Allied HOCs</FormLabel>
                        <TableContainer className="hoc-list-item-table" component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="hoc-sticky-column"/>
                                        <TableCell className="hoc-sticky-column-2">HOC</TableCell>
                                        <TableCell>Range</TableCell>
                                        <TableCell>Level</TableCell>
                                        <TableCell>Skill 1</TableCell>
                                        <TableCell>Skill 2</TableCell>
                                        <TableCell>Skill 3</TableCell>
                                        <TableCell>Rarity</TableCell>
                                        <TableCell>Iteration</TableCell>
                                        <TableCell>Lethality</TableCell>
                                        <TableCell>Pierce</TableCell>
                                        <TableCell>Precision</TableCell>
                                        <TableCell>Reload</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[...this.state.hocs].filter(hoc => hoc)
                                                         .map((hoc, i) => {
                                                             const hocBaseStats = hoc.baseStats();
                                                             const hocCurrentStats = hoc.currentStats;
                                                             const hocMaxStats = hoc.maxStats();

                                                             const selectProperties: { property: keyof ModelHOC, min: number, max: number }[] = [
                                                                 {property: 'level', min: 1, max: 100},
                                                                 {property: 'skillOne', min: 1, max: 10},
                                                                 {property: 'skillTwo', min: 1, max: 10},
                                                                 {property: 'skillThree', min: 1, max: 10},
                                                                 {property: 'rarity', min: 1, max: 5},
                                                                 {property: 'iteration', min: 0, max: hoc.maxIteration()}];

                                                             function toOption(option: number) {
                                                                 return {value: `${option}`, label: `${option}`};
                                                             }

                                                             return (
                                                                 <TableRow key={i}>
                                                                     <TableCell padding="checkbox" className="hoc-sticky-column">
                                                                         <Checkbox onChange={event => this.setHocsActive(i, event.target.checked)}
                                                                                   checked={this.state.hocsActive.includes(i)}/>
                                                                     </TableCell>
                                                                     <TableCell className="hoc-sticky-column-2">{hoc.name()}</TableCell>
                                                                     <TableCell>{hoc.range()}</TableCell>
                                                                     {selectProperties.map((hocProperty, propertyIndex) => (
                                                                         <TableCell key={propertyIndex}>
                                                                             <Select className="hoc-select"
                                                                                     value={hoc[hocProperty.property]}
                                                                                     onChange={event => this.updateHoc(i, hocProperty.property, event.target.value as number)}>
                                                                                 {[...Array(hocProperty.max - hocProperty.min + 1).keys()]
                                                                                     .map(i => i + hocProperty.min)
                                                                                     .reverse()
                                                                                     .map(level => (<MenuItem key={level} value={level}>{level}</MenuItem>))}
                                                                             </Select>
                                                                         </TableCell>))}
                                                                     {['lethality',
                                                                       'pierce',
                                                                       'precision',
                                                                       'reload'].map(currentStat => currentStat as keyof HOCAssistStats)
                                                                                .map((currentStat, statIndex) => (
                                                                                    <TableCell key={statIndex}>
                                                                                        <VirtualizedSelect className="hoc-virtualized-select"
                                                                                                           components={{
                                                                                                               IndicatorSeparator: () => null as never
                                                                                                           }}
                                                                                                           menuPortalTarget={document.querySelector("#app")}
                                                                                                           menuPlacement="auto"
                                                                                                           value={toOption(hocCurrentStats[currentStat])}
                                                                                                           isClearable={false}
                                                                                                           onChange={(event: { value: string }) => this.updateHocStat(i, currentStat, Number.parseInt(event?.value))}
                                                                                                           options={[...Array(hocMaxStats[currentStat] - hocBaseStats[currentStat] + 1).keys()]
                                                                                                               .map(i => i + hocBaseStats[currentStat])
                                                                                                               .reverse()
                                                                                                               .map(stat => toOption(stat))}/>
                                                                                    </TableCell>
                                                                                ))}
                                                                 </TableRow>);
                                                         })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </ListItem>
            </List>
        );
    }

}

export default hot(module)(React.memo(HOC));
