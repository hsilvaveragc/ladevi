import Modal from 'shared/components/Modal';

import CurrencyForm from './Form';

const CurrencyModals = (props) => (
  <>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showAddModal}
      isOpen={props.showAddModal}
    >
      <CurrencyForm
        saveHandler={props.actions.addCurrency}
        closeHandler={props.actions.showAddModal}
        availableCountries={props.availableCountries}
        addMode={true}
        selectedItem={{}}
        errors={props.errors}
        data={props.data}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showEditModal}
      isOpen={props.showEditModal}
    >
      <CurrencyForm
        selectedItem={props.selectedItem}
        saveHandler={props.actions.editCurrency}
        closeHandler={props.actions.showEditModal}
        availableCountries={props.availableCountries}
        editMode={true}
        errors={props.errors}
        data={props.data}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showDeleteModal}
      isOpen={props.showDeleteModal}
    >
      <CurrencyForm
        selectedItem={props.selectedItem}
        saveHandler={props.actions.deleteCurrency}
        closeHandler={props.actions.showDeleteModal}
        availableCountries={props.availableCountries}
        deleteMode={true}
        errors={props.errors}
        isLoading={props.isLoading}
      />
    </Modal>
  </>
);

export default CurrencyModals;
