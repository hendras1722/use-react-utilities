import React, { type ReactNode } from "react";
interface IfProps {
    condition: boolean;
    children: ReactNode;
}
interface ElseIfProps {
    condition: boolean;
    children: ReactNode;
}
interface ElseProps {
    children: ReactNode;
}
export declare function ConditionalGroup({ children }: {
    children: ReactNode;
}): React.JSX.Element;
export declare function If({ condition, children, _index }: IfProps & {
    _index?: number;
}): React.JSX.Element | null;
export declare function ElseIf({ condition, children, _index }: ElseIfProps & {
    _index?: number;
}): React.JSX.Element | null;
export declare function Else({ children, _index }: ElseProps & {
    _index?: number;
}): React.JSX.Element | null;
export declare function Show({ when, children }: {
    when: boolean;
    children: ReactNode;
}): React.JSX.Element | null;
export declare const Cond: {
    If: typeof If;
    ElseIf: typeof ElseIf;
    Else: typeof Else;
    Show: typeof Show;
    ConditionalGroup: typeof ConditionalGroup;
};
export {};
