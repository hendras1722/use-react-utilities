"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
// Enhanced Dynamic Component with proper ref forwarding
const Component = react_1.default.forwardRef(({ is: isProp, ...props }, ref) => {
    // Renaming 'is' to 'isProp' to avoid conflict with the component
    const ComponentToRender = isProp;
    // Use React.createElement to dynamically render the component
    // This correctly passes the 'ref' and other 'props'
    return react_1.default.createElement(ComponentToRender, { ...props, ref });
});
exports.default = Component;
