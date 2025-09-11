import Modal from 'shared/components/Modal';

import AccountingFieldForm from './AccountingFieldForm';

const AccountingFieldModal = (props) => (
  <>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showAddModal}
      isOpen={props.showAddModal}
    >
      <AccountingFieldForm
        selectedItem={{}}
        addMode={true}
        saveHandler={props.actions.addAccountingField}
        closeHandler={props.actions.showAddModal}
        countries={props.countries}
        errors={props.errors}
        params={props.params}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showEditModal}
      isOpen={props.showEditModal}
    >
      <AccountingFieldForm
        selectedItem={props.selectedItem}
        editMode={true}
        saveHandler={props.actions.editAccountingField}
        closeHandler={props.actions.showEditModal}
        countries={props.countries}
        errors={props.errors}
        params={props.params}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showDeleteModal}
      isOpen={props.showDeleteModal}
    >
      <AccountingFieldForm
        selectedItem={props.selectedItem}
        deleteMode={true}
        saveHandler={props.actions.deleteAccountingField}
        closeHandler={props.actions.showDeleteModal}
        countries={props.countries}
        errors={props.errors}
        params={props.params}
      />
    </Modal>
  </>
);

export default AccountingFieldModal;
