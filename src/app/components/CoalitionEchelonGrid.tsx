import React from 'react';
import '../styles/echelon-grid.less'
import slash from "slash";
import type {ElementInGrid} from "@app/components/EchelonGrid";
import GenericGrid from "@app/components/EchelonGrid";
import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import CoalitionEchelon from "@app/model/CoalitionEchelon";
import CoalitionUnitInEchelon from "@app/model/CoalitionUnitInEchelon";
import {hot} from 'react-hot-loader';

interface CoalitionEchelonGridProps {
    coalitionEchelon: CoalitionEchelon;
    updateCoalitionEchelon: () => void;
}

class CoalitionEchelonGrid extends React.Component<CoalitionEchelonGridProps> {
    render(): JSX.Element {
        return <div className="coalition-echelon-grid-container">
            <GenericGrid
                elements={this.props.coalitionEchelon.unitsInEchelon.map(unitInEchelon => ({
                    ...unitInEchelon,
                    getGridPosition: () => unitInEchelon.gridPosition,
                    setGridPosition: (gridPosition: EchelonGridPosition) => unitInEchelon.gridPosition = gridPosition
                }))}
                onUpdate={this.props.updateCoalitionEchelon}
                draggableElement={(unitInEchelon: ElementInGrid & CoalitionUnitInEchelon) => <div className="coalition-echelon-grid-unit" style={{backgroundImage: unitInEchelon?.coalitionUnit ? `url("${slash(unitInEchelon.coalitionUnit.chibi())}")` : 'none'}}/>}
                staticElement={() => undefined}/>
        </div>;
    }
}

export default hot(module)(CoalitionEchelonGrid);
