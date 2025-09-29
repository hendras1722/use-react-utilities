"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElseIf = exports.Else = exports.ConditionalGroup = exports.If = exports.Each = exports.IsComponent = exports.useSlots = exports.Template = void 0;
const Component_1 = __importDefault(require("./Component"));
exports.IsComponent = Component_1.default;
const Each_1 = __importDefault(require("./Each"));
exports.Each = Each_1.default;
const if_1 = require("./if");
Object.defineProperty(exports, "If", { enumerable: true, get: function () { return if_1.If; } });
Object.defineProperty(exports, "ConditionalGroup", { enumerable: true, get: function () { return if_1.ConditionalGroup; } });
Object.defineProperty(exports, "Else", { enumerable: true, get: function () { return if_1.Else; } });
Object.defineProperty(exports, "ElseIf", { enumerable: true, get: function () { return if_1.ElseIf; } });
var Slot_1 = require("./Slot");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return Slot_1.Template; } });
Object.defineProperty(exports, "useSlots", { enumerable: true, get: function () { return Slot_1.useSlots; } });
