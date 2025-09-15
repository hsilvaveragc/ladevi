import React from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import "shared/utils/extensionsMethods.js";
import { SaveButton, RemoveConfirmButton } from "shared/components/Buttons";
import { CurrencyFields } from "./FormFields";
import ParityGrid from "./ParityGrid";
import { useCurrencyForm } from "../hooks/useCurrencyForm";
import { getValidationSchema } from "../validationSchemas";
import { getAssignedRole } from "shared/services/utils";

const CurrencyFormContainer = styled.div`
  width: 30vw;
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1.8rem;
  }

  .parity-grid-fieldset {
    width: 100%;
    border: 1px solid black;
    padding: 0 1.4em 1.4em 1.4em;
    margin: 0 0 1.5em 0;

    legend {
      font-size: 1.2em;
      font-weight: bold;
      text-align: left;
      width: auto;
      padding: 0 10px;
      border-bottom: none;
    }
  }
`;

const FormContent = ({
  availableCountries,
  formikProps,
  errors,
  deleteMode,
  isSupervisor,
  editMode,
  selectedItem,
  closeHandler,
  saveHandler,
  addMode,
  isLoading,
}) => {
  const { handleCheckboxChange, handleNameChange } = useCurrencyForm(
    formikProps
  );

  return (
    <Form autoComplete="off">
      <CurrencyFields
        formikProps={formikProps}
        errors={errors}
        deleteMode={deleteMode}
        isSupervisor={isSupervisor}
        handleNameChange={handleNameChange}
        handleCheckboxChange={handleCheckboxChange}
        availableCountries={availableCountries}
      />
      <ParityGrid
        editMode={editMode}
        deleteMode={deleteMode}
        selectedItem={selectedItem}
        formikProps={formikProps}
      />
      <div className="button-container">
        <SaveButton onClickHandler={closeHandler}>Cancelar</SaveButton>
        {deleteMode ? (
          <RemoveConfirmButton
            loading={isLoading}
            onClickHandler={() => saveHandler({ ...formikProps.values })}
          />
        ) : (
          <SaveButton type="submit">
            {addMode ? "Agregar" : null}
            {editMode ? "Guardar" : null}
          </SaveButton>
        )}
      </div>
    </Form>
  );
};

const CurrencyForm = ({
  selectedItem,
  deleteMode,
  editMode,
  addMode,
  saveHandler,
  closeHandler,
  availableCountries,
  errors,
  params,
  data,
  isLoading,
}) => {
  const userRole = getAssignedRole();
  const userCountryId = parseFloat(localStorage.getItem("userCountryId"));

  const getInitialValues = () => ({
    id: addMode ? "" : selectedItem.id,
    countryId: addMode
      ? userRole.isSupervisor
        ? userCountryId
        : ""
      : selectedItem.countryId,
    useEuro: addMode ? false : selectedItem.useEuro,
    name: addMode ? "" : selectedItem.name,
    currencyParities: getCurrencyParitiesInitialValues(),
  });

  const getCurrencyParitiesInitialValues = () => {
    if (
      addMode ||
      (selectedItem.useEuro && selectedItem.currencyParities.length === 0)
    ) {
      return [
        {
          id: 0,
          start: "",
          end: "",
          localCurrencyToDollarExchangeRate: "",
          shouldDelete: false,
        },
      ];
    }

    return selectedItem.currencyParities
      .map(pcp => ({
        ...pcp,
        start: pcp.start,
        end: pcp.end,
        localCurrencyToDollarExchangeRate: pcp.localCurrencyToDollarExchangeRate.toLocaleCurrency(),
        shouldDelete: false,
      }))
      .sort((a, b) => (a.start < b.start ? -1 : 1));
  };

  return (
    <CurrencyFormContainer>
      <h3>
        {addMode && "Agregar Moneda"}
        {editMode && "Editar Moneda"}
        {deleteMode && "Eliminar Moneda"}
      </h3>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema(data)}
        onSubmit={values => {
          saveHandler({ ...values, params });
        }}
      >
        {formikProps => (
          <FormContent
            formikProps={formikProps}
            errors={errors}
            deleteMode={deleteMode}
            isSupervisor={userRole.isSupervisor}
            editMode={editMode}
            selectedItem={selectedItem}
            closeHandler={closeHandler}
            saveHandler={saveHandler}
            addMode={addMode}
            availableCountries={availableCountries}
            isLoading={isLoading}
          />
        )}
      </Formik>
    </CurrencyFormContainer>
  );
};

export default CurrencyForm;
