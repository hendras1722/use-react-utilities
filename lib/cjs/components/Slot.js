"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = Template;
exports.useSlots = useSlots;
const react_1 = __importDefault(require("react"));
function Template(_props) {
    return null;
}
// Helper function untuk extract slots dari children
function useSlots(children) {
    const slots = {};
    const scopedSlots = {};
    react_1.default.Children.forEach(children, (child) => {
        if (react_1.default.isValidElement(child) && child.type === Template) {
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
