import React from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";

import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import { SaveButton, DangerButton } from "shared/components/Buttons";

const FiltersContainer = styled.div`
  width: 70vw;
  margin: 2rem 0 4rem;
  .buttons-container {
    display: flex;
    align-items: flex-end;
    height: 82%;
    margin-bottom: 1rem;
    justify-content: space-around;
    button {
      width: 40%;
    }
  }
`;

export default function Filters({
  availableProducts,
  handleFilter,
  handleResetFilters,
  handleChangeParams,
}) {
  const defaultOption = {
    id: -1,
    name: "Todos",
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        name: "",
        productId: -1,
      }}
      onSubmit={values => {
        handleFilter(values);
        handleChangeParams(values);
      }}
      enableReinitialize={true}
    >
      {formikProps => {
        return (
          <FiltersContainer>
            <Form>
              <div className="form-row">
                <div className="col-4">
                  <InputTextField labelText="Nombre" name="name" />
                </div>
                <div className="col-4">
                  <InputSelectField
                    labelText="Producto"
                    name="productId"
                    options={[defaultOption, ...availableProducts]}
                  />
                </div>
                <div className="col-3">
                  <div className="buttons-container">
                    <DangerButton
                      onClickHandler={() => {
                        formikProps.resetForm();
                        handleResetFilters();
                      }}
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton type="submit">Buscar</SaveButton>
                  </div>
                </div>
              </div>
            </Form>
          </FiltersContainer>
        );
      }}
    </Formik>
  );
}
