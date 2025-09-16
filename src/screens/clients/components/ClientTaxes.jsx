import React, { useEffect } from 'react';
import styled from 'styled-components';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import InputCheckboxField from 'shared/components/InputCheckboxField';
import InputMaskField from 'shared/components/InputMaskField';

import { CONSTANTS } from 'shared/utils/constants';

const NewClientFormContainer = styled.div`
  height: 61vh;
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
  formikProps,
}) => {
  const isCuitSelected =
    formikProps.values.taxTypeId === CONSTANTS.CUIT_TAX_TYPE_ID;

  // Asegurar que siempre exista un valor en identificationValue
  useEffect(() => {
    // Si no hay valor de identificación y se selecciona un tipo, inicializar con valor vacío
    if (
      formikProps.values.taxTypeId &&
      !formikProps.values.identificationValue
    ) {
      formikProps.setFieldValue('identificationValue', '');
    }

    // Efecto para formatear el CUIT al cambiar el tipo de identificación
    if (isCuitSelected && formikProps.values.identificationValue) {
      // Si ya hay un valor y es sólo números, formatearlo
      const currentValue = formikProps.values.identificationValue.replace(
        /[^0-9]/g,
        ''
      );
      if (
        currentValue.length > 0 &&
        !formikProps.values.identificationValue.includes('-')
      ) {
        // Formatear a XX-XXXXXXXX-X
        if (currentValue.length === 11) {
          const formattedValue = `${currentValue.substring(
            0,
            2
          )}-${currentValue.substring(2, 10)}-${currentValue.substring(
            10,
            11
          )}`;
          formikProps.setFieldValue('identificationValue', formattedValue);
        }
      }
    }
  }, [
    formikProps.values.taxTypeId,
    isCuitSelected,
    formikProps.values.identificationValue,
  ]);

  return (
    <NewClientFormContainer>
      <div className='form-row'>
        <div className='col-5'>
          <InputSelectField
            labelText='Tipo de Identificación *'
            name='taxTypeId'
            options={availableIdentifications}
            error={errors.taxTypeId}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
          ></InputSelectField>
        </div>
        <div className='col-5'>
          {isCuitSelected ? (
            <InputMaskField
              labelText='Identificación *'
              name='identificationValue'
              mask='99-99999999-9'
              maskChar='_'
              error={errors.identificationValue}
            />
          ) : (
            <InputTextField
              labelText='Identificación *'
              name='identificationValue'
              error={errors.identificationValue}
            />
          )}
        </div>
        <div className='col-2'>
          <div className='billing-checkbox-container'>
            <InputCheckboxField
              name='electronicBillByMail'
              labelText='Mail'
              inline={true}
              error={errors.electronicBillByMail}
            ></InputCheckboxField>
            <InputCheckboxField
              name='electronicBillByPaper'
              labelText='Imprimir'
              inline={true}
              error={errors.electronicBillByPaper}
            ></InputCheckboxField>
          </div>
        </div>
      </div>
      <div className='form-row'>
        <div className='col-5'>
          <InputSelectField
            labelText='Condición IVA *'
            name='taxCategoryId'
            options={availableTaxCategories}
            error={errors.taxCategoryId}
          ></InputSelectField>
        </div>
        <div className='col-5'>
          <InputTextField
            labelText='Facturar con punto de venta *'
            name='billingPointOfSale'
            error={errors.billingPointOfSale}
          />
        </div>
        <div className='col-2'>
          <div className='billing-checkbox-container'>
            <InputCheckboxField
              name='isBigCompany'
              labelText='Gran empresa'
              inline={true}
              error={errors.isBigCompany}
            ></InputCheckboxField>
          </div>
        </div>
      </div>
    </NewClientFormContainer>
  );
};

export default ClientTaxes;
