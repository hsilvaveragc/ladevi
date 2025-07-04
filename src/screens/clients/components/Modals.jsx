import React from "react";
import Modal from "shared/components/Modal";
import ClientForm from "./Form";

export default props => (
  <>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showAddModal}
      isOpen={props.showAddModal}
    >
      <ClientForm
        selectedItem={{}}
        addMode={true}
        closeHandler={props.actions.showAddModal}
        availableCountries={props.availableCountries}
        availableStates={props.availableStates}
        availableDistricts={props.availableDistricts}
        availableCities={props.availableCities}
        availableTaxes={props.availableTaxes}
        availableTaxCategories={props.availableTaxCategories}
        availableUsers={props.availableUsers}
        getTaxesHandler={props.actions.getTaxesInit}
        getDistrictsHandler={props.actions.getAllDistrictsByID}
        getStatesHandler={props.actions.getAllStatesByID}
        getCitiesHandler={props.actions.getAllCitiesByID}
        saveHandler={props.actions.addClient}
        errors={props.errors}
        params={props.params}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showEditModal}
      isOpen={props.showEditModal}
    >
      <ClientForm
        selectedItem={props.selectedItem}
        editMode={true}
        closeHandler={props.actions.showEditModal}
        availableCountries={props.availableCountries}
        availableStates={props.availableStates}
        availableDistricts={props.availableDistricts}
        availableCities={props.availableCities}
        availableTaxes={props.availableTaxes}
        availableTaxCategories={props.availableTaxCategories}
        availableUsers={props.availableUsers}
        getTaxesHandler={props.actions.getTaxesInit}
        getDistrictsHandler={props.actions.getAllDistrictsByID}
        getStatesHandler={props.actions.getAllStatesByID}
        getCitiesHandler={props.actions.getAllCitiesByID}
        errors={props.errors}
        saveHandler={props.actions.editClient}
        params={props.params}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showDeleteModal}
      isOpen={props.showDeleteModal}
    >
      <ClientForm
        selectedItem={props.selectedItem}
        deleteMode={true}
        closeHandler={props.actions.showDeleteModal}
        availableCountries={props.availableCountries}
        availableStates={props.availableStates}
        availableDistricts={props.availableDistricts}
        availableCities={props.availableCities}
        availableTaxes={props.availableTaxes}
        availableTaxCategories={props.availableTaxCategories}
        availableUsers={props.availableUsers}
        getTaxesHandler={props.actions.getTaxesInit}
        getDistrictsHandler={props.actions.getAllDistrictsByID}
        getStatesHandler={props.actions.getAllStatesByID}
        getCitiesHandler={props.actions.getAllCitiesByID}
        errors={props.errors}
        saveHandler={props.actions.deleteClient}
        params={props.params}
      />
    </Modal>
  </>
);
