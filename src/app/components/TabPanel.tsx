import React from "react";

export function TabPanel(props: { index: number, value: number, children?: React.ReactNode }): JSX.Element {
    const {children, value, index, ...other} = props;

    return (
        <div role="tabpanel"
             hidden={value !== index}
             {...other}>
            {children}
        </div>
    );
}
