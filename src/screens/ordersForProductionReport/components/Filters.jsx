import React from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { isEmpty } from "ramda";
import * as Yup from "yup";

import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import ExcelExport from "./ExcelExport";
import PdfExport from "./PdfExport";

const FiltersContainer = styled.div`
  width: 80vw;
  margin: 2rem 0 auto 7rem;
  .buttons-container {
    display: flex;
    align-items: flex-end;
    height: 82%;
    margin-bottom: 1rem;
    justify-content: space-around;
  }
`;

const Filters = ({
  availableProducts = [],
  availableEditions = [],
  handleFilter,
  getProductEditionsHandler,
  clearFilters,
  data,
  addReporteGeneration,
  isLoadingProducts,
  isLoadingProductEditions,
}) => {
  return (
    <Formik
      initialValues={{
        productId: "",
        productEditionId: "",
        onlyNews: false,
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        productEditionId: Yup.string().required("Requerido"),
      })}
      onSubmit={values => {
        handleFilter(values);
      }}
    >
      {formikProps => {
        return (
          <FiltersContainer>
            <Form>
              <div className="form-row">
                <div className="col-3">
                  <InputSelectField
                    labelText="Producto"
                    name="productId"
                    options={availableProducts}
                    isLoading={isLoadingProducts}
                    disabled={isLoadingProducts || isEmpty(availableProducts)}
                    onChangeHandler={option => {
                      getProductEditionsHandler(option.id);
                      formikProps.setFieldValue("productEditionId", "");
                    }}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Edición"
                    name="productEditionId"
                    options={availableEditions}
                    isLoading={isLoadingProductEditions}
                    disabled={
                      isLoadingProductEditions ||
                      isEmpty(availableEditions) ||
                      isEmpty(availableProducts)
                    }
                  />
                </div>
                <div className="col-2" style={{ lineHeight: "5em" }}>
                  <InputCheckboxField
                    labelText="Solo novedades"
                    name="onlyNews"
                    inline
                    // disabled={true}
                  />
                </div>
                <div className="col-4">
                  <div className="buttons-container">
                    <DangerButton
                      disabled={isLoadingProducts}
                      onClickHandler={() => {
                        formikProps.resetForm();
                        clearFilters();
                      }}
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton type="submit" disabled={isLoadingProducts}>
                      Buscar
                    </SaveButton>
                    {data.length > 0 && (
                      <>
                        <ExcelExport
                          addReporteGeneration={addReporteGeneration}
                          data={data}
                          productEditionId={formikProps.values.productEditionId}
                        />
                        <PdfExport
                          addReporteGeneration={addReporteGeneration}
                          data={data}
                          productEditionId={formikProps.values.productEditionId}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </FiltersContainer>
        );
      }}
    </Formik>
  );
};
export default Filters;
