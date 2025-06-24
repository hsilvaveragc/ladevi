import React from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputTextField from "shared/components/InputTextField";
import InputDatePickerField from "shared/components/InputDatePickerField";
import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import { SaveButton, DangerButton } from "shared/components/Buttons";

const EditionsFormContainer = styled.div`
  width: 50vw;
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const EditionsForm = ({
  selectedItem,
  deleteMode,
  editMode,
  addMode,
  saveHandler,
  closeHandler,
  productsAvailable,
  errors,
  params,
}) => {
  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        id: addMode ? "" : selectedItem.id,
        name: addMode ? "" : selectedItem.name,
        code: addMode ? "" : selectedItem.code,
        productId: addMode ? "" : selectedItem.productId,
        closed: addMode ? false : selectedItem.closed,
        end: addMode ? "" : selectedItem.end,
      }}
      onSubmit={values => {
        saveHandler({ ...values, params: params });
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required("Requerido"),
        code: Yup.string().required("Requerido"),
        productId: Yup.string().required("Requerido"),
        closed: Yup.bool().required("Requerido"),
        end: Yup.string().required("Requerido"),
      })}
    >
      {formikProps => {
        return (
          <EditionsFormContainer className="container">
            <h3>
              {addMode ? "Agregar Edición" : null}
              {editMode ? "Editar Edición" : null}
              {deleteMode ? "Eliminar Edición" : null}
            </h3>
            <Form autoComplete="off">
              <div className="form-group">
                <InputTextField
                  labelText="Título:"
                  name="name"
                  disabled={deleteMode}
                  error={errors.name}
                />
              </div>
              <div className="form-group">
                <InputTextField
                  labelText="Código:"
                  name="code"
                  disabled={deleteMode}
                  error={errors.code}
                />
              </div>
              <div className="form-group">
                <InputSelectField
                  labelText="Pertenece a:"
                  name="productId"
                  options={productsAvailable}
                  disabled={deleteMode}
                  error={errors.productId}
                ></InputSelectField>
              </div>
              <div className="form-group">
                <InputCheckboxField
                  name="closed"
                  labelText="Edición cerrada"
                  inline={true}
                  error={errors.closed}
                  disabled={deleteMode}
                ></InputCheckboxField>
              </div>
              <div className="form-group">
                <InputDatePickerField
                  labelText="Fecha Salida:"
                  error={errors.end}
                  name="end"
                  disabled={deleteMode}
                />
              </div>
              <div className="button-container">
                {deleteMode ? (
                  <>
                    <SaveButton onClickHandler={closeHandler}>
                      Cancelar
                    </SaveButton>
                    <DangerButton type="submit">Eliminar</DangerButton>
                  </>
                ) : (
                  <>
                    <DangerButton onClickHandler={closeHandler}>
                      Cancelar
                    </DangerButton>
                    <SaveButton type="submit">
                      {addMode ? "Agregar" : null}
                      {editMode ? "Guardar" : null}
                    </SaveButton>
                  </>
                )}
              </div>
            </Form>
          </EditionsFormContainer>
        );
      }}
    </Formik>
  );
};

export default EditionsForm;
