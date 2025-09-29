import styled from 'styled-components';
import { Formik, Form } from 'formik';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

import useUser from 'shared/security/useUser';

const FiltersContainer = styled.div`
  width: 75vw;
  margin: 0 0 2rem;
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
  availableRoles,
  handleFilter,
  handleResetFilters,
  handleChangeParams,
}) {
  const { userRol, userCountryId } = useUser();

  const defaultOption = {
    id: -1,
    name: 'Todos',
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        name: '',
        countryId:
          userRol.isNationalSeller || userRol.isSupervisor
            ? parseFloat(userCountryId)
            : -1,
        email: '',
        applicationRoleId: -1,
      }}
      onSubmit={(values) => {
        handleFilter(values);
        handleChangeParams(values);
      }}
      enableReinitialize={true}
    >
      {(formikProps) => {
        return (
          <FiltersContainer>
            <Form>
              <div className='form-row'>
                <div className='col-2'>
                  <InputTextField labelText='Nombre' name='name' />
                </div>
                <div className='col-2'>
                  <InputSelectField
                    labelText='Pais'
                    name='countryId'
                    options={[defaultOption, ...availableCountries]}
                    disabled={userRol.isNationalSeller || userRol.isSupervisor}
                  />
                </div>
                <div className='col-2'>
                  <InputTextField labelText='Email' name='email' />
                </div>
                <div className='col-2'>
                  <InputSelectField
                    labelText='Rol'
                    name='applicationRoleId'
                    useOptionAll
                    options={[defaultOption, ...availableRoles]}
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
