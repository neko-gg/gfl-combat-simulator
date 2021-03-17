import {Grid} from '@material-ui/core';
import React from 'react';
import {DragDropContainer, Draggable} from "react-draggable-hoc";
import {hot} from "react-hot-loader";
import logger from "@app/utils/logger";
import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import Echelon from "@app/model/Echelon";
import '../styles/echelon-grid.less'
import slash from "slash";
import {TDollClass} from "@app/model/TDollClass";
import EchelonGridTiles from "@app/components/EchelonGridTiles";

interface EchelonGridProps {
    echelon: Echelon;
    updateEchelon: () => void;
}

class EchelonGrid extends React.Component<EchelonGridProps> {
    cellRefs = [...Array(9).keys()].map(() => React.createRef<HTMLDivElement>());

    onDragEnd = (sourcePosition: EchelonGridPosition, x: number, y: number) => {
        const targetPosition: EchelonGridPosition = this.cellRefs.findIndex(cellRef => {
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            const cellX = cellRef.current.getBoundingClientRect().left + scrollX;
            const cellY = cellRef.current.getBoundingClientRect().top + scrollY;
            const width = cellRef.current.getBoundingClientRect().width;
            const height = cellRef.current.getBoundingClientRect().height;

            const targetX = x + scrollX;
            const targetY = y + scrollY;

            return targetX > cellX && targetX < cellX + width && targetY > cellY && targetY < cellY + height;
        });

        if (targetPosition < 0) {
            logger.silly(`echelon grid: dragged outside grid area; skipping`);
            return;
        }

        const echelon = this.props.echelon;
        const tDollSource = echelon.tDollsInEchelon.find(tDoll => tDoll.gridPosition === sourcePosition);
        if (!tDollSource) {
            logger.silly(`echelon grid: no doll in position ${EchelonGridPosition[sourcePosition]}; skipping`);
            return;
        }

        logger.silly(`echelon grid: dragged from ${EchelonGridPosition[sourcePosition]} to ${EchelonGridPosition[targetPosition]}`);
        const tDollTarget = echelon.tDollsInEchelon.find(tDoll => tDoll.gridPosition === targetPosition);

        if (tDollSource) tDollSource.gridPosition = targetPosition;
        if (tDollTarget) tDollTarget.gridPosition = sourcePosition;

        this.props.updateEchelon();
    }

    render(): JSX.Element {
        return (
            <div className={"echelon-grid-container"}>
                <DragDropContainer>
                    <Grid container justify="space-around" alignItems="center" className={"echelon-grid"}>
                        {[0, 1, 2].map(row => (
                            <Grid container key={row} justify="space-around" alignItems="center" className={"echelon-grid-row"}>
                                {[0, 1, 2].map(col => {
                                    const cellIndex = row * 3 + col;
                                    const echelon = this.props.echelon;
                                    const tDoll = echelon.tDollsInEchelon.find(tDollInEchelon => cellIndex === tDollInEchelon.gridPosition)?.tDoll;
                                    return (
                                        <div key={col} className="echelon-grid-cell" ref={this.cellRefs[cellIndex]}>
                                            {(() => {
                                                if (!tDoll) return undefined;
                                                return (
                                                    <>
                                                        <div className={`echelon-grid-doll-class ${TDollClass[tDoll.class()]?.toLowerCase()}`}/>
                                                        <EchelonGridTiles tDoll={tDoll}/>
                                                    </>
                                                );
                                            })()}
                                            <Draggable delay={0}
                                                       detachDelta={0}
                                                       dragProps={cellIndex}
                                                       className="echelon-grid-doll-draggable"
                                                       onDragEnd={(state) => this.onDragEnd(cellIndex, state.current.x, state.current.y)}>
                                                <Grid item>
                                                    <div className="echelon-grid-doll"
                                                         style={{backgroundImage: tDoll ? `url("${slash(tDoll.chibi())}")` : 'none'}}>
                                                    </div>
                                                </Grid>
                                            </Draggable>
                                        </div>
                                    );
                                })}
                            </Grid>
                        ))}
                    </Grid>
                </DragDropContainer>
            </div>
        );
    }
}

export default hot(module)(EchelonGrid);
