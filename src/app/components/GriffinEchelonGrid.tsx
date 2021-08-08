import React from 'react';
import {hot} from "react-hot-loader";
import Echelon from "@app/model/Echelon";
import '../styles/echelon-grid.less'
import slash from "slash";
import {TDollClass} from "@app/model/TDollClass";
import type {ElementInGrid} from "@app/components/EchelonGrid";
import EchelonGrid from "@app/components/EchelonGrid";
import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import TDollInEchelon from "@app/model/TDollInEchelon";
import EchelonGridTiles from "@app/components/EchelonGridTiles";

interface EchelonGridProps {
    echelon: Echelon;
    updateEchelon: () => void;
}

class GriffinEchelonGrid extends React.Component<EchelonGridProps> {
    render(): JSX.Element {
        return <EchelonGrid
            elements={this.props.echelon.tDollsInEchelon.map(tDollInEchelon => ({
                ...tDollInEchelon,
                getGridPosition: () => tDollInEchelon.gridPosition,
                setGridPosition: (gridPosition: EchelonGridPosition) => tDollInEchelon.gridPosition = gridPosition
            }))}
            onUpdate={this.props.updateEchelon}
            draggableElement={(tDollInEchelon: ElementInGrid & TDollInEchelon) => (<div className="echelon-grid-doll" style={{backgroundImage: tDollInEchelon?.tDoll ? `url("${slash(tDollInEchelon.tDoll.chibi())}")` : 'none'}}/>)}
            staticElement={(tDollInEchelon: ElementInGrid & TDollInEchelon) => (
                tDollInEchelon?.tDoll
                ? <>
                    <EchelonGridTiles tDoll={tDollInEchelon.tDoll}/>
                    <div className={`echelon-grid-doll-class ${TDollClass[tDollInEchelon.tDoll?.class()]?.toLowerCase()}`}/>
                </>
                : undefined)}/>
    }
}

export default hot(module)(GriffinEchelonGrid);
