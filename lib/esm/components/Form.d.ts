import React from "react";
export interface FormError {
    path: string;
    message: string;
}
export interface FormEvent {
    type: "blur" | "input" | "change" | "submit";
    path: string;
}
export interface FormContextValue {
    errors: FormError[];
    emitEvent: (event: FormEvent) => Promise<void>;
    inputsRef: React.RefObject<Record<string, string>>;
}
export interface FormProps<T = unknown> {
    children: React.ReactNode;
    schema?: any;
    state: T;
    validate?: (state: T) => FormError[] | Promise<FormError[]>;
    onSubmit?: (event: {
        data: T;
    }) => void;
    onError?: (event: {
        errors: FormError[];
    }) => void;
}
export interface FormRef {
    validate: (opts?: {
        name?: string | string[];
    }) => Promise<{
        valid: boolean;
        errors: FormError[];
    }>;
}
export interface FormFieldProps {
    label?: string | ((item: string) => React.ReactNode);
    name: string;
    children: React.ReactNode | ((props: {
        onBlur: () => void;
        onInput: () => void;
        onChange: () => void;
        error: string;
    }) => React.ReactNode);
    isError?: boolean;
    required?: boolean;
}
type FormComponent = <T = unknown>(props: FormProps<T> & {
    ref?: React.Ref<FormRef>;
}) => React.ReactElement | null;
export declare const Form: FormComponent & {
    displayName?: string;
};
export declare const FormField: React.FC<FormFieldProps>;
export {};
