"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayMap;
const react_1 = require("react");
function ArrayMap({ of, render }) {
    return react_1.Children.toArray(of.map((item, index) => render(item, index)));
}
