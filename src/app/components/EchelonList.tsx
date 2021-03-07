import React from 'react';
import {hot} from 'react-hot-loader';
import '../styles/echelon-list.less'
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import EchelonListElement from "@app/components/EchelonListElement";
import logger from "@app/utils/logger";
import {EchelonListPosition} from "@app/model/EchelonListPosition";
import Echelon from "@app/model/Echelon";

interface EchelonListProps {
    echelon: Echelon;
    updateEchelon: () => void;
}

class EchelonList extends React.Component<EchelonListProps> {
    constructor(props: EchelonListProps) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.updateTDollInEchelon = this.updateTDollInEchelon.bind(this);
    }

    updateTDollInEchelon() {
        this.props.updateEchelon();
    }

    onDragEnd(result: DropResult) {
        if (!result.destination) {
            logger.silly('echelon list: dragged outside list area; skipping');
            return;
        }

        const sourceIndex = result.source.index;
        const targetIndex = result.destination.index;
        logger.silly(`echelon list: dragged from ${EchelonListPosition[sourceIndex]} to ${EchelonListPosition[targetIndex]}`);

        const tDollsInEchelon = [...this.props.echelon.tDollsInEchelon];
        const echelonListPositions = tDollsInEchelon.map(tDoll => tDoll.listPosition)
                                                    .map((echelonListPosition, index) => ({index: index, value: echelonListPosition}))
                                                    .sort((a, b) => a.value > b.value ? 1 : a.value == b.value ? 0 : -1)
                                                    .map((echelonListPositionWithIndex) => echelonListPositionWithIndex.index);

        echelonListPositions.splice(targetIndex, 0, echelonListPositions.splice(sourceIndex, 1)[0]);
        tDollsInEchelon.forEach((tDoll, index) => tDoll.listPosition = echelonListPositions.findIndex(echelonListPosition => echelonListPosition === index));

        this.props.updateEchelon();
    }

    render(): JSX.Element {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided) => (
                        <div ref={provided.innerRef} className="echelon-list-container" {...provided.droppableProps}>
                            {[...this.props
                                .echelon
                                .tDollsInEchelon]
                                .map((tDollInEchelon, index) => ({originalIndex: index, tDollInEchelon: tDollInEchelon}))
                                .sort((a, b) => a.tDollInEchelon.listPosition - b.tDollInEchelon.listPosition)
                                .map((tDollInEchelonWithIndex, index) => (
                                    <Draggable key={tDollInEchelonWithIndex.originalIndex} draggableId={tDollInEchelonWithIndex.originalIndex.toString()} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef}
                                                 className={"echelon-list-item"}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}
                                                 style={provided.draggableProps.style}>
                                                <EchelonListElement tDollInEchelon={tDollInEchelonWithIndex.tDollInEchelon} fairy={this.props.echelon.fairyInEchelon?.fairy} updateTDollInEchelon={this.updateTDollInEchelon}/>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default hot(module)(EchelonList);
