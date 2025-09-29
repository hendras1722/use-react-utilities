"use client";
import React, { createContext, useContext, useMemo, Children, isValidElement, cloneElement } from "react";
const ConditionalContext = createContext(null);
export function ConditionalGroup({ children }) {
    // Hitung index mana yang harus dirender berdasarkan kondisi
    const matchedIndex = useMemo(() => {
        const childArray = Children.toArray(children);
        for (let i = 0; i < childArray.length; i++) {
            const child = childArray[i];
            if (isValidElement(child)) {
                // Check If component
                if ((child.type?.name === 'If' || child.type === If) && typeof child.props === 'object' && child.props !== null) {
                    if (child.props.condition === true) {
                        return i;
                    }
                }
                // Check ElseIf component
                else if ((child.type?.name === 'ElseIf' || child.type === ElseIf) && typeof child.props === 'object' && child.props !== null) {
                    if (child.props.condition === true) {
                        return i;
                    }
                }
                // Check Else component - selalu match jika belum ada yang match
                else if (child.type?.name === 'Else' || child.type === Else) {
                    return i;
                }
            }
        }
        return -1; // Tidak ada yang match
    }, [children]);
    return (React.createElement(ConditionalContext.Provider, { value: { matchedIndex } }, Children.map(children, (child, index) => {
        if (isValidElement(child)) {
            return cloneElement(child, { ...(child.props || {}), _index: index });
        }
        return child;
    })));
}
export function If({ condition, children, _index }) {
    const context = useContext(ConditionalContext);
    if (!context) {
        // Fallback jika digunakan tanpa ConditionalGroup
        return condition ? React.createElement(React.Fragment, null, children) : null;
    }
    // Render hanya jika ini adalah komponen pertama yang match
    return context.matchedIndex === _index ? React.createElement(React.Fragment, null, children) : null;
}
export function ElseIf({ condition, children, _index }) {
    const context = useContext(ConditionalContext);
    if (!context) {
        // Fallback jika digunakan tanpa ConditionalGroup
        return condition ? React.createElement(React.Fragment, null, children) : null;
    }
    // Render hanya jika ini adalah komponen pertama yang match
    return context.matchedIndex === _index ? React.createElement(React.Fragment, null, children) : null;
}
export function Else({ children, _index }) {
    const context = useContext(ConditionalContext);
    if (!context) {
        // Fallback jika digunakan tanpa ConditionalGroup
        return React.createElement(React.Fragment, null, children);
    }
    // Render hanya jika ini adalah komponen pertama yang match
    return context.matchedIndex === _index ? React.createElement(React.Fragment, null, children) : null;
}
// Show component tetap sama - untuk conditional rendering sederhana
export function Show({ when, children }) {
    return when ? React.createElement(React.Fragment, null, children) : null;
}
// Export sebagai object untuk kemudahan import
export const Cond = {
    If,
    ElseIf,
    Else,
    Show,
    ConditionalGroup,
};
