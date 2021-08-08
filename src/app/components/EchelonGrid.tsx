import {Grid} from '@material-ui/core';
import React from 'react';
import {DragDropContainer, Draggable} from "react-draggable-hoc";
import {hot} from "react-hot-loader";
import logger from "@app/utils/logger";
import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import '../styles/echelon-grid.less'

export type ElementInGrid = {
    getGridPosition: () => EchelonGridPosition;
    setGridPosition: (echelonGridPosition: EchelonGridPosition) => void;
}

interface GridProps<T extends ElementInGrid> {
    elements: T[];
    onUpdate: () => void;
    draggableElement: (element: T) => JSX.Element;
    staticElement: (element: T) => JSX.Element;
}

class EchelonGrid<T extends ElementInGrid> extends React.Component<GridProps<T>> {
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

        const elements = this.props.elements;
        const elementSource = elements.find((element: T) => element.getGridPosition() === sourcePosition);
        if (!elementSource) {
            logger.silly(`echelon grid: no element in position ${EchelonGridPosition[sourcePosition]}; skipping`);
            return;
        }

        logger.silly(`echelon grid: dragged from ${EchelonGridPosition[sourcePosition]} to ${EchelonGridPosition[targetPosition]}`);
        const elementTarget = elements.find((element: T) => element.getGridPosition() === targetPosition);

        if (elementSource) elementSource.setGridPosition(targetPosition);
        if (elementTarget) elementTarget.setGridPosition(sourcePosition);

        this.props.onUpdate();
    }

    render(): JSX.Element {
        return (
            <div className="echelon-grid-container">
                <DragDropContainer>
                    <Grid container justify="space-around" alignItems="center" className={"echelon-grid"}>
                        {[0, 1, 2].map(row => (
                            <Grid container key={row} justify="space-around" alignItems="center" className={"echelon-grid-row"}>
                                {[0, 1, 2].map(col => {
                                    const cellIndex = row * 3 + col;
                                    const elements = this.props.elements;
                                    const element = elements.find(element => cellIndex === element.getGridPosition());
                                    return <div key={col} className="echelon-grid-cell" ref={this.cellRefs[cellIndex]}>
                                        {(() => element ? this.props.staticElement(element) : undefined)()}
                                        <Draggable delay={0}
                                                   detachDelta={0}
                                                   dragProps={cellIndex}
                                                   className="echelon-grid-element-draggable"
                                                   onDragEnd={(state) => this.onDragEnd(cellIndex, state.current.x, state.current.y)}>
                                            <Grid item>{this.props.draggableElement(element)}</Grid>
                                        </Draggable>
                                    </div>;
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
