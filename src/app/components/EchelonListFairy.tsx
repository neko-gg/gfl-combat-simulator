import React from 'react';
import {hot} from 'react-hot-loader';
import '../styles/echelon-list-fairy.less'
import EchelonList from "@app/components/EchelonList";
import EchelonFairy from "@app/components/EchelonFairy";
import Echelon from "@app/model/Echelon";
import FairyInEchelon from "@app/model/FairyInEchelon";

interface EchelonListFairyProps {
    echelon: Echelon;
    updateEchelon: () => void;
}

class EchelonListFairy extends React.Component<EchelonListFairyProps> {

    constructor(props: EchelonListFairyProps) {
        super(props);
        this.pickFairy = this.pickFairy.bind(this);
    }

    pickFairy(fairyInEchelon: FairyInEchelon) {
        this.props.echelon.fairyInEchelon = fairyInEchelon;
        this.props.updateEchelon();
    }

    render(): JSX.Element {
        return (
            <div className="echelon-list-fairy-container">
                <EchelonList echelon={this.props.echelon} updateEchelon={this.props.updateEchelon}/>
                <EchelonFairy fairyInEchelon={this.props.echelon.fairyInEchelon} updateFairy={this.props.updateEchelon} pickFairy={this.pickFairy}/>
            </div>
        );
    }
}

export default hot(module)(EchelonListFairy);
