import React from "react";
//import PropTypes from "prop-types";
import styled from "styled-components";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { FILTERS } from "../constants";
import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import { SaveButton, DangerButton } from "shared/components/Buttons";

const FilterFormContainer = styled.div`
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

const defaultOption = {
  id: -1,
  name: "Todos",
};

const FiltersForm = ({
  handleFilter,
  productsAvailable,
  resetFilterHandler,
  handleChangeParams,
}) => (
  <Formik
    validateOnChange={false}
    validateOnBlur={false}
    initialValues={{
      name: "",
      code: "",
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
        <FilterFormContainer>
          <Form>
            <div className="form-row">
              <div className="col-3">
                <InputTextField labelText="Título" name="name" />
              </div>
              <div className="col-3">
                <InputSelectField
                  labelText="Producto"
                  name="productId"
                  options={[defaultOption, ...productsAvailable]}
                />
              </div>
              <div className="col-3">
                <InputTextField labelText="Código" name="code" />
              </div>
              <div className="col-3">
                <div className="buttons-container">
                  <DangerButton
                    onClickHandler={() => {
                      formikProps.resetForm();
                      resetFilterHandler();
                    }}
                  >
                    Limpiar
                  </DangerButton>
                  <SaveButton type="submit">Buscar</SaveButton>
                </div>
              </div>
            </div>
          </Form>
        </FilterFormContainer>
      );
    }}
  </Formik>
);

FiltersForm.propTypes = {};

export default FiltersForm;
