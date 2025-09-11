import React, { useState } from 'react';

import Modal from '../../../shared/components/Modal';

import EuroForm from './Form';

const EuroParityModals = (props) => (
  <>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showAddModalEuroParity}
      isOpen={props.showAddModalEuroParity}
    >
      <EuroForm
        saveHandler={props.actions.addEuroParity}
        closeHandler={props.actions.showAddModalEuroParity}
        addMode={true}
        selectedItem={{}}
        errors={props.errorsEuroParity}
        data={props.dataEuroParity}
      />
    </Modal>
    <Modal
      shouldClose={true}
      closeHandler={props.actions.showDeleteModalEuroParity}
      isOpen={props.showDeleteModalEuroParity}
    >
      <EuroForm
        selectedItem={props.selectedItem}
        saveHandler={props.actions.deleteEuroParity}
        closeHandler={props.actions.showDeleteModalEuroParity}
        deleteMode={true}
        errors={props.errorsEuroParity}
      />
    </Modal>
  </>
);

export default EuroParityModals;
