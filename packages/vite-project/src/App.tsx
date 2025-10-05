import { z } from 'zod';
import * as yup from 'yup';
import { ref, useTemplateRef, Template } from 'use-react-utilities'
import { Form, FormField } from './playground/Form'

const yupSchema = yup.object({
  email: yup
    .string().email("Email tidak valid"),
  password: yup.string().required("Password wajib diisi"),
  name: yup
    .string()
    .trim()
    .min(2, "Nama wajib diisi")
    .required("Nama wajib diisi"),
  file: yup
    .mixed<File>()
    .required("File wajib diisi")
    .test("fileSize", "Ukuran file maksimal 2MB", (value) => {
      return value instanceof File ? value.size <= 2 * 1024 * 1024 : false;
    })
    .test("fileType", "Hanya menerima file gambar (jpg/png)", (value) => {
      return value instanceof File
        ? ["image/jpeg", "image/png"].includes(value.type)
        : false;
    }),
});

// choose validation zod or yup
const zodSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  name: z.string().min(2, "Nama wajib diisi"),
  file: z.any(),
})


type FormValues = yup.InferType<typeof yupSchema>;
export default function MyForm() {

  const formState = ref<FormValues>({
    email: "",
    password: "",
    name: "",
    file: undefined as unknown as File,
  })

  const handleSubmit = (e: { data: FormValues }) => {
    console.log("Form submitted ✅:", e.data);
  };
  const handleError = (e: { errors: any[] }) => {
    console.log("Validation errors ❌:", e.errors);
  };

  const formRef = useTemplateRef()

  const validateClick = async () => {
    formRef?.validate({ name: ['email'] })
  };

  return (
    <>
      <button onClick={validateClick}>validate path </button>
      <Form
        ref={formRef}
        state={formState.value}
        schema={zodSchema} // ✅ validasi pakai Zod
        onSubmit={handleSubmit}
        onError={handleError}
      >
        <FormField label={(item) => {
          return (
            <div className='text-blue-300'>
              {item}
            </div>
          )
        }} name="email">
          {
            ({ onChange }) => (
              <input
                type="email"
                value={formState.value.email}
                onChange={(e) => {
                  formState.value.email = e.target.value
                  onChange()
                }}
                className="border p-2 rounded w-full"
              />
            )
          }
          {/* {({ onChange }) => (
            <div>
              <Template name='email'>
                Email Bro
              </Template>
             
        </div>
          )} */}
        </FormField>

        <FormField label="Password" name="password">
          <div>lwjewe</div>
        </FormField>

        <FormField label="Nama" name="name">
          {({ onChange }) => (
            <div>
              <input
                type="text"
                value={formState.value.name}
                onChange={(e) => {
                  formState.value.name = e.target.value
                  onChange()
                }}
                className="border p-2 rounded w-full"
              />
              {/* {error && <span className="text-red-500">{error}</span>} */}
            </div>
          )}
        </FormField>

        <FormField label="File Upload" name="file">
          {({ onChange, error }) => (
            <div>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    formState.value.file = file;
                  }
                  onChange();
                }}
                className="border p-2 rounded w-full"
              />
              {error && <span className="text-red-500">{error}</span>}
            </div>
          )}
        </FormField>

        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </Form >
    </>
  );
}