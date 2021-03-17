import React from 'react';
import {hot} from 'react-hot-loader';
import '../styles/enemy.less'
import {FormControl, InputLabel, List, ListItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Select from 'react-select-virtualized';
import {enemyCharacterTypes, EnemyInTeam, enemyInTeams, enemyTeams} from "@app/model/EnemyTeam";
import {enemies} from "@app/model/Enemy";
import {Scatter} from "react-chartjs-2";

interface EchelonEnemyProps {
    enemyTeamId: number;
    updateEnemyTeam: (enemyTeamId: number) => void;
}

class EchelonEnemy extends React.Component<EchelonEnemyProps> {

    updateEnemyTeam(enemyTeamId: number) {
        if (!isNaN(enemyTeamId)) {
            this.props.updateEnemyTeam(enemyTeamId);
        }
    }

    toOption(enemyTeamId: number) {
        const enemyLeader = enemyTeams[enemyTeamId]?.enemy_leader;
        const enemyLeaderName = enemyCharacterTypes[enemyLeader]?.name;
        const enemyLeaderSuffix = enemyLeaderName ? ` — ${enemyLeaderName}` : '';

        return {value: enemyTeamId, label: `${enemyTeamId || 0}${enemyLeaderSuffix}`};
    }

    enemiesSelectOptions = Object.keys(enemyInTeams).map(enemyTeamId => this.toOption(Number.parseInt(enemyTeamId)));

    render(): JSX.Element {
        const enemiesInTeam = enemyInTeams[this.props.enemyTeamId];
        return (
            <List>
                <ListItem>
                    <FormControl className="enemy-list-item-form-control">
                        <InputLabel className="enemy-list-item-input-label">Enemy team ID — Leader</InputLabel>
                        <Select className="enemy-list-item-select"
                                value={this.toOption(this.props.enemyTeamId)}
                                isClearable={false}
                                onChange={(event: { value: string }) => this.updateEnemyTeam(Number.parseInt(event?.value))}
                                options={this.enemiesSelectOptions}/>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {['Enemy',
                                      'C.E.',
                                      'Level',
                                      'Links',
                                      'HP',
                                      'Damage',
                                      'RoF',
                                      'Accuracy',
                                      'Evasion',
                                      'Range',
                                      'Armor',
                                      'Movement\xa0speed',
                                      'Armor\xa0penetration',
                                      'Shield\xa0break',
                                      'Max\xa0shield',
                                      'Shield\xa0%'].map((header, i) => (<TableCell key={i}>{header}</TableCell>))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enemiesInTeam.map((enemyInTeam: EnemyInTeam, i: number) => {
                                    const enemy = enemies[enemyInTeam.id];
                                    const enemyStats = enemy.stats();

                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{enemy.name().replaceAll(' ', '\xa0')}</TableCell>
                                            <TableCell>{enemy.combatEffectiveness()}</TableCell>
                                            <TableCell>{enemy.level()}</TableCell>
                                            <TableCell>X{enemy.links()}</TableCell>
                                            <TableCell>{enemyStats.hp}</TableCell>
                                            <TableCell>{enemyStats.damage}</TableCell>
                                            <TableCell>{enemyStats.rof}</TableCell>
                                            <TableCell>{enemyStats.accuracy}</TableCell>
                                            <TableCell>{enemyStats.evasion}</TableCell>
                                            <TableCell>{enemyStats.range}</TableCell>
                                            <TableCell>{enemyStats.armor}</TableCell>
                                            <TableCell>{enemyStats.movementSpeed}</TableCell>
                                            <TableCell>{enemyStats.armorPenetration}</TableCell>
                                            <TableCell>{enemyStats.shieldBreak}</TableCell>
                                            <TableCell>{enemyStats.maxShield}</TableCell>
                                            <TableCell>{enemyStats.shieldPercent}﹪</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ListItem>
                <ListItem>
                    <Paper className="enemy-list-item-paper">
                        <Scatter data={{
                            labels: ['Echelon', 'Enemies'],
                            datasets: [
                                {
                                    label: 'Echelon',
                                    fill: true,
                                    backgroundColor: 'rgba(75,192,192,1)',
                                    pointBorderColor: 'rgba(75,192,192,1)',
                                    pointBackgroundColor: '#fff',
                                    pointBorderWidth: 1,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                                    pointHoverBorderColor: 'rgba(75,192,192,1)',
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 6,
                                    pointHitRadius: 6,
                                    data: [
                                        {x: -1, y: 1},
                                        {x: 1, y: 1},
                                        {x: 3, y: 1},
                                        {x: -1, y: 5},
                                        {x: 1, y: 5},
                                        {x: 3, y: 5},
                                        {x: -1, y: 9},
                                        {x: 1, y: 9},
                                        {x: 3, y: 9}
                                    ]
                                },
                                {
                                    label: 'Enemies',
                                    fill: true,
                                    backgroundColor: 'rgba(247,103,87,1)',
                                    pointBorderColor: 'rgba(247,103,87,1)',
                                    pointBackgroundColor: '#fff',
                                    pointBorderWidth: 1,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: 'rgba(247,103,87,1)',
                                    pointHoverBorderColor: 'rgba(247,103,87,1)',
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 6,
                                    pointHitRadius: 6,
                                    data: enemiesInTeam.map((enemyInTeam: EnemyInTeam) => ({x: enemyInTeam.coordinator_x, y: enemyInTeam.coordinator_y}))
                                }]
                        }}
                                 options={{
                                     tooltips: {
                                         callbacks: {
                                             title: (tooltipItem) => {
                                                 if (tooltipItem[0].datasetIndex === 1) {
                                                     return [...new Set(tooltipItem.map(tooltipItem => {
                                                         const enemy = enemies[enemiesInTeam[tooltipItem.index].id];
                                                         return enemy.name();
                                                     }))].join(', ');
                                                 }
                                                 return `T-Doll`;
                                             },
                                             label: (tooltipItem) => {
                                                 if (tooltipItem.datasetIndex === 1) {
                                                     const enemy = enemies[enemiesInTeam[tooltipItem.index].id];
                                                     return `X${enemy.links()} ${enemy.name()}`;
                                                 }
                                                 return `#${1 + tooltipItem.index}`;
                                             }
                                         },
                                         backgroundColor: '#FFF',
                                         titleFontSize: 16,
                                         titleFontColor: '#0066ff',
                                         bodyFontColor: '#000',
                                         bodyFontSize: 14,
                                         displayColors: false
                                     }
                                 }}/>
                    </Paper>
                </ListItem>
            </List>
        );
    }
}

export default hot(module)(React.memo(EchelonEnemy));
