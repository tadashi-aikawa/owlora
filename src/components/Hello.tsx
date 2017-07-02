import * as React from "react";

export interface HelloProps {
    compiler: string;
    framework: string;
}

export const Hello = (props: HelloProps) =>
    <span>
        <h1>Owlora</h1>
        <h2>Use {props.compiler} and {props.framework}</h2>
    </span>
;

