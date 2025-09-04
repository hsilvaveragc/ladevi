import * as Yup from "yup";

export const getValidationSchema = data =>
  Yup.object().shape({
    countryId: Yup.string()
      .test("Country_Unique", "Ya existe una moneda para ese país", function(
        value
      ) {
        const index = data.findIndex(
          c => c.countryId === value && this.parent.id !== c.id
        );
        return index == -1;
      })
      .required("Requerido"),
    name: Yup.string().when("useEuro", {
      is: false,
      then: () => Yup.string().required("Requerido"),
      otherwise: () => Yup.string(),
    }),
    currencyParities: Yup.array().when("useEuro", {
      is: false,
      then: () =>
        Yup.array()
          .of(
            Yup.object().shape({
              start: Yup.string()
                .required("Requerido")
                .typeError("Inválido"),
              localCurrencyToDollarExchangeRate: Yup.string()
                .required("Requerido")
                .test("format", "Solo números con coma decimal", function(
                  value
                ) {
                  if (!value) return true; // Si está vacío, la validación required se encargará
                  return /^\d+(?:,\d+)?$/.test(value);
                })
                .typeError("Inválido"),
            })
          )
          .required("Requerido"),
      otherwise: () =>
        Yup.array().of(
          Yup.object().shape({
            start: Yup.string().nullable(),
            localCurrencyToDollarExchangeRate: Yup.string().nullable(),
          })
        ),
    }),
  });
