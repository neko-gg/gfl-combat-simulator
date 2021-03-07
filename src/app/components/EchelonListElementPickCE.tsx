import React from 'react';
import '../styles/echelon-list-element.less'
import '../styles/echelon-list-doll-class.less'
import {hot} from "react-hot-loader";
import {Grid} from "@material-ui/core";
import TDoll from "@app/model/TDoll";
import AnimatedNumber from "animated-number-react";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";
import Fairy from "@app/model/Fairy";
import {ceil} from "@app/utils/math";

interface EchelonListElementPickCEProps {
    tDoll: TDoll;
    tDollPick: (tDoll: TDoll) => void;
    tDollPickerOpen: () => void;
    fairy: Fairy;
}

class EchelonListElementPickCE extends React.Component<EchelonListElementPickCEProps> {

    tDollPick = (tDoll: TDoll) => {
        this.props.tDollPick(tDoll);
    }

    render(): JSX.Element {
        const tDoll = this.props.tDoll;

        return <>
            <Grid container justify="space-between" alignItems="flex-start" className={"echelon-list-element-pick-ce-group"}>
                <Grid container justify="space-between" alignItems="center" className={"chelon-list-element-pick-ce-row"}>
                    <Grid item xs={6}>
                        <div className="echelon-list-element-ce">
                            <div className="echelon-list-element-ce-label">Combat Efficiency</div>
                            <AnimatedNumber value={tDoll.combatEffectiveness(this.props.fairy?.stats())}
                                            formatValue={(value: number) => ceil(value)}
                                            duration={500}/>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="echelon-list-element-pick">
                            <img className="echelon-list-element-pick-img"
                                 onClick={this.props.tDollPickerOpen}
                                 src={getStaticPath(path.join('icon', 'misc', 'pick-doll.png'))}
                                 alt="open T-Doll picker"/>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </>
    }

}

export default hot(module)(EchelonListElementPickCE);
