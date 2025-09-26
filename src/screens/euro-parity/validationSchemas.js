import * as Yup from "yup";

export const getValidationSchema = data =>
  Yup.object().shape({
    start: Yup.string()
      .required("Requerido")
      .typeError("Inválido"),
    euroToDollarExchangeRate: Yup.string()
      .required("Requerido")
      .test("format", "Solo números con coma decimal", function(value) {
        if (!value) return true; // Si está vacío, la validación required se encargará
        return /^\d+(?:,\d+)?$/.test(value);
      })
      .typeError("Inválido"),
  });
