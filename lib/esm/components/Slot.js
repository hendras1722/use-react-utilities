"use client";
import React from "react";
export function Template(_props) {
    return null;
}
// Helper function untuk extract slots dari children
export function useSlots(children) {
    const slots = {};
    const scopedSlots = {};
    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === Template) {
            const { name = "default", children: slotChildren } = child.props;
            if (typeof slotChildren === "function") {
                scopedSlots[name] = slotChildren;
            }
            else {
                slots[name] = slotChildren;
            }
        }
    });
    return { slots, scopedSlots };
}
