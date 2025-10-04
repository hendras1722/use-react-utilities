import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

// ====================================================================
// TYPES
// ====================================================================
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
  onSubmit?: (event: { data: T }) => void;
  onError?: (event: { errors: FormError[] }) => void;
}

export interface FormRef {
  validate: (opts?: { name?: string | string[] }) => Promise<{ valid: boolean; errors: FormError[] }>;
}


export interface FormFieldProps {
  label?: string;
  name: string;
  children:
  | React.ReactNode
  | ((
    props: {
      onBlur: () => void;
      onInput: () => void;
      onChange: () => void;
      error: string;
    }
  ) => React.ReactNode);
  isError?: boolean;
}

// ====================================================================
// CONTEXT
// ====================================================================
const FormContext = createContext<FormContextValue | null>(null);

class FormException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormException";
  }
}

// ====================================================================
// SCHEMA DETECTOR
// ====================================================================
const isZodSchema = (schema: any): boolean =>
  schema && typeof schema.safeParseAsync === "function";

const isYupSchema = (schema: any): boolean =>
  schema && typeof schema.validate === "function" && schema.__isYupSchema__;

const isJoiSchema = (schema: any): boolean =>
  schema && typeof schema.validateAsync === "function";

const isValibotSchema = (schema: any): boolean =>
  schema && typeof schema._parse === "function";

// ====================================================================
// VALIDATORS
// ====================================================================
const getZodErrors = async (state: any, schema: any): Promise<FormError[]> => {
  const result = await schema.safeParseAsync(state);
  if (!result.success) {
    return result.error.issues.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  return [];
};

const getYupErrors = async (state: any, schema: any): Promise<FormError[]> => {
  try {
    await schema.validate(state, { abortEarly: false });
    return [];
  } catch (error: any) {
    if (error.inner) {
      return error.inner.map((issue: any) => ({
        path: issue.path ?? "",
        message: issue.message,
      }));
    }
    throw error;
  }
};

const getJoiErrors = async (state: any, schema: any): Promise<FormError[]> => {
  try {
    await schema.validateAsync(state, { abortEarly: false });
    return [];
  } catch (error: any) {
    if (error.isJoi) {
      return error.details.map((detail: any) => ({
        path: detail.path.join("."),
        message: detail.message,
      }));
    }
    throw error;
  }
};

const getValibotErrors = async (state: any, schema: any): Promise<FormError[]> => {
  const result = await schema._parse(state);
  if (result.issues) {
    return result.issues.map((issue: any) => ({
      path: issue.path?.map((p: any) => p.key).join(".") || "",
      message: issue.message,
    }));
  }
  return [];
};

// ====================================================================
// FORM COMPONENT - generic implementation + proper typing for forwardRef
// ====================================================================
function FormInner<T>(
  {
    children,
    schema,
    state,
    validate = () => [],
    onSubmit,
    onError,
  }: FormProps<T>,
  ref: React.Ref<FormRef>
) {
  const [errors, setErrors] = useState<FormError[]>([]);
  const inputsRef = useRef<Record<string, string>>({});

  const getErrors = useCallback(async (): Promise<FormError[]> => {
    let errs = await Promise.resolve(validate(state));

    if (schema) {
      if (isZodSchema(schema)) {
        errs = errs.concat(await getZodErrors(state, schema));
      } else if (isYupSchema(schema)) {
        errs = errs.concat(await getYupErrors(state, schema));
      } else if (isJoiSchema(schema)) {
        errs = errs.concat(await getJoiErrors(state, schema));
      } else if (isValibotSchema(schema)) {
        errs = errs.concat(await getValibotErrors(state, schema));
      } else {
        throw new Error("Form validation failed: Unsupported form schema");
      }
    }

    return errs;
  }, [schema, state, validate]);

  const performValidation = useCallback(
    async (paths?: string | string[]) => {
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
    },
    [errors, getErrors, state]
  );


  const emitEvent = useCallback(
    async (event: FormEvent): Promise<void> => {
      await performValidation(event.path);
    },
    [performValidation]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { valid } = await performValidation();
      if (valid) {
        onSubmit?.({ data: state });
      }
    } catch (error) {
      if (error instanceof FormException) {
        const currentErrors = await getErrors();
        onError?.({ errors: currentErrors });
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    validate: async (opts?: { name?: string | string[] }) => {
      if (Array.isArray(opts?.name)) {
        return performValidation(opts?.name);
      }
      return performValidation(opts?.name);
    },
  }));


  return (
    <FormContext.Provider value={{ errors, emitEvent, inputsRef }}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
}

// cast forwardRef to a generic component type so JSX usage can infer T from props
type FormComponent = <T = unknown>(
  props: FormProps<T> & { ref?: React.Ref<FormRef> }
) => React.ReactElement | null;

export const Form = forwardRef(FormInner) as FormComponent & {
  displayName?: string;
};

Form.displayName = "Form";

// ====================================================================
// FORM FIELD
// ====================================================================
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  children,
  isError,
}) => {
  const context = useContext(FormContext);
  if (!context) throw new Error("FormField must be used within a Form");

  const { errors, emitEvent, inputsRef } = context;

  useEffect(() => {
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

  return (
    <div className="my-1.5">
      {label && (
        <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
          {label}
        </label>
      )}
      {typeof children === "function"
        ? children({
          onBlur: handleBlur,
          onInput: handleInput,
          onChange: handleChange,
          error: errorMessage,
        })
        : React.cloneElement(children as React.ReactElement<any>, {
          onBlur: handleBlur,
          onChange: handleChange,
          id: name,
          name,
        })}
      {!isError && errorMessage && (
        <p className="text-red-500 text-sm mt-1 form-error-field">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
