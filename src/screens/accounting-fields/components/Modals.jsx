import React from "react";
import Modal from "shared/components/Modal";
import AccountingFieldsForm from "./AccountingFieldsForm";

export default props => (
  <>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showAddModal}
      isOpen={props.showAddModal}
    >
      <AccountingFieldsForm
        selectedItem={{}}
        addMode={true}
        saveHandler={props.actions.addAccountingField}
        closeHandler={props.actions.showAddModal}
        availableCountries={props.availableCountries}
        errors={props.errors}
        params={props.params}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showEditModal}
      isOpen={props.showEditModal}
    >
      <AccountingFieldsForm
        selectedItem={props.selectedItem}
        editMode={true}
        saveHandler={props.actions.editAccountingField}
        closeHandler={props.actions.showEditModal}
        availableCountries={props.availableCountries}
        errors={props.errors}
        params={props.params}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showDeleteModal}
      isOpen={props.showDeleteModal}
    >
      <AccountingFieldsForm
        selectedItem={props.selectedItem}
        deleteMode={true}
        saveHandler={props.actions.deleteAccountingField}
        closeHandler={props.actions.showDeleteModal}
        availableCountries={props.availableCountries}
        errors={props.errors}
        params={props.params}
      />
    </Modal>
  </>
);
