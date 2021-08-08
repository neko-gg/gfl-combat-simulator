import React from 'react';
import '../styles/coalition-echelon-list.less'
import {hot} from 'react-hot-loader';
import CoalitionUnit from "@app/model/CoalitionUnit";
import {Rarity} from "@app/model/Rarity";
import FittyText from "@app/components/FittyText";
import EchelonSelect from "@app/components/EchelonSelect";
import {MenuItem} from "@material-ui/core";
import {CoalitionUnitSize} from "@app/model/CoalitionUnitSize";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";

interface CoalitionEchelonListElementProps {
    previousCoalitionUnit: CoalitionUnit;
    coalitionUnit: CoalitionUnit;
    coalitionUnitPickerOpen: () => void;
    updateCoalitionEchelon: () => void;
}

class CoalitionEchelonListElement extends React.Component<CoalitionEchelonListElementProps> {

    updateRarity(rarity: Rarity) {
        this.props.coalitionUnit.rarity = rarity;
        this.props.updateCoalitionEchelon();
    }

    updateLevel(value: number) {
        this.props.coalitionUnit.level = value;
        this.props.updateCoalitionEchelon();
    }

    updateDummies(value: number) {
        this.props.coalitionUnit.dummies = value;
        this.props.updateCoalitionEchelon();
    }

    updateSize(value: number) {
        this.props.coalitionUnit.size = value;
        this.props.updateCoalitionEchelon();
    }

    updateAffection(value: number) {
        this.props.coalitionUnit.affection = value;
        this.props.updateCoalitionEchelon();
    }

    updateSkillOne(value: number) {
        this.props.coalitionUnit.skillOne = value;
        this.props.updateCoalitionEchelon();
    }

    updateSkillTwo(value: number) {
        this.props.coalitionUnit.skillTwo = value;
        this.props.updateCoalitionEchelon();
    }

    render() {
        if (!this.props.previousCoalitionUnit) return <div className="coalition-echelon-list-elements-element-no-unit-unpickable"/>;

        const coalitionUnit = this.props.coalitionUnit;
        if (!coalitionUnit) return <div className="coalition-echelon-list-elements-element-no-unit-pickable"
                                        onClick={this.props.coalitionUnitPickerOpen}/>;

        return <div className="coalition-echelon-list-elements-element">
            <div className="coalition-echelon-list-element-name-container">
                <FittyText minSize={1} maxSize={14}>{coalitionUnit.name()}</FittyText>
            </div>
            <div className="coalition-echelon-select-full-width">
                <EchelonSelect label="Rarity"
                               labelId="coalition-unit-rarity"
                               value={coalitionUnit.rarity}
                               onChange={(event) => this.updateRarity(event.target.value as number)}
                               items={[...Array(coalitionUnit.maxRarity() - coalitionUnit.initialRarity() + 1).keys()].map(i => i + coalitionUnit.initialRarity()).reverse().map(i => <MenuItem key={i} value={i}>{"⭐".repeat(i)}</MenuItem>)}/>
            </div>
            <div className="coalition-echelon-select-block">
                <div className="coalition-echelon-select-block-row">
                    <div className="coalition-echelon-element-select-block-row-cell">
                        <EchelonSelect label="Level"
                                       labelId="coalition-unit-level"
                                       value={coalitionUnit.level}
                                       onChange={(event) => this.updateLevel(event.target.value as number)}
                                       items={[...Array(coalitionUnit.maxLevel() - coalitionUnit.minLevel() + 1).keys()].map(i => i + coalitionUnit.minLevel()).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-element-select-block-row-cell">
                        <EchelonSelect label="Size"
                                       labelId="coalition-unit-size"
                                       value={coalitionUnit.size}
                                       onChange={(event) => this.updateSize(event.target.value as number)}
                                       items={[...Array(5).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{Object.values(CoalitionUnitSize)[i - 1]}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-element-select-block-row-cell">
                        <EchelonSelect label="Dummies"
                                       labelId="coalition-unit-dummies"
                                       value={coalitionUnit.dummies}
                                       onChange={(event) => this.updateDummies(event.target.value as number)}
                                       items={[...Array(coalitionUnit.maxDummies()).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>X{i}</MenuItem>)}/>
                    </div>
                </div>
                <div className="coalition-echelon-select-block-row">
                    <div className="coalition-echelon-element-select-block-row-cell">
                        <EchelonSelect label="Skill 1"
                                       labelId="coalition-unit-skill-one"
                                       value={coalitionUnit.skillOne}
                                       onChange={(event) => this.updateSkillOne(event.target.value as number)}
                                       items={[...Array(coalitionUnit.maxSkillOneTwo()).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-element-select-block-row-cell">
                        <EchelonSelect label="Skill 2"
                                       labelId="coalition-unit-skill-two"
                                       value={coalitionUnit.skillTwo}
                                       onChange={(event) => this.updateSkillTwo(event.target.value as number)}
                                       items={[...Array(coalitionUnit.maxSkillOneTwo()).keys()].map(i => i + 1).reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                    <div className="coalition-echelon-element-select-block-row-cell">
                        <EchelonSelect label="Affection"
                                       labelId="coalition-unit-affection"
                                       value={coalitionUnit.affection}
                                       onChange={(event) => this.updateAffection(event.target.value as number)}
                                       items={[...Array(coalitionUnit.maxAffection() + 1).keys()].reverse().map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}/>
                    </div>
                </div>
                <div className="coalition-echelon-element-cost-pick-row">
                    <div className="coalition-echelon-element-cost-label">
                        Cost: <span className="coalition-echelon-element-cost">{coalitionUnit.cost()}</span>
                    </div>
                    <div className="coalition-echelon-element-cost-pick-pick">
                        <img className="coalition-echelon-element-cost-pick-pick-img"
                             onClick={this.props.coalitionUnitPickerOpen}
                             src={getStaticPath(path.join('icon', 'misc', 'pick-sangvis.png'))}
                             alt="open Coalition Unit picker"/>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default hot(module)(React.memo(CoalitionEchelonListElement));
