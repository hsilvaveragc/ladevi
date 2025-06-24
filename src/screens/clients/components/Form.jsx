import React, { useState, useEffect } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { Formik, Form } from "formik";
import classnames from "classnames";
import * as Yup from "yup";

import ClientData from "./ClientData";
import ClientTaxes from "./ClientTaxes";
import { getAssignedRole } from "shared/services/utils";

const ClientForm = ({
  addMode,
  selectedItem,
  availableTaxes,
  availableTaxCategories,
  saveHandler,
  params,
  ...props
}) => {
  const identifications = availableTaxes
    .filter(x => x.isIdentificationField)
    .map(tax => ({
      id: tax.id,
      name: tax.name,
      countryId: tax.countryId,
    }));

  const userRole = getAssignedRole();
  const userId = localStorage.getItem("userId");
  const userCountryId = parseFloat(localStorage.getItem("userCountryId"));

  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    if (userRole.isSeller || userRole.isSupervisor) {
      props.getStatesHandler(userCountryId);
    }
  }, []);

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        id: addMode ? "" : selectedItem.id,
        // xubioId: addMode ? "" : selectedItem.xubioId ?? "",
        brandName: addMode ? "" : selectedItem.brandName,
        legalName: addMode ? "" : selectedItem.legalName,
        address: addMode ? "" : selectedItem.address,
        contact: addMode ? "" : selectedItem.contact,
        postalCode: addMode ? "" : selectedItem.postalCode,
        telephoneCountryCode: addMode
          ? userRole.isNationalSeller || userRole.isSupervisor
            ? props.availableCountries.filter(x => x.id === userCountryId)[0]
                .codigoTelefonico
            : ""
          : selectedItem.telephoneCountryCode,
        telephoneAreaCode: addMode ? "" : selectedItem.telephoneAreaCode,
        mainEmail: addMode ? "" : selectedItem.mainEmail,
        alternativeEmail: addMode ? "" : selectedItem.alternativeEmail,
        telephoneNumber: addMode ? "" : selectedItem.telephoneNumber,
        isEnabled: addMode ? true : selectedItem.isEnabled,
        isAgency: addMode ? false : selectedItem.isAgency,
        isComtur: addMode ? userRole.isComturSeller : selectedItem.isComtur,
        cityId: addMode ? "" : selectedItem.cityId,
        countryId: addMode
          ? userRole.isNationalSeller || userRole.isSupervisor
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
        // taxCategoryId: addMode ? "" : selectedItem.taxCategoryId,
      }}
      onSubmit={values => {
        saveHandler({
          ...values,
          params: params,
        });
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
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
        applicationUserSellerId: Yup.string().required("Requerido"),
        applicationUserDebtCollectorId: Yup.string().required("Requerido"),
        taxTypeId: Yup.string().required("Requerido"),
        identificationValue: Yup.string().required("Requerido"),
        billingPointOfSale: Yup.string().required("Requerido"),
        electronicBillByMail: Yup.boolean().required("Requerido"),
        electronicBillByPaper: Yup.boolean().required("Requerido"),
        /* taxCategoryId: Yup.string().required("Requerido"),
        taxTypeId: Yup.number().required("Requerido"), // Asegurar que es un número
        identificationValue: Yup.string().when("taxTypeId", {
          is: 2,
          then: () =>
            Yup.string()
              .required("Requerido")
              .matches(
                /^\d{2}-\d{8}-\d{1}$/,
                "El CUIT debe respetar el patrón __-________-_"
              ),
          otherwise: () =>
            Yup.string()
              .required("Requerido")
              .matches(/^\d{1,8}$/, "Debe ser un número de 1 a 8 dígitos"),
        }), */
      })}
    >
      {formikProps => (
        <Form>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => setActiveTab("1")}
              >
                Datos
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === "2",
                })}
                onClick={() => {
                  setActiveTab("2");
                }}
              >
                Contables
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
                availableCountries={props.availableCountries}
                availableStates={props.availableStates}
                availableDistricts={props.availableDistricts}
                availableCities={props.availableCities}
                getCitiesHandler={props.getCitiesHandler}
                getDistrictsHandler={props.getDistrictsHandler}
                getStatesHandler={props.getStatesHandler}
                getTaxesHandler={props.getTaxesHandler}
                closeHandler={props.closeHandler}
                saveHandler={props.saveHandler}
                errors={props.errors}
                formikProps={formikProps}
                isSeller={userRole.isSeller}
                isComtur={userRole.isComturSeller}
                isNationalSeller={userRole.isNationalSeller}
                userCountryId={userCountryId}
                isSupervisor={userRole.isSupervisor}
                isAdmin={userRole.isAdmin}
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
                /* availableTaxCategories={
                  !formikProps.values.countryId
                    ? []
                    : formikProps.values.countryId == 4
                    ? availableTaxCategories
                    : availableTaxCategories.filter(x => x.code == "CF")
                } */
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
