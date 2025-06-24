import React, { useEffect } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { isEmpty } from "ramda";
//import * as Yup from "yup";

import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
// import InputSelect from "shared/components/InputAutocompleteField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import { getAssignedRole } from "shared/services/utils";

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
  availableCountries,
  availableStates,
  availableDistricts,
  availableCities,
  availableUsers,
  getDistrictsHandler,
  getStatesHandler,
  getCitiesHandler,
  filterHandler,
  resetFiltersHandler,
  handleChangeParams,
}) {
  const userRole = getAssignedRole();
  const userId = parseFloat(localStorage.getItem("userId"));
  const userCountryId = parseFloat(localStorage.getItem("userCountryId"));

  const defaultOption = {
    id: -1,
    name: "Todos",
  };

  const allSellers = {
    id: -1,
    fullName: "Todos",
  };

  useEffect(() => {
    if (userRole.isSupervisor) {
      getStatesHandler(userCountryId);
    }
  }, []);

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        fullName: "",
        status: "onlyEnabled",
        applicationUserSellerId: userRole.isSeller ? userId : -1,
        countryId: userRole.isSupervisor ? userCountryId : -1,
        stateId: -1,
        districtId: -1,
        cityId: -1,
      }}
      onSubmit={values => {
        filterHandler(values);
        handleChangeParams(values);
      }}
      enableReinitialize={true}
    >
      {formikProps => {
        //console.log(formikProps);
        return (
          <FiltersContainer>
            <Form>
              <div className="form-row">
                <div className=" col-3">
                  <InputTextField
                    labelText="Marca o Razón Social"
                    name="fullName"
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Estado"
                    name="status"
                    options={[
                      { id: "onlyEnabled", name: "Solo Habilitados" },
                      { id: "all", name: "Todos" },
                    ]}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Vendedor"
                    name="applicationUserSellerId"
                    options={[allSellers, ...availableUsers]}
                    getOptionLabel={option => option.fullName}
                    disabled={userRole.isSeller}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Pais"
                    name="countryId"
                    options={[defaultOption, ...availableCountries]}
                    onChangeHandler={option => {
                      getStatesHandler(option.id);
                      formikProps.setFieldValue("stateId", "");
                      formikProps.setFieldValue("districtId", "");
                      formikProps.setFieldValue("cityId", "");
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className=" col-3">
                  <InputSelectField
                    labelText="Provincia"
                    name="stateId"
                    options={[defaultOption, ...availableStates]}
                    onChangeHandler={option => getDistrictsHandler(option.id)}
                    disabled={isEmpty(availableStates)}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Municipio"
                    name="districtId"
                    options={[defaultOption, ...availableDistricts]}
                    onChangeHandler={option => getCitiesHandler(option.id)}
                    disabled={isEmpty(availableDistricts)}
                  />
                </div>
                <div className="col-3">
                  <InputSelectField
                    labelText="Localidad"
                    name="cityId"
                    options={[defaultOption, ...availableCities]}
                    disabled={isEmpty(availableCities)}
                  />
                </div>
                <div className="col-3">
                  <div className="buttons-container">
                    <DangerButton
                      onClickHandler={() => {
                        formikProps.resetForm();
                        resetFiltersHandler();
                      }}
                    >
                      Limpiar
                    </DangerButton>
                    <SaveButton type="submit">Buscar</SaveButton>
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
