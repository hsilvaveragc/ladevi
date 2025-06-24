import React from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { isEmpty } from "ramda";
import * as Yup from "yup";

import InputSelectField from "shared/components/InputSelectField";
import InputDatePickerField from "shared/components/InputDatePickerField";
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
  availableClients = [],
  availableProducts = [],
  availableEditions = [],
  availableProductTypes = [],
  availableSellers = [],
  filterHandler,
  clearFilters,
  getProductHandler,
  getProductEditionsHandler,
  data,
  isLoadingAllClients,
  isLoadingProductTypes,
  isLoadingSellers,
  isLoadingProducts,
  isLoadingProductEditions,
}) => {
  const userRole = getAssignedRole();
  const userId = localStorage.getItem("userId");

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
        fromDate: "",
        toDate: "",
        client: "",
        sellerId: userRole.isSeller ? parseFloat(userId) : -1,
        productType: -1,
        product: -1,
        edition: -1,
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        client: Yup.string().required("Requerido"),
      })}
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
                  <InputSelectField
                    labelText="Cliente"
                    name="client"
                    options={availableClients}
                    isLoading={isLoadingAllClients}
                    disabled={isLoadingAllClients}
                    getOptionLabel={option =>
                      `${option.brandName} - ${option.legalName}`
                    }
                  />
                </div>
                <div className="col-3">
                  <InputDatePickerField
                    labelText="Fecha Salida Desde"
                    name="fromDate"
                  />
                </div>
                <div className="col-3">
                  <InputDatePickerField
                    labelText="Fecha Salida Hasta"
                    name="toDate"
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Vendedor"
                    name="sellerId"
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
                      formikProps.setFieldValue("edition", -1);
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
                      formikProps.setFieldValue("edition", -1);
                    }}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Edición"
                    name="edition"
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
                      disabled={
                        isLoadingAllClients ||
                        isLoadingProductTypes ||
                        isLoadingSellers
                      }
                      onClickHandler={() => {
                        formikProps.resetForm();
                        clearFilters();
                      }}
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton
                      type="submit"
                      disabled={
                        isLoadingAllClients ||
                        isLoadingProductTypes ||
                        isLoadingSellers
                      }
                    >
                      Buscar
                    </SaveButton>
                    {data.length > 0 && (
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
