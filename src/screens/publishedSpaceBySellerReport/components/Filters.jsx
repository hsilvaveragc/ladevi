import React, { useState } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { isEmpty } from "ramda";
import * as Yup from "yup";

import InputSelectField from "shared/components/InputSelectField";
import InputDatePickerField from "shared/components/InputDatePickerField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import { getAssignedRole } from "shared/services/utils";
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
  availableProductTypes = [],
  availableProducts = [],
  availableEditions = [],
  availableSellers = [],
  filterHandler,
  clearFilters,
  getProductHandler,
  getProductEditionsHandler,
  data,
  isLoadingSellers,
  isLoadingProductTypes,
  isLoadingProducts,
  isLoadingProductEditions,
}) => {
  const userRole = getAssignedRole();
  const userId = localStorage.getItem("userId");
  const [actualDate, setActualDate] = useState(new Date());
  const [oneMonthAgo, setOneMonthAgo] = useState(
    actualDate
      ? new Date(
          actualDate.getFullYear(),
          actualDate.getMonth() - 1,
          actualDate.getDate()
        )
      : null
  );

  const defaultOption = {
    id: -1,
    name: "Todos",
  };

  const defaultSeller = {
    id: -1,
    fullName: "Todos",
  };

  return (
    <Formik
      initialValues={{
        fromDate: oneMonthAgo,
        toDate: actualDate,
        selledId: userRole.isSeller ? parseFloat(userId) : -1,
        productType: -1,
        product: -1,
        productEdition: -1,
        noComisionarImpagas: false,
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({})}
      onSubmit={values => {
        filterHandler(values);
      }}
    >
      {formikProps => {
        return (
          <FiltersContainer>
            <Form>
              <div className="form-row">
                <div className="col-3">
                  <InputDatePickerField
                    labelText="Salida edición desde"
                    name="fromDate"
                    onChangeHandler={val => setOneMonthAgo(val)}
                  />
                </div>
                <div className="col-3">
                  <InputDatePickerField
                    labelText="Salida edición hasta"
                    name="toDate"
                    onChangeHandler={val => setActualDate(val)}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Vendedor"
                    name="selledId"
                    options={
                      isLoadingSellers
                        ? availableSellers
                        : [defaultSeller, ...availableSellers]
                    }
                    isLoading={isLoadingSellers}
                    disabled={isLoadingSellers || userRole.isSeller}
                    getOptionLabel={option => option.fullName}
                  />
                </div>
                <div className="col-2" style={{ lineHeight: "6em" }}>
                  <InputCheckboxField
                    labelText="No comisionar impagas"
                    name="noComisionarImpagas"
                    inline
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-3">
                  <InputSelectField
                    labelText="Tipo de Producto"
                    name="productType"
                    options={
                      isLoadingProductTypes
                        ? availableProductTypes
                        : [defaultOption, ...availableProductTypes]
                    }
                    isLoading={isLoadingProductTypes}
                    disabled={isLoadingProductTypes}
                    onChangeHandler={option => {
                      getProductHandler(option.id);
                      formikProps.setFieldValue("product", -1);
                      getProductEditionsHandler(-1);
                      formikProps.setFieldValue("productEdition", -1);
                    }}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Producto"
                    name="product"
                    options={
                      isLoadingProducts
                        ? availableProducts
                        : [defaultOption, ...availableProducts]
                    }
                    isLoading={isLoadingProducts}
                    disabled={isLoadingProducts || isEmpty(availableProducts)}
                    onChangeHandler={option => {
                      getProductEditionsHandler(option.id);
                      formikProps.setFieldValue("productEdition", -1);
                    }}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Edición"
                    name="productEdition"
                    options={
                      isLoadingProductEditions
                        ? availableEditions
                        : [defaultOption, ...availableEditions]
                    }
                    isLoading={isLoadingProductEditions}
                    disabled={
                      isLoadingProductEditions ||
                      isEmpty(availableEditions) ||
                      isEmpty(availableProducts)
                    }
                  />
                </div>
                <div className="col-3">
                  <div className="buttons-container">
                    <DangerButton
                      disabled={isLoadingProductTypes || isLoadingSellers}
                      onClickHandler={() => {
                        formikProps.resetForm();
                        clearFilters();
                      }}
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton
                      type="submit"
                      disabled={isLoadingProductTypes || isLoadingSellers}
                    >
                      Buscar
                    </SaveButton>
                    {data.main.length > 0 && (
                      <>
                        <ExcelExport data={data} />
                        <PdfExport data={data} />
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
