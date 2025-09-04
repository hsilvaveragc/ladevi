import React from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import useUser from "shared/security/useUser";
import "shared/utils/extensionsMethods.js";
import InputDatePickerField from "shared/components/InputDatePickerField";
import InputTextField from "shared/components/InputTextField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import { getValidationSchema } from "../validationSchemas";

const EuroFormContainer = styled.div`
  width: 30vw;
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1.8rem;
  }
`;

const FormContent = ({
  formikProps,
  errors,
  deleteMode,
  isSupervisor,
  closeHandler,
  saveHandler,
}) => {
  return (
    <Form autoComplete="off">
      <div className="form-group">
        <InputTextField
          labelText="Paridad Euro y U$S"
          name="euroToDollarExchangeRate"
          disabled={deleteMode}
          error={errors.euroToDollarExchangeRate}
        />
      </div>
      <div className="form-group">
        <InputDatePickerField
          labelText="Paridad Fecha Inicio"
          name="start"
          disabled={deleteMode || isSupervisor}
          error={errors.Start}
        ></InputDatePickerField>
      </div>
      <div className="button-container">
        {deleteMode ? (
          <>
            <SaveButton onClickHandler={closeHandler}>Cancelar</SaveButton>
            <DangerButton
              type="button"
              onClickHandler={() => saveHandler({ ...formikProps.values })}
            >
              Eliminar
            </DangerButton>
          </>
        ) : (
          <>
            <DangerButton onClickHandler={closeHandler}>Cancelar</DangerButton>
            <SaveButton type="submit">Agregar</SaveButton>
          </>
        )}
      </div>
    </Form>
  );
};
const EuroForm = ({
  selectedItem,
  deleteMode,
  addMode,
  saveHandler,
  closeHandler,
  errors,
  params,
  data,
}) => {
  const { userRol } = useUser();

  const getInitialValues = () => ({
    id: addMode ? "" : selectedItem.id,
    euroToDollarExchangeRate: addMode
      ? ""
      : selectedItem.euroToDollarExchangeRate.toLocaleCurrency(),
    start: addMode ? "" : selectedItem.euroToDollarExchangeRate,
    end: addMode ? "" : selectedItem.euroToDollarExchangeRate,
  });

  return (
    <EuroFormContainer>
      <h3>
        {addMode ? "Agregar Paridad Euro Dolar" : null}
        {deleteMode ? "Eliminar Parirdad Euro Dolar" : null}
      </h3>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={getInitialValues}
        onSubmit={values => {
          saveHandler({ ...values, params: params });
        }}
        validationSchema={getValidationSchema(data)}
      >
        {formikProps => (
          <FormContent
            formikProps={formikProps}
            errors={errors}
            deleteMode={deleteMode}
            isSupervisor={userRol.isSupervisor}
            closeHandler={closeHandler}
            saveHandler={saveHandler}
          />
        )}
      </Formik>
    </EuroFormContainer>
  );
};

export default EuroForm;
