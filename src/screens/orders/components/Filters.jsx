import React, { useEffect } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { all, isEmpty } from "ramda";

import InputSelectField from "shared/components/InputSelectField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import { getAssignedRole } from "shared/services/utils";
import ExcelExport from "./ExcelExport";
import PdfExport from "./PdfExport";

const FiltersContainer = styled.div`
  width: 80vw;
  margin: 2rem 0 4rem 7rem;
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

const Filters = ({
  availableProducts,
  availableEditions,
  availableSalesmens,
  availableClients,
  filterHandler,
  resetFiltersHandler,
  getProductEditionsHandler,
  data,
  handleChangeParams,
  tableRef,
  isLoadingAllClients,
  isLoadingProducts,
  isLoadingSalesmens,
  isLoadingEditionsFilter,
}) => {
  const [filtersUsed, setFiltersUsed] = React.useState({
    producto: "",
    edicion: "",
    vendedor: "",
    cliente: "",
  });

  const userRole = getAssignedRole();
  const userId = localStorage.getItem("userId");

  const defaultOption = {
    id: -1,
    name: "Todos",
  };

  const allSellers = {
    id: -1,
    fullName: "Todos",
  };

  const allClients = {
    id: -1,
    brandName: "Todos",
  };

  return (
    <Formik
      initialValues={{
        productId: -1,
        productEditionId: -1,
        salesmenId: userRole.isSeller ? parseFloat(userId) : -1,
        clientId: -1,
      }}
      enableReinitialize={true}
      onSubmit={values => {
        filterHandler(values);
        handleChangeParams(values);

        const products = [defaultOption, ...availableProducts];
        const editions = [defaultOption, ...availableEditions];
        const sellers = [allSellers, ...availableSalesmens];
        const clients = [allClients, ...availableClients];

        const productSel = products.filter(x => x.id === values.productId)[0]
          ?.name;
        const editionSel =
          editions.filter(x => x.id === values.productEditionId)[0]?.name ||
          "Todos";
        const sellerSel = sellers.filter(x => x.id === values.salesmenId)[0]
          ?.fullName;
        const clientSel = clients.filter(x => x.id === values.clientId)[0]
          ?.brandName;

        setFiltersUsed({
          producto: productSel,
          edicion: editionSel,
          vendedor: sellerSel,
          cliente: clientSel,
        });
      }}
    >
      {formikProps => {
        return (
          <FiltersContainer>
            <Form>
              <div className="form-row">
                <div className="col-2">
                  <InputSelectField
                    labelText="Producto"
                    name="productId"
                    options={
                      isLoadingProducts
                        ? availableProducts
                        : [defaultOption, ...availableProducts]
                    }
                    isLoading={isLoadingProducts}
                    disabled={isLoadingProducts}
                    onChangeHandler={option => {
                      getProductEditionsHandler(option.id);
                      formikProps.setFieldValue("productEditionId", "");
                    }}
                  />
                </div>
                <div className="col-2">
                  <InputSelectField
                    labelText="Edición"
                    name="productEditionId"
                    options={[defaultOption, ...availableEditions]}
                    disabled={isEmpty(availableEditions)}
                    isLoading={isLoadingEditionsFilter}
                  />
                </div>
                <div className="col-2">
                  <InputSelectField
                    labelText="Vendedor"
                    name="salesmenId"
                    options={
                      isLoadingSalesmens
                        ? availableSalesmens
                        : [allSellers, ...availableSalesmens]
                    }
                    isLoading={isLoadingSalesmens}
                    disabled={isLoadingSalesmens || userRole.isSeller}
                    getOptionLabel={option => option.fullName}
                  />
                </div>
                <div className=" col-2">
                  <InputSelectField
                    labelText="Cliente"
                    name="clientId"
                    options={
                      isLoadingAllClients
                        ? availableClients
                        : [allClients, ...availableClients]
                    }
                    isLoading={isLoadingAllClients}
                    disabled={isLoadingAllClients}
                    getOptionLabel={option => option.brandName}
                  />
                </div>
                <div className="col-3">
                  <div className="buttons-container">
                    <DangerButton
                      onClickHandler={() => {
                        formikProps.resetForm();
                        resetFiltersHandler();
                      }}
                      disabled={
                        isLoadingAllClients ||
                        isLoadingProducts ||
                        isLoadingSalesmens
                      }
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton
                      type="submit"
                      disabled={
                        isLoadingAllClients ||
                        isLoadingProducts ||
                        isLoadingSalesmens
                      }
                    >
                      Buscar
                    </SaveButton>
                    {data.length > 0 && (
                      <>
                        <ExcelExport tableRef={tableRef} />
                        <PdfExport
                          tableRef={tableRef}
                          filtersUsed={filtersUsed}
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
