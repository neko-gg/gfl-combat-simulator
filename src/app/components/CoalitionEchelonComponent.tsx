import React from 'react';
import {hot} from 'react-hot-loader';
import '../styles/coalition-echelon-component.less'
import CoalitionEchelonGrid from "@app/components/CoalitionEchelonGrid";
import CoalitionEchelon from "@app/model/CoalitionEchelon";
import CoalitionEchelonList from "@app/components/CoalitionEchelonList";

interface EchelonCoalitionProps {
    coalitionEchelon: CoalitionEchelon;
    updateCoalitionEchelon: () => void;
}

class CoalitionEchelonComponent extends React.Component<EchelonCoalitionProps> {
    constructor(props: EchelonCoalitionProps) {
        super(props);
        this.updateCoalitionUnitInEchelon = this.updateCoalitionUnitInEchelon.bind(this);
    }

    updateCoalitionUnitInEchelon() {
        this.props.updateCoalitionEchelon();
    }

    render(): JSX.Element {
        return <div className="coalition-echelon-component-container">
            <CoalitionEchelonGrid coalitionEchelon={this.props.coalitionEchelon}
                                  updateCoalitionEchelon={this.updateCoalitionUnitInEchelon}/>
            <CoalitionEchelonList coalitionEchelon={this.props.coalitionEchelon}
                                  updateCoalitionEchelon={this.updateCoalitionUnitInEchelon}/>
        </div>;

    }
}

export default hot(module)(CoalitionEchelonComponent);
