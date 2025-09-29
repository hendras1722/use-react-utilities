export const generateFormData = (forms) => {
    const formData = new FormData();
    for (const name in forms) {
        const value = forms[name];
        if (Array.isArray(value)) {
            value.forEach((v) => {
                formData.append(name, v);
            });
        }
        else {
            formData.append(name, value);
        }
    }
    return formData;
};
