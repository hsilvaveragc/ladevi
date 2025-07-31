import React, { useState, useEffect } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { Formik, Form } from "formik";
import classnames from "classnames";
import * as Yup from "yup";
import { CONSTANTS } from "shared/utils/constants";
import useUser from "shared/security/useUser";
import useAppData from "shared/appData/useAppData";
import ClientData from "./ClientData";
import ClientTaxes from "./ClientTaxes";

const ClientForm = ({
  addMode,
  selectedItem,
  availableTaxes,
  availableTaxCategories,
  saveHandler,
  params,
  ...props
}) => {
  const { userRol, userCountryId, userId } = useUser();
  const { countries } = useAppData();

  const identifications = availableTaxes
    .filter(x => x.isIdentificationField)
    .map(tax => ({
      id: tax.id,
      name: tax.name,
      countryId: tax.countryId,
    }));

  const [activeTab, setActiveTab] = useState("1");

  // Función para determinar qué campos pertenecen a cada tab
  const getTabForField = fieldName => {
    // Campos del tab 1 (Datos)
    const tab1Fields = [
      "brandName",
      "legalName",
      "address",
      "postalCode",
      "countryId",
      "stateId",
      "districtId",
      "cityId",
      "contact",
      "telephoneCountryCode",
      "telephoneAreaCode",
      "telephoneNumber",
      "mainEmail",
      "alternativeEmail",
      "applicationUserSellerId",
      "applicationUserDebtCollectorId",
      "isEnabled",
      "isAgency",
      "isComtur",
    ];

    // Campos del tab 2 (Contables)
    const tab2Fields = [
      "taxTypeId",
      "identificationValue",
      "taxCategoryId",
      "billingPointOfSale",
      "electronicBillByMail",
      "electronicBillByPaper",
      "isBigCompany",
    ];

    if (tab1Fields.includes(fieldName)) return "1";
    if (tab2Fields.includes(fieldName)) return "2";
    return "1"; // Por defecto
  };

  // Función para encontrar el primer tab con errores
  const findFirstTabWithErrors = errors => {
    const errorFields = Object.keys(errors);

    // Verificar si hay errores en el tab 1
    const hasTab1Errors = errorFields.some(
      field => getTabForField(field) === "1"
    );
    if (hasTab1Errors) return "1";

    // Verificar si hay errores en el tab 2
    const hasTab2Errors = errorFields.some(
      field => getTabForField(field) === "2"
    );
    if (hasTab2Errors) return "2";

    return "1"; // Por defecto
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        id: addMode ? "" : selectedItem.id,
        xubioId: addMode ? "" : selectedItem.xubioId ?? "",
        brandName: addMode ? "" : selectedItem.brandName,
        legalName: addMode ? "" : selectedItem.legalName,
        address: addMode ? "" : selectedItem.address,
        contact: addMode ? "" : selectedItem.contact,
        postalCode: addMode ? "" : selectedItem.postalCode,
        telephoneCountryCode: addMode
          ? userRol.isNationalSeller || userRol.isSupervisor
            ? countries.filter(x => x.id === userCountryId)[0].codigoTelefonico
            : ""
          : selectedItem.telephoneCountryCode,
        telephoneAreaCode: addMode ? "" : selectedItem.telephoneAreaCode,
        mainEmail: addMode ? "" : selectedItem.mainEmail,
        alternativeEmail: addMode ? "" : selectedItem.alternativeEmail,
        telephoneNumber: addMode ? "" : selectedItem.telephoneNumber,
        isEnabled: addMode ? true : selectedItem.isEnabled,
        isAgency: addMode ? false : selectedItem.isAgency,
        isComtur: addMode ? userRol.isComturSeller : selectedItem.isComtur,
        cityId: addMode ? "" : selectedItem.cityId,
        countryId: addMode
          ? userRol.isNationalSeller || userRol.isSupervisor
            ? userCountryId
            : ""
          : selectedItem.countryId,
        stateId: addMode ? "" : selectedItem.stateId,
        districtId: addMode ? "" : selectedItem.districtId,
        applicationUserSellerId: addMode
          ? parseFloat(userId)
          : selectedItem.applicationUserSellerId,
        applicationUserDebtCollectorId: addMode
          ? parseFloat(userId)
          : selectedItem.applicationUserDebtCollectorId,
        billingPointOfSale: addMode ? "" : selectedItem.billingPointOfSale,
        electronicBillByMail: addMode
          ? false
          : selectedItem.electronicBillByMail,
        electronicBillByPaper: addMode
          ? false
          : selectedItem.electronicBillByPaper,
        taxTypeId: addMode ? "" : selectedItem.taxTypeId,
        identificationValue: addMode ? "" : selectedItem.identificationValue,
        taxPercentage: addMode ? 0.21 : selectedItem.taxPercentage,
        taxCategoryId: addMode ? "" : selectedItem.taxCategoryId ?? "",
        isBigCompany: addMode ? false : selectedItem.isBigCompany ?? false,
      }}
      onSubmit={(values, { setSubmitting }) => {
        // Ya no eliminamos los guiones, enviamos el CUIT con el formato XX-XXXXXXXX-X
        saveHandler({
          ...values,
          params: params,
        });
        setSubmitting(false);
      }}
      validate={values => {
        // Esta función se ejecuta antes del submit
        // Aquí podemos interceptar y cambiar de tab si hay errores
        const schema = Yup.object().shape({
          brandName: Yup.string().required("Requerido"),
          legalName: Yup.string().required("Requerido"),
          isEnabled: Yup.bool().required("Requerido"),
          address: Yup.string().required("Requerido"),
          postalCode: Yup.string().required("Requerido"),
          countryId: Yup.string().required("Requerido"),
          stateId: Yup.string().required("Requerido"),
          telephoneCountryCode: Yup.string().required("Requerido"),
          telephoneNumber: Yup.string().required("Requerido"),
          isAgency: Yup.bool().required("Requerido"),
          isComtur: Yup.bool().required("Requerido"),
          mainEmail: Yup.string()
            .email("Email invalido")
            .required("Requerido"),
          applicationUserSellerId: Yup.number().required("Requerido"),
          applicationUserDebtCollectorId: Yup.number().required("Requerido"),
          taxCategoryId: Yup.number().required("Requerido"),
          identificationValue: Yup.string()
            .required("Requerido")
            .when("taxTypeId", {
              is: taxTypeId => taxTypeId === CONSTANTS.CUIT_TAX_TYPE_ID,
              then: () =>
                Yup.string()
                  .required("Requerido")
                  .test(
                    "only-numbers",
                    "El CUIT debe contener solo números",
                    value => {
                      if (!value) return false;
                      const numbersOnly = value.replace(/[-_]/g, "");
                      return /^\d+$/.test(numbersOnly);
                    }
                  )
                  .test(
                    "complete-cuit",
                    "El CUIT debe tener 11 dígitos",
                    value => {
                      if (!value) return false;
                      const numbersOnly = value.replace(/[-_]/g, "");
                      return numbersOnly.length === 11 || value.includes("_");
                    }
                  ),
              otherwise: schema =>
                schema.when(["billingPointOfSale", "isComtur"], {
                  is: (billingPointOfSale, isComtur) =>
                    billingPointOfSale === "99" && isComtur === true,
                  then: () =>
                    Yup.string()
                      .required("Requerido")
                      .matches(
                        /^\d{1,8}$/,
                        "Debe ser un número de 1 a 8 dígitos"
                      ),
                  otherwise: () => Yup.string().required("Requerido"),
                }),
            }),
          electronicBillByMail: Yup.boolean().required("Requerido"),
          electronicBillByPaper: Yup.boolean().required("Requerido"),
          taxTypeId: Yup.number().required("Requerido"),
          billingPointOfSale: Yup.string().required("Requerido"),
        });

        try {
          schema.validateSync(values, { abortEarly: false });
          return {};
        } catch (error) {
          const errors = {};
          error.inner.forEach(err => {
            errors[err.path] = err.message;
          });

          // Cambiar al tab que contiene el primer error
          const firstTabWithErrors = findFirstTabWithErrors(errors);
          if (firstTabWithErrors !== activeTab) {
            // Usar setTimeout para asegurar que el cambio de tab ocurra después del render
            setTimeout(() => {
              setActiveTab(firstTabWithErrors);
            }, 100);
          }

          return errors;
        }
      }}
      enableReinitialize={true}
    >
      {formikProps => (
        <Form>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === "1",
                  // Agregar clase visual si hay errores en este tab
                  "has-errors":
                    props.errors &&
                    Object.keys(props.errors).some(
                      field => getTabForField(field) === "1"
                    ),
                })}
                onClick={() => setActiveTab("1")}
                style={{
                  // Opcional: agregar estilo visual para tabs con errores
                  borderColor:
                    props.errors &&
                    Object.keys(props.errors).some(
                      field => getTabForField(field) === "1"
                    )
                      ? "#dc3545"
                      : undefined,
                }}
              >
                Datos
                {/* Opcional: agregar indicador visual de errores */}
                {props.errors &&
                  Object.keys(props.errors).some(
                    field => getTabForField(field) === "1"
                  ) && (
                    <span style={{ color: "#dc3545", marginLeft: "5px" }}>
                      ●
                    </span>
                  )}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === "2",
                  // Agregar clase visual si hay errores en este tab
                  "has-errors":
                    props.errors &&
                    Object.keys(props.errors).some(
                      field => getTabForField(field) === "2"
                    ),
                })}
                onClick={() => {
                  setActiveTab("2");
                }}
                style={{
                  // Opcional: agregar estilo visual para tabs con errores
                  borderColor:
                    props.errors &&
                    Object.keys(props.errors).some(
                      field => getTabForField(field) === "2"
                    )
                      ? "#dc3545"
                      : undefined,
                }}
              >
                Contables
                {/* Opcional: agregar indicador visual de errores */}
                {props.errors &&
                  Object.keys(props.errors).some(
                    field => getTabForField(field) === "2"
                  ) && (
                    <span style={{ color: "#dc3545", marginLeft: "5px" }}>
                      ●
                    </span>
                  )}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <ClientData
                selectedItem={selectedItem}
                addMode={addMode}
                editMode={props.editMode}
                deleteMode={props.deleteMode}
                availableUsers={props.availableUsers}
                availableCities={props.availableCities}
                getCitiesHandler={props.getCitiesHandler}
                getTaxesHandler={props.getTaxesHandler}
                closeHandler={props.closeHandler}
                saveHandler={props.saveHandler}
                errors={props.errors}
                formikProps={formikProps}
              ></ClientData>
            </TabPane>
            <TabPane tabId="2">
              <ClientTaxes
                selectedItem={selectedItem}
                addMode={addMode}
                editMode={props.editMode}
                deleteMode={props.deleteMode}
                availableIdentifications={identifications.filter(
                  x => x.countryId === formikProps.values.countryId
                )}
                availableTaxCategories={
                  formikProps.values.isComtur ||
                  formikProps.values.countryId != CONSTANTS.ARGENTINA_COUNTRY_ID
                    ? availableTaxCategories.filter(
                        x =>
                          x.code == CONSTANTS.CONSUMIDOR_FINAL_TAX_CATEGORY_CODE
                      )
                    : availableTaxCategories
                }
                errors={props.errors}
                formikProps={formikProps}
              />
            </TabPane>
          </TabContent>
        </Form>
      )}
    </Formik>
  );
};

export default ClientForm;
