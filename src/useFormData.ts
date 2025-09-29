export const generateFormData = <
  T extends Record<string, string | File | (string | File)[]>
>(
  forms: T
): FormData => {
  const formData = new FormData()

  for (const name in forms) {
    const value = forms[name]

    if (Array.isArray(value)) {
      value.forEach((v) => {
        formData.append(name, v)
      })
    } else {
      formData.append(name, value)
    }
  }

  return formData
}
