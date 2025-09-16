import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import InputCheckboxField from 'shared/components/InputCheckboxField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';
import { sortCaseInsensitive } from 'shared/utils';

import useAppData from 'shared/appData/useAppData';
import useUser from 'shared/security/useUser';

const NewClientFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  small {
    min-height: 1rem;
  }
  .button-container {
    margin-top: 2rem;
    display: flex;
    justify-content: space-evenly;
    button {
      width: 25%;
    }
  }
`;

const ClientData = ({
  addMode,
  editMode,
  deleteMode,
  closeHandler,
  availableUsers,
  availableCities,
  getCitiesHandler,
  errors,
  formikProps,
}) => {
  const { userRol } = useUser();
  const { countries, statesGroupedByCountry, districtsGroupedByState } =
    useAppData();

  const [availableStates, setAvailableStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);

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
  };

  // Este useEffect se encargará de cargar los datos iniciales cuando el componente se monte
  // o cuando cambien los datos del formulario en modo edición
  useEffect(() => {
    if (editMode && formikProps.values) {
      // Cargar estados para el país seleccionado
      if (formikProps.values.countryId) {
        filterStatesForCountry(formikProps.values.countryId);
      }

      // Cargar distritos para el estado seleccionado
      if (formikProps.values.stateId) {
        filterDistrictsForState(formikProps.values.stateId);
      }

      // Cargar ciudades para el distrito seleccionado
      if (formikProps.values.districtId) {
        getCitiesHandler(formikProps.values.districtId);
      }
    }
  }, [
    editMode,
    formikProps.values.countryId,
    formikProps.values.stateId,
    formikProps.values.districtId,
  ]);

  const users = availableUsers.filter((user) => {
    // Caso 1: El usuario actual es vendedor y solo debe ver sus propias asignaciones
    const isCurrentUserSeller =
      userRol.isSeller &&
      user.id === formikProps.values.applicationUserSellerId;

    // Caso 2: El usuario actual es administrador o supervisor
    const isCurrentUserAdminOrSupervisor =
      userRol.isAdmin || userRol.isSupervisor;

    // Subcaso 2.1: Para vendedores COMTUR (cuando el formulario tiene isComtur = true)
    const isComturSellerMatch =
      formikProps.values.isComtur &&
      user.applicationRole.name === 'Vendedor COMTUR';

    // Subcaso 2.2: Para vendedores nacionales (cuando el formulario tiene isComtur = false)
    const isNationalSellerMatch =
      !formikProps.values.isComtur &&
      user.countryId === formikProps.values.countryId &&
      user.applicationRole.name === 'Vendedor Nacional';

    // Combinación de casos para administradores y supervisores
    const adminOrSupervisorCondition =
      isCurrentUserAdminOrSupervisor &&
      (isComturSellerMatch || isNationalSellerMatch);

    // Retornamos true si se cumple cualquiera de los casos principales
    return isCurrentUserSeller || adminOrSupervisorCondition;
  });

  // Manejar el cambio de país
  const handleCountryChange = (option, formikProps) => {
    // Obtener estados para el país seleccionado
    filterStatesForCountry(option.id);

    // Resetear valores relacionados
    formikProps.setFieldValue('stateId', '');
    formikProps.setFieldValue('districtId', '');
    formikProps.setFieldValue('cityId', '');
    formikProps.setFieldValue('telephoneCountryCode', option.codigoTelefonico);
    formikProps.setFieldValue('telephoneAreaCode', '');

    // Limpiar listas filtradas
    setAvailableDistricts([]);
  };

  // Manejar el cambio de estado
  const handleStateChange = (option, formikProps) => {
    // Obtener distritos para el estado seleccionado;
    filterDistrictsForState(option.id);

    // Resetear valores relacionados
    formikProps.setFieldValue('districtId', '');
    formikProps.setFieldValue('cityId', '');
    formikProps.setFieldValue('telephoneAreaCode', '');
  };

  // Manejar el cambio de distrito
  const handleDistrictChange = (option, formikProps) => {
    // Obtener ciudades para el distrito seleccionado
    getCitiesHandler(option.id);

    // Resetear valor relacionados
    formikProps.setFieldValue('cityId', '');
    formikProps.setFieldValue('telephoneAreaCode', '');
  };

  // Manejar el cambio de ciudad
  const handleCityChange = (option, formikProps) => {
    // Resetear valor relacionados
    formikProps.setFieldValue('telephoneAreaCode', '');
  };

  return (
    <NewClientFormContainer>
      <h3>
        {addMode ? 'Agregar Cliente' : null}
        {editMode ? 'Editar Cliente' : null}
        {deleteMode ? 'Eliminar Cliente' : null}
      </h3>
      <div className='form-row'>
        <div className=' col-9'>
          <InputTextField
            labelText='Marca *'
            name='brandName'
            disabled={deleteMode}
            error={errors.brandName}
          />
        </div>
        <div className='col-3'>
          <InputCheckboxField
            name='isEnabled'
            labelText='Habilitado'
            disabled={deleteMode}
            error={errors.isEnabled}
          ></InputCheckboxField>
        </div>
      </div>
      <div className='form-row'>
        <div className='col-9'>
          <InputTextField
            labelText='Razón Social *'
            name='legalName'
            disabled={deleteMode}
            error={errors.legalName}
          />
        </div>
        <div className='col-3'>
          <InputTextField labelText='Xubio ID' name='xubioId' disabled={true} />
        </div>
      </div>
      <div className='form-row'>
        <div className=' col-9'>
          <InputTextField
            labelText='Domicilio *'
            name='address'
            disabled={deleteMode}
            errors={errors.address}
          />
        </div>
        <div className=' col-3'>
          <InputTextField
            labelText='Cod. Postal *'
            name='postalCode'
            disabled={deleteMode}
            error={errors.postalCode}
          />
        </div>
      </div>
      <div className='form-row'>
        <div className=' col-3'>
          <InputSelectField
            labelText='País *'
            name='countryId'
            onChangeHandler={(option) =>
              handleCountryChange(option, formikProps)
            }
            options={countries}
            disabled={deleteMode || userRol.isNationalSeller}
            error={errors.countryId}
          ></InputSelectField>
        </div>
        <div className=' col-3'>
          <InputSelectField
            labelText='Provincia *'
            name='stateId'
            onChangeHandler={(option) => handleStateChange(option, formikProps)}
            options={availableStates}
            disabled={isEmpty(availableStates) || deleteMode}
            error={errors.state}
          ></InputSelectField>
        </div>
        <div className='col-3'>
          <InputSelectField
            labelText='Municipio'
            name='districtId'
            onChangeHandler={(option) =>
              handleDistrictChange(option, formikProps)
            }
            options={availableDistricts}
            disabled={isEmpty(availableDistricts) || deleteMode}
            error={errors.district}
          ></InputSelectField>
        </div>
        <div className='col-3'>
          <InputSelectField
            labelText='Localidad'
            name='cityId'
            options={availableCities}
            disabled={isEmpty(availableCities) || deleteMode}
            error={errors.cityId}
            onChangeHandler={(option) => handleCityChange(option, formikProps)}
          ></InputSelectField>
        </div>
      </div>
      <div className='form-row'>
        <div className=' col-12'>
          <InputTextField
            labelText='Contacto'
            name='contact'
            disabled={deleteMode}
            errors={errors.contact}
          />
        </div>
      </div>
      <div className='form-row'>
        <div className=' col-6'>
          <InputSelectField
            labelText='Cobrador *'
            name='applicationUserDebtCollectorId'
            options={sortCaseInsensitive(users, 'fullName')}
            disabled={isEmpty(availableUsers) || deleteMode || userRol.isSeller}
            getOptionLabel={(option) => option.fullName}
            onChangeHandler={(option) => {
              formikProps.setFieldValue('applicationUserSellerId', option.id);
            }}
            error={errors.applicationUserDebtCollectorId}
          ></InputSelectField>
        </div>
        <div className=' col-6'>
          <InputSelectField
            labelText='Vendedor *'
            name='applicationUserSellerId'
            options={sortCaseInsensitive(users, 'fullName')}
            disabled={isEmpty(availableUsers) || deleteMode || userRol.isSeller}
            getOptionLabel={(option) => option.fullName}
            error={errors.applicationUserSellerId}
          ></InputSelectField>
        </div>
      </div>
      <div className='form-row'>
        <div className=' col-2'>
          <InputTextField
            labelText='Cod. País'
            name='telephoneCountryCode'
            disabled={true}
            error={errors.telephoneCountryCode}
          />
        </div>
        <div className=' col-2'>
          <InputTextField
            labelText='Cod. Loc'
            name='telephoneAreaCode'
            disabled={true}
            error={errors.telephoneAreaCode}
          />
        </div>
        <div className='col-4'>
          <InputTextField
            labelText='Número *'
            name='telephoneNumber'
            disabled={deleteMode}
            error={errors.telephoneNumber}
          />
        </div>
        <div className=' col-2'>
          <InputCheckboxField
            name='isAgency'
            labelText='Agencia'
            disabled={deleteMode}
            error={errors.isAgency}
          ></InputCheckboxField>
        </div>
        <div className=' col-2'>
          <InputCheckboxField
            name='isComtur'
            labelText='COMTUR'
            disabled={deleteMode || userRol.isSeller}
            error={errors.isComtur}
          ></InputCheckboxField>
        </div>
      </div>
      <div className='form-row'>
        <div className=' col-6'>
          <InputTextField
            labelText='E-mail *'
            name='mainEmail'
            disabled={deleteMode}
            errors={errors.mainEmail}
          />
        </div>
        <div className=' col-6'>
          <InputTextField
            labelText='E-mail alternativo'
            name='alternativeEmail'
            disabled={deleteMode}
            error={errors.alternativeEmail}
          />
        </div>
      </div>
      <div className='button-container'>
        {deleteMode ? (
          <>
            <SaveButton onClickHandler={closeHandler}>Cancelar</SaveButton>
            <DangerButton type='submit'>Eliminar</DangerButton>
          </>
        ) : (
          <>
            <DangerButton onClickHandler={closeHandler}>Cancelar</DangerButton>
            <SaveButton type='submit'>
              {addMode ? 'Agregar' : null}
              {editMode ? 'Guardar' : null}
            </SaveButton>
          </>
        )}
      </div>
    </NewClientFormContainer>
  );
};

export default ClientData;
