"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormField = exports.Form = void 0;
const react_1 = __importStar(require("react"));
const useComputed_1 = require("../useComputed");
// ====================================================================
// CONTEXT
// ====================================================================
const FormContext = (0, react_1.createContext)(null);
class FormException extends Error {
    constructor(message) {
        super(message);
        this.name = "FormException";
    }
}
// ====================================================================
// SCHEMA DETECTOR
// ====================================================================
const isZodSchema = (schema) => schema && typeof schema.safeParseAsync === "function";
const isYupSchema = (schema) => schema && typeof schema.validate === "function" && schema.__isYupSchema__;
const isJoiSchema = (schema) => schema && typeof schema.validateAsync === "function";
const isValibotSchema = (schema) => schema && typeof schema._parse === "function";
// ====================================================================
// VALIDATORS
// ====================================================================
const getZodErrors = async (state, schema) => {
    const result = await schema.safeParseAsync(state);
    if (!result.success) {
        return result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }
    return [];
};
const getYupErrors = async (state, schema) => {
    try {
        await schema.validate(state, { abortEarly: false });
        return [];
    }
    catch (error) {
        if (error.inner) {
            return error.inner.map((issue) => ({
                path: issue.path ?? "",
                message: issue.message,
            }));
        }
        throw error;
    }
};
const getJoiErrors = async (state, schema) => {
    try {
        await schema.validateAsync(state, { abortEarly: false });
        return [];
    }
    catch (error) {
        if (error.isJoi) {
            return error.details.map((detail) => ({
                path: detail.path.join("."),
                message: detail.message,
            }));
        }
        throw error;
    }
};
const getValibotErrors = async (state, schema) => {
    const result = await schema._parse(state);
    if (result.issues) {
        return result.issues.map((issue) => ({
            path: issue.path?.map((p) => p.key).join(".") || "",
            message: issue.message,
        }));
    }
    return [];
};
// ====================================================================
// FORM COMPONENT - generic implementation + proper typing for forwardRef
// ====================================================================
function FormInner({ children, schema, state, validate = () => [], onSubmit, onError, }, ref) {
    const [errors, setErrors] = (0, react_1.useState)([]);
    const inputsRef = (0, react_1.useRef)({});
    const getErrors = (0, react_1.useCallback)(async () => {
        let errs = await Promise.resolve(validate(state));
        if (schema) {
            if (isZodSchema(schema)) {
                errs = errs.concat(await getZodErrors(state, schema));
            }
            else if (isYupSchema(schema)) {
                errs = errs.concat(await getYupErrors(state, schema));
            }
            else if (isJoiSchema(schema)) {
                errs = errs.concat(await getJoiErrors(state, schema));
            }
            else if (isValibotSchema(schema)) {
                errs = errs.concat(await getValibotErrors(state, schema));
            }
            else {
                throw new Error("Form validation failed: Unsupported form schema");
            }
        }
        return errs;
    }, [schema, state, validate]);
    const performValidation = (0, react_1.useCallback)(async (paths) => {
        const allErrors = await getErrors();
        let nextErrors = allErrors;
        if (paths) {
            const targetPaths = Array.isArray(paths) ? paths : [paths];
            const otherErrors = errors.filter((e) => !targetPaths.includes(e.path));
            const fieldErrors = allErrors.filter((e) => targetPaths.includes(e.path));
            nextErrors = [...otherErrors, ...fieldErrors];
        }
        setErrors(nextErrors);
        return { valid: nextErrors.length === 0, errors: nextErrors };
    }, [errors, getErrors, state]);
    const emitEvent = (0, react_1.useCallback)(async (event) => {
        await performValidation(event.path);
    }, [performValidation]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { valid } = await performValidation();
            if (valid) {
                onSubmit?.({ data: state });
            }
        }
        catch (error) {
            if (error instanceof FormException) {
                const currentErrors = await getErrors();
                onError?.({ errors: currentErrors });
            }
            else {
                console.error("Unexpected error:", error);
            }
        }
    };
    (0, react_1.useImperativeHandle)(ref, () => ({
        validate: async (opts) => {
            if (Array.isArray(opts?.name)) {
                return performValidation(opts?.name);
            }
            return performValidation(opts?.name);
        },
        handleSubmit
    }));
    return (react_1.default.createElement(FormContext.Provider, { value: { errors, emitEvent, inputsRef } },
        react_1.default.createElement("form", { onSubmit: handleSubmit }, children)));
}
exports.Form = (0, react_1.forwardRef)(FormInner);
exports.Form.displayName = "Form";
// ====================================================================
// FORM FIELD
// ====================================================================
const FormField = ({ label, name, children, isError, required }) => {
    const context = (0, react_1.useContext)(FormContext);
    if (!context)
        throw new Error("FormField must be used within a Form");
    const { errors, emitEvent, inputsRef } = context;
    (0, react_1.useEffect)(() => {
        inputsRef.current[name] = name;
        return () => {
            delete inputsRef.current[name];
        };
    }, [name, inputsRef]);
    const error = errors.find((err) => err.path === name);
    const errorMessage = error ? error.message : "";
    const handleBlur = () => {
        void emitEvent({ type: "blur", path: name });
    };
    const handleInput = () => {
        void emitEvent({ type: "input", path: name });
    };
    const handleChange = () => {
        void emitEvent({ type: "change", path: name });
    };
    const labelWording = (0, useComputed_1.useComputed)(() => typeof label === "string" ? label : name);
    return (react_1.default.createElement("div", { className: "my-1.5" },
        react_1.default.createElement("label", { htmlFor: name, className: "block mb-1 font-medium text-gray-700" },
            typeof label === 'function' ? label(labelWording.value) : labelWording.value,
            required && react_1.default.createElement("span", { className: "text-red-500 ml-0.5" }, "*")),
        typeof children === "function"
            ? children({
                onBlur: handleBlur,
                onInput: handleInput,
                onChange: handleChange,
                error: errorMessage,
            })
            : react_1.default.cloneElement(children, {
                onBlur: handleBlur,
                onChange: handleChange,
                id: name,
                name,
            }),
        !isError && errorMessage && (react_1.default.createElement("p", { className: "text-red-500 text-sm mt-1 form-error-field" }, errorMessage))));
};
exports.FormField = FormField;
