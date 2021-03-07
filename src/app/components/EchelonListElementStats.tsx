import React from 'react';
import '../styles/echelon-list-element.less'
import '../styles/echelon-list-doll-class.less'
import {hot} from "react-hot-loader";
import {Grid} from "@material-ui/core";
import TDoll from "@app/model/TDoll";
import Fairy from "@app/model/Fairy";

interface EchelonListElementStatsProps {
    tDoll: TDoll;
    fairy: Fairy;
}

class EchelonListElementStats extends React.Component<EchelonListElementStatsProps> {

    render(): JSX.Element {
        const tDoll = this.props.tDoll;
        const tDollStats = tDoll.stats(this.props.fairy?.stats());

        return <Grid container justify="space-between" alignItems="center" className="echelon-list-element-stats-container">
            {(() => {
                const classStatValues = [
                    {class: 'hp', value: tDollStats.hp},
                    {class: 'damage', value: tDollStats.damage},
                    {class: 'rof', value: tDollStats.rof},
                    {class: 'accuracy', value: tDollStats.accuracy},
                    {class: 'evasion', value: tDollStats.evasion},
                    {class: 'movement-speed', value: tDollStats.movementSpeed},
                    {class: 'armor', value: tDollStats.armor},
                    {class: 'armor-penetration', value: tDollStats.armorPenetration},
                    {class: 'critical-rate', value: `${tDollStats.criticalRate}﹪`},
                    {class: 'critical-damage', value: `${tDollStats.criticalDamage + 100}﹪`},
                    {class: 'rounds', value: `${tDollStats.rounds}`}
                ];

                return [...Array(Math.ceil(classStatValues.length / 2)).keys()]
                    .map(i => i * 2)
                    .map(i => classStatValues.slice(i, i + 2))
                    .map((stats, index) => {
                        const cell = (left: boolean) => <Grid item className={`echelon-list-element-stats-cell-${left ? 'left' : 'right'}`}>
                            <span className={`echelon-list-element-stat-icon ${stats[left ? 0 : 1].class}`}/>
                            <span className="echelon-list-element-stat-value">{stats[left ? 0 : 1].value}</span>
                        </Grid>

                        const leftCell = cell(true)
                        const rightCell = stats.length < 2 ? undefined : cell(false);

                        return <Grid container justify="space-between" alignItems="center" key={index} className="echelon-list-element-stats-row">
                            {leftCell}
                            {rightCell}
                        </Grid>
                    })
            })()}
        </Grid>
    }

}

export default hot(module)(EchelonListElementStats);
