import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { isEmpty } from 'ramda';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

import useAppData from 'shared/appData/useAppData';
import useUser from 'shared/security/useUser';

const FiltersContainer = styled.div`
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

export default function Filters({
  availableUsers,
  availableCities,
  getCitiesHandler,
  handleFilter,
  handleResetFilters,
  handleChangeParams,
}) {
  const { userRol, userCountryId, userId } = useUser();
  const { countries, statesGroupedByCountry, districtsGroupedByState } =
    useAppData();

  const [availableStates, setAvailableStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  const defaultOption = {
    id: -1,
    name: 'Todos',
  };

  const allSellers = {
    id: -1,
    fullName: 'Todos',
  };

  // Actualizar estados cuando cambian los datos en Redux o cuando se monta el componente
  useEffect(() => {
    // Si es supervisor o vendedor, filtrar estados de su país
    if (userRol.isSupervisor) {
      filterStatesForCountry(userCountryId);
    }
  }, [countries, statesGroupedByCountry, userCountryId]);

  // Función para filtrar estados por país
  const filterStatesForCountry = (countryId) => {
    if (countryId === -1 || isEmpty(statesGroupedByCountry)) {
      setAvailableStates([]);
      return;
    }

    const filteredStates =
      statesGroupedByCountry.find((state) => state.countryId === countryId)
        ?.states ?? [];
    setAvailableStates(filteredStates);
  };

  // Función para filtrar distritos por estado
  const filterDistrictsForState = (stateId) => {
    if (stateId === -1 || isEmpty(districtsGroupedByState)) {
      setAvailableDistricts([]);
      return;
    }

    // Filtrar los distritos por el estado seleccionado
    const filteredDistricts =
      districtsGroupedByState.find((district) => district.stateId === stateId)
        ?.districts ?? [];
    setAvailableDistricts(filteredDistricts);

    // Limpiar ciudades cuando cambia el estado
    //setAvailableCities([]);
  };

  // Manejar el cambio de país
  const handleCountryChange = (option, formikProps) => {
    // Obtener estados para el país seleccionado
    filterStatesForCountry(option.id);

    // Resetear valores relacionados
    formikProps.setFieldValue('stateId', -1);
    formikProps.setFieldValue('districtId', -1);
    formikProps.setFieldValue('cityId', -1);

    // Limpiar listas filtradas
    setAvailableDistricts([]);
    getCitiesHandler(-1);
  };

  // Manejar el cambio de estado
  const handleStateChange = (option, formikProps) => {
    // Obtener distritos para el estado seleccionado;
    filterDistrictsForState(option.id);

    // Resetear valores relacionados
    formikProps.setFieldValue('districtId', -1);
    formikProps.setFieldValue('cityId', -1);

    // Limpiar listas filtradas
    getCitiesHandler(-1);
  };

  // Manejar el cambio de distrito
  const handleDistrictChange = (option, formikProps) => {
    // Obtener ciudades para el distrito seleccionado
    getCitiesHandler(option.id);

    // Resetear valor de ciudad
    formikProps.setFieldValue('cityId', -1);
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        fullName: '',
        status: 'onlyEnabled',
        applicationUserSellerId: userRol.isSeller ? userId : -1,
        countryId: userRol.isSupervisor ? userCountryId : -1,
        stateId: -1,
        districtId: -1,
        cityId: -1,
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
                <div className=' col-3'>
                  <InputTextField
                    labelText='Marca o Razón Social'
                    name='fullName'
                  />
                </div>
                <div className='col-3'>
                  <InputSelectField
                    labelText='Estado'
                    name='status'
                    options={[
                      {
                        id: 'onlyEnabled',
                        name: 'Solo Habilitados',
                      },
                      { id: 'all', name: 'Todos' },
                    ]}
                  />
                </div>
                <div className='col-3'>
                  <InputSelectField
                    labelText='Vendedor'
                    name='applicationUserSellerId'
                    options={[allSellers, ...availableUsers]}
                    getOptionLabel={(option) => option.fullName}
                    disabled={userRol.isSeller}
                  />
                </div>
                <div className='col-3'>
                  <InputSelectField
                    labelText='Pais'
                    name='countryId'
                    options={[defaultOption, ...countries]}
                    onChangeHandler={(option) =>
                      handleCountryChange(option, formikProps)
                    }
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className=' col-3'>
                  <InputSelectField
                    labelText='Provincia'
                    name='stateId'
                    options={[defaultOption, ...availableStates]}
                    onChangeHandler={(option) =>
                      handleStateChange(option, formikProps)
                    }
                    disabled={isEmpty(availableStates)}
                  />
                </div>
                <div className='col-3'>
                  <InputSelectField
                    labelText='Municipio'
                    name='districtId'
                    options={[defaultOption, ...availableDistricts]}
                    onChangeHandler={(option) =>
                      handleDistrictChange(option, formikProps)
                    }
                    disabled={isEmpty(availableDistricts)}
                  />
                </div>
                <div className='col-3'>
                  <InputSelectField
                    labelText='Localidad'
                    name='cityId'
                    options={[defaultOption, ...availableCities]}
                    disabled={isEmpty(availableCities)}
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
