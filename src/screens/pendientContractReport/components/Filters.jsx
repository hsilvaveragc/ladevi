import React, { useState } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";

import InputDatePickerField from "shared/components/InputDatePickerField";
import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import { getAssignedRole } from "shared/services/utils";
import ExcelExport from "./ExcelExport";
import PdfExport from "./PdfExport";

const FiltersContainer = styled.div`
  width: 90vw;
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
  availableSellers = [],
  filterHandler,
  data,
  clients,
  isLoadingAllClients,
  isLoadingSellers,
  clearFilters,
}) => {
  const [actualDate, setActualDate] = useState(new Date());

  const onlySellers = availableSellers.filter(
    x =>
      x.applicationRoleName === "Vendedor Nacional" ||
      x.applicationRoleName === "Vendedor COMTUR"
  );
  const userRole = getAssignedRole();
  const userId = localStorage.getItem("userId");

  const defaultSeller = {
    id: -1,
    fullName: "Todos",
  };

  const defaultClient = {
    id: -1,
    brandName: "Todos",
    legalName: "",
  };

  return (
    <Formik
      initialValues={{
        date: actualDate,
        clienteId: -1,
        sellerId: userRole.isSeller ? parseFloat(userId) : -1,
        onlyWithBalance: false,
      }}
      enableReinitialize={true}
      onSubmit={values => {
        filterHandler(values);
      }}
    >
      {formikProps => {
        return (
          <FiltersContainer>
            <Form>
              <div className="form-row">
                <div className="col-2">
                  <InputDatePickerField
                    labelText="Fecha"
                    name="date"
                    onChangeHandler={val => setActualDate(val)}
                  />
                </div>
                <div className="col-2">
                  <InputSelectField
                    labelText="Vendedor"
                    name="sellerId"
                    options={
                      isLoadingSellers
                        ? onlySellers
                        : [defaultSeller, ...onlySellers]
                    }
                    isLoading={isLoadingSellers}
                    disabled={isLoadingSellers || userRole.isSeller}
                    getOptionLabel={option => option.fullName}
                  />
                </div>
                <div className="col-2">
                  <InputSelectField
                    labelText="Cliente"
                    name="clienteId"
                    options={
                      isLoadingAllClients
                        ? availableClients
                        : [defaultClient, ...availableClients]
                    }
                    isLoading={isLoadingAllClients}
                    disabled={isLoadingAllClients}
                    getOptionLabel={option =>
                      `${option.brandName} ${
                        option.legalName ? `- ${option.legalName}` : ""
                      }`
                    }
                  />
                </div>
                <div className="col-3" style={{ lineHeight: "5em" }}>
                  <InputCheckboxField
                    labelText="Solo con saldo al día de hoy"
                    name="onlyWithBalance"
                    inline
                    // disabled={true}
                  />
                </div>
                <div className="col-3">
                  <div className="buttons-container">
                    <DangerButton
                      onClickHandler={() => {
                        formikProps.resetForm();
                        clearFilters();
                      }}
                      disabled={isLoadingAllClients || isLoadingSellers}
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton
                      type="submit"
                      disabled={isLoadingAllClients || isLoadingSellers}
                    >
                      Buscar
                    </SaveButton>
                    {data.length > 0 && (
                      <>
                        <ExcelExport data={data} />
                        <PdfExport clients={clients} data={data} />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row"></div>
            </Form>
          </FiltersContainer>
        );
      }}
    </Formik>
  );
};
export default Filters;
