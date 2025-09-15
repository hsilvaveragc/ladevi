import React from "react";
import styled from "styled-components";
import { isEmpty } from "ramda";
import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import { sortCaseInsensitive } from "shared/utils";

const NewClientFormContainer = styled.div`
  width: 60vw;
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
  getCitiesHandler,
  getDistrictsHandler,
  getStatesHandler,
  availableUsers,
  availableCountries,
  availableStates,
  availableDistricts,
  availableCities,
  errors,
  formikProps,
  isSupervisor,
  isAdmin,
}) => {
  const userRole = localStorage.getItem("loggedUser")
    ? localStorage.getItem("loggedUser").toString()
    : "";
  const isComtur = userRole == "Vendedor COMTUR";
  const isNationalSeller = userRole == "Vendedor Nacional";
  const isSeller = isComtur || isNationalSeller;

  const users = availableUsers.filter(
    x =>
      (isSeller && x.id === formikProps.values.applicationUserSellerId) ||
      ((isAdmin || isSupervisor) &&
        ((formikProps.values.isComtur &&
          x.applicationRole.name == "Vendedor COMTUR") ||
          (!formikProps.values.isComtur &&
            x.countryId === formikProps.values.countryId &&
            x.applicationRole.name === "Vendedor Nacional")))
  );

  return (
    <NewClientFormContainer>
      <h3>
        {addMode ? "Agregar Cliente" : null}
        {editMode ? "Editar Cliente" : null}
        {deleteMode ? "Eliminar Cliente" : null}
      </h3>
      <div className="form-row">
        <div className=" col-9">
          <InputTextField
            labelText="Marca *"
            name="brandName"
            disabled={deleteMode}
            error={errors.brandName}
          />
        </div>
        <div className="col-3">
          <InputCheckboxField
            name="isEnabled"
            labelText="Habilitado"
            disabled={deleteMode}
            error={errors.isEnabled}
          ></InputCheckboxField>
        </div>
      </div>
      <div className="form-row">
        <div className="col-9">
          <InputTextField
            labelText="Razón Social *"
            name="legalName"
            disabled={deleteMode}
            error={errors.legalName}
          />
        </div>
        {/* <div className="col-3">
          <InputTextField labelText="Xubio ID" name="xubioId" disabled={true} />
        </div> */}
      </div>
      <div className="form-row">
        <div className=" col-9">
          <InputTextField
            labelText="Domicilio *"
            name="address"
            disabled={deleteMode}
            errors={errors.address}
          />
        </div>
        <div className=" col-3">
          <InputTextField
            labelText="Cod. Postal *"
            name="postalCode"
            disabled={deleteMode}
            error={errors.postalCode}
          />
        </div>
      </div>
      <div className="form-row">
        <div className=" col-3">
          <InputSelectField
            labelText="País *"
            name="countryId"
            onChangeHandler={option => {
              getStatesHandler(option.id);
              formikProps.setFieldValue("stateId", "");
              formikProps.setFieldValue("districtId", "");
              formikProps.setFieldValue("cityId", "");
              formikProps.setFieldValue(
                "telephoneCountryCode",
                option.codigoTelefonico
              );
              formikProps.setFieldValue("telephoneAreaCode", "");
            }}
            options={availableCountries}
            disabled={deleteMode || isNationalSeller}
            error={errors.countryId}
          ></InputSelectField>
        </div>
        <div className=" col-3">
          <InputSelectField
            labelText="Provincia *"
            name="stateId"
            onChangeHandler={option => {
              getDistrictsHandler(option.id);
              formikProps.setFieldValue("telephoneAreaCode", "");
            }}
            options={availableStates}
            disabled={isEmpty(availableStates) || deleteMode}
            error={errors.state}
          ></InputSelectField>
        </div>
        <div className="col-3">
          <InputSelectField
            labelText="Municipio"
            name="districtId"
            onChangeHandler={option => {
              getCitiesHandler(option.id);
              formikProps.setFieldValue("telephoneAreaCode", "");
            }}
            options={availableDistricts}
            disabled={isEmpty(availableDistricts) || deleteMode}
            error={errors.district}
          ></InputSelectField>
        </div>
        <div className="col-3">
          <InputSelectField
            labelText="Localidad"
            name="cityId"
            options={availableCities}
            disabled={isEmpty(availableCities) || deleteMode}
            error={errors.cityId}
            onChangeHandler={option => {
              formikProps.setFieldValue(
                "telephoneAreaCode",
                option.codigoTelefonico
              );
            }}
          ></InputSelectField>
        </div>
      </div>
      <div className="form-row">
        <div className=" col-12">
          <InputTextField
            labelText="Contacto"
            name="contact"
            disabled={deleteMode}
            errors={errors.contact}
          />
        </div>
      </div>
      <div className="form-row">
        <div className=" col-6">
          <InputSelectField
            labelText="Cobrador *"
            name="applicationUserDebtCollectorId"
            options={sortCaseInsensitive(users, "fullName")}
            disabled={isEmpty(availableUsers) || deleteMode || isSeller}
            getOptionLabel={option => option.fullName}
            onChangeHandler={option => {
              formikProps.setFieldValue("applicationUserSellerId", option.id);
            }}
            error={errors.applicationUserDebtCollectorId}
          ></InputSelectField>
        </div>
        <div className=" col-6">
          <InputSelectField
            labelText="Vendedor *"
            name="applicationUserSellerId"
            options={sortCaseInsensitive(users, "fullName")}
            disabled={isEmpty(availableUsers) || deleteMode || isSeller}
            getOptionLabel={option => option.fullName}
            error={errors.applicationUserSellerId}
          ></InputSelectField>
        </div>
      </div>
      <div className="form-row">
        <div className=" col-2">
          <InputTextField
            labelText="Cod. País"
            name="telephoneCountryCode"
            disabled={true}
            error={errors.telephoneCountryCode}
          />
        </div>
        <div className=" col-2">
          <InputTextField
            labelText="Cod. Loc"
            name="telephoneAreaCode"
            disabled={true}
            error={errors.telephoneAreaCode}
          />
        </div>
        <div className="col-4">
          <InputTextField
            labelText="Número *"
            name="telephoneNumber"
            disabled={deleteMode}
            error={errors.telephoneNumber}
          />
        </div>
        <div className=" col-2">
          <InputCheckboxField
            name="isAgency"
            labelText="Agencia"
            disabled={deleteMode}
            error={errors.isAgency}
          ></InputCheckboxField>
        </div>
        <div className=" col-2">
          <InputCheckboxField
            name="isComtur"
            labelText="COMTUR"
            disabled={deleteMode || isComtur || isNationalSeller}
            error={errors.isComtur}
          ></InputCheckboxField>
        </div>
      </div>
      <div className="form-row">
        <div className=" col-6">
          <InputTextField
            labelText="E-mail *"
            name="mainEmail"
            disabled={deleteMode}
            errors={errors.mainEmail}
          />
        </div>
        <div className=" col-6">
          <InputTextField
            labelText="E-mail alternativo"
            name="alternativeEmail"
            disabled={deleteMode}
            error={errors.alternativeEmail}
          />
        </div>
      </div>
      <div className="button-container">
        {deleteMode ? (
          <>
            <SaveButton onClickHandler={closeHandler}>Cancelar</SaveButton>
            <DangerButton type="submit">Eliminar</DangerButton>
          </>
        ) : (
          <>
            <DangerButton onClickHandler={closeHandler}>Cancelar</DangerButton>
            <SaveButton type="submit">
              {addMode ? "Agregar" : null}
              {editMode ? "Guardar" : null}
            </SaveButton>
          </>
        )}
      </div>
    </NewClientFormContainer>
  );
};

export default ClientData;
