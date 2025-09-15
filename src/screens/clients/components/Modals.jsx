import React from "react";
import Modal from "shared/components/Modal";
import ClientForm from "./Form";
import DuplicateCuitModal from "./DuplicateCuitModal";

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
        availableCities={props.availableCities}
        availableTaxes={props.availableTaxes}
        availableTaxCategories={props.availableTaxCategories}
        availableUsers={props.availableUsers}
        getTaxesHandler={props.actions.getTaxesInit}
        getCitiesHandler={props.actions.fetchCitiesById}
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
        availableCities={props.availableCities}
        availableTaxes={props.availableTaxes}
        availableTaxCategories={props.availableTaxCategories}
        availableUsers={props.availableUsers}
        getTaxesHandler={props.actions.getTaxesInit}
        getCitiesHandler={props.actions.fetchCitiesById}
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
        availableCities={props.availableCities}
        availableTaxes={props.availableTaxes}
        availableTaxCategories={props.availableTaxCategories}
        availableUsers={props.availableUsers}
        getTaxesHandler={props.actions.getTaxesInit}
        getCitiesHandler={props.actions.fetchCitiesById}
        errors={props.errors}
        saveHandler={props.actions.deleteClient}
        params={props.params}
      />
    </Modal>
    <DuplicateCuitModal
      isOpen={props.showDuplicateCuitModal}
      data={props.duplicateCuitData}
      onConfirm={() =>
        props.actions.confirmDuplicateCuitAssociation(props.duplicateCuitData)
      }
      onCancel={props.actions.hideDuplicateCuitModal}
    />
  </>
);
