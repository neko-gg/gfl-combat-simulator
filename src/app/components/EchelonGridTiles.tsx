import {Grid} from '@material-ui/core';
import React from 'react';
import {hot} from "react-hot-loader";
import '../styles/echelon-grid.less'
import TDoll from "@app/model/TDoll";

interface EchelonGridTilesProps {
    tDoll: TDoll;
}

class EchelonGridTiles extends React.Component<EchelonGridTilesProps> {
    render(): JSX.Element {
        return (
            <div className="echelon-grid-doll-tiles">
                <Grid container justify="space-around" alignItems="center">
                    {[0, 1, 2].map(tilesRow => (
                        <Grid container key={tilesRow} justify="space-around" alignItems="center">
                            {[0, 1, 2].map(tilesCol => {
                                const tilesIndex = tilesRow * 3 + tilesCol;
                                const tiles = this.props.tDoll.tiles();
                                return (
                                    <div key={tilesCol}
                                         className={`echelon-grid-doll-tiles-tile ${tilesIndex === tiles.stand
                                                                                    ? 'stand'
                                                                                    : tiles.buffs && tiles.buffs.includes(tilesIndex)
                                                                                      ? 'buffs'
                                                                                      : 'empty'}`}/>)
                            })}
                        </Grid>
                    ))}
                </Grid>
            </div>

        );
    }
}

export default hot(module)(EchelonGridTiles);
