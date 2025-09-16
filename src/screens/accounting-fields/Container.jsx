import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import {
  initialLoad,
  addAccountingField,
  editAccountingField,
  deleteAccountingField,
  showAccountingFieldsAddModal,
  showAccountingFieldsEditModal,
  showAccountingFieldsDeleteModal,
  getAllAccountingFields,
  filterAccountingFields,
} from './actionCreators.js';
import {
  getAccountingFields,
  getCountries,
  getLoading,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
} from './reducer.js';
import Page from './Page.jsx';

const mapStateToProps = (state) => ({
  accountingFields: getAccountingFields(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  countries: getCountries(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      initialLoad,
      addAccountingField,
      editAccountingField,
      deleteAccountingField,
      showAddModal: showAccountingFieldsAddModal,
      showEditModal: showAccountingFieldsEditModal,
      showDeleteModal: showAccountingFieldsDeleteModal,
      getAllAccountingFields,
      filterAccountingFields,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Page);
