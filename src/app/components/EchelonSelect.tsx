import React from 'react';
import '../styles/echelon-list-element.less'
import '../styles/echelon-list-doll-class.less'
import {hot} from "react-hot-loader";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

interface EchelonSelectProps {
    label: string;
    labelId: string;
    value: number;
    disabled?: boolean;
    disabledValue?: string;
    onChange: (event: React.ChangeEvent<{ value: string | number }>) => void;
    items: JSX.Element[]
}

class EchelonSelect extends React.Component<EchelonSelectProps> {

    render(): JSX.Element {
        const disabled = this.props.disabled ? this.props.disabled : undefined === this.props.value;
        return <div className="echelon-list-element-select-container">
            <InputLabel shrink className="echelon-list-element-select-label" id={`echelon-list-element-${this.props.labelId}-select-label`}>{this.props.label}</InputLabel>
            <FormControl size="small" variant="outlined" className="echelon-list-element-select-form-control">
                <Select className="echelon-list-element-select-select"
                        disabled={disabled}
                        IconComponent={() => null}
                        MenuProps={{disableScrollLock: true}}
                        labelId={`echelon-list-element-${this.props.labelId}-select-label`}
                        displayEmpty={true}
                        value={disabled ? '' : this.props.value}
                        onChange={this.props.onChange}
                        inputProps={{name: this.props.labelId}}>
                    {disabled ? <MenuItem value="" disabled>{this.props.disabledValue || 'N/A'}</MenuItem> : this.props.items}
                </Select>
            </FormControl>
        </div>
    }


}

export default hot(module)(EchelonSelect);
