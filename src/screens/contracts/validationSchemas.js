import * as Yup from "yup";

export const getValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().required("Requerido"),
    clientId: Yup.string().required("Requerido"),
    productId: Yup.string().required("Requerido"),
    start: Yup.date().required("Requerido"),
    end: Yup.date().required("Requerido"),
    billingConditionId: Yup.string().required("Requerido"),
    paymentMethodId: Yup.string().required("Requerido"),
    currencyId: Yup.string().required("Requerido"),
    soldSpaces: Yup.array().of(
      Yup.object().shape({
        advertisingSpaceLocationTypeId: Yup.string()
          .required("Requerido")
          .typeError("Requerido"),
        productAdvertisingSpaceId: Yup.string()
          .required("Requerido")
          .typeError("Requerido"),
        quantity: Yup.string()
          .required("Requerido")
          .typeError("Requerido"),
        total: Yup.string()
          .required("Requerido")
          .typeError("Requerido"),
      })
    ),
  });
