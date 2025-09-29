import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import InputDatePickerField from 'shared/components/InputDatePickerField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

import useUser from 'shared/security/useUser';

const FiltersContainer = styled.div`
  width: 80vw;
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
  availableCountries,
  availableProducts,
  availableSalesmen,
  handleFilter,
  handleResetFilters,
  handleChangeFilter,
  errors,
}) {
  const { userRol, userCountryId, userId } = useUser();

  const defaultOption = {
    id: -1,
    name: 'Todos',
  };

  const allSellers = {
    id: -1,
    fullName: 'Todos',
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        number: '',
        client: '',
        name: '',
        countryId: userRol.isSupervisor ? userCountryId : -1,
        productId: -1,
        status: '',
        salesmenId: userRol.isSeller ? parseFloat(userId) : -1,
        fromDate: '',
        toDate: '',
        saldo: 2,
      }}
      onSubmit={(values) => {
        handleFilter(values);
        handleChangeFilter(values);
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        number: Yup.number()
          .typeError('El valor debe ser numérico')
          .nullable()
          .moreThan(0, 'El número debe ser mayo a cero')
          .transform((_, val) => (val !== '' ? Number(val) : null)),
      })}
    >
      {(formikProps) => {
        return (
          <FiltersContainer>
            <Form>
              <div className='form-row'>
                <div className=' col-1'>
                  <InputTextField
                    labelText='Número'
                    name='number'
                    error={errors.number}
                    maxlength={6}
                  />
                </div>
                <div className=' col-3'>
                  <InputTextField labelText='Cliente' name='client' />
                </div>
                <div className='col-3'>
                  <InputTextField labelText='Nombre' name='name' />
                </div>
                <div className='col-2'>
                  <InputSelectField
                    labelText='País del Cliente'
                    name='countryId'
                    options={[defaultOption, ...availableCountries]}
                  />
                </div>
                <div className='col-3'>
                  <InputSelectField
                    labelText='Producto'
                    name='productId'
                    options={[defaultOption, ...availableProducts]}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='col-3'>
                  <InputSelectField
                    labelText='Vendedor'
                    name='salesmenId'
                    options={[allSellers, ...availableSalesmen]}
                    disabled={userRol.isSeller}
                    getOptionLabel={(option) => option.fullName}
                  />
                </div>
                <div className='col-2'>
                  <InputDatePickerField
                    labelText='Vto. desde'
                    name='fromDate'
                  />
                </div>
                <div className='col-2'>
                  <InputDatePickerField labelText='Vto. hasta' name='toDate' />
                </div>
                <div className='col-2'>
                  <InputSelectField
                    labelText='Saldo'
                    name='saldo'
                    options={[
                      {
                        id: 1,
                        name: 'Todos',
                      },
                      {
                        id: 2,
                        name: 'Con Saldo',
                      },
                    ]}
                  />
                </div>
                <div className='col-3'>
                  <div className='buttons-container'>
                    <DangerButton
                      onClickHandler={() => {
                        formikProps.resetForm();
                        handleResetFilters();
                      }}
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton type='submit'>Buscar</SaveButton>
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
