import React from 'react';
import {hot} from 'react-hot-loader';
import fitty from "fitty";

interface FittyTextProps {
    minSize?: number;
    maxSize?: number;
    multiLine?: boolean;
}

class FittyText extends React.Component<FittyTextProps> {
    private readonly fittyTextRef: React.RefObject<HTMLDivElement>;

    constructor(props: FittyTextProps) {
        super(props);
        this.fittyTextRef = React.createRef();
    }

    componentDidUpdate() {
        this.fitSize();
    }

    componentDidMount() {
        this.fitSize();
    }

    private fitSize() {
        if (this.fittyTextRef?.current) fitty(this.fittyTextRef.current, this.props);
    }

    render() {
        return <div ref={this.fittyTextRef}>{this.props.children}</div>;
    }
}

export default hot(module)(FittyText);
