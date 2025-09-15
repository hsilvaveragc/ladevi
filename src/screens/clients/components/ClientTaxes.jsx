import React from "react";
import styled from "styled-components";

import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";

const NewClientFormContainer = styled.div`
  height: 61vh;
  width: 40vw;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  small {
    min-height: 1rem;
  }
  .billing-checkbox-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }
  .buttons-container {
    margin-top: 2rem;
    display: flex;
    justify-content: space-evenly;
    button {
      width: 25%;
    }
  }
`;

const ClientTaxes = ({
  errors,
  availableIdentifications,
  availableTaxCategories,
}) => {
  return (
    <NewClientFormContainer>
      <div className="form-row">
        <div className="col-4">
          <InputSelectField
            labelText="Tipo de Identificación *"
            name="taxTypeId"
            options={availableIdentifications}
            error={errors.taxTypeId}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
          ></InputSelectField>
        </div>
        <div className="col-4">
          <InputTextField
            labelText="Identificación *"
            name="identificationValue"
            error={errors.identificationValue}
          />
        </div>
        <div className="col-4">
          <div className="billing-checkbox-container">
            <InputCheckboxField
              name="electronicBillByMail"
              labelText="Mail"
              inline={true}
              error={errors.electronicBillByMail}
            ></InputCheckboxField>
            <InputCheckboxField
              name="electronicBillByPaper"
              labelText="Imprimir"
              inline={true}
              error={errors.electronicBillByPaper}
            ></InputCheckboxField>
          </div>
        </div>
      </div>
      <div className="form-row">
        {/* <div className="col-4">
          <InputSelectField
            labelText="Condición IVA *"
            name="taxCategoryId"
            options={availableTaxCategories}
            error={errors.taxCategoryId}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
          ></InputSelectField>
        </div> */}
        <div className="col-4">
          <InputTextField
            labelText="Facturar con punto de venta *"
            name="billingPointOfSale"
            error={errors.billingPointOfSale}
          />
        </div>
        <div className="col-4"></div>
      </div>
    </NewClientFormContainer>
  );
};

export default ClientTaxes;
