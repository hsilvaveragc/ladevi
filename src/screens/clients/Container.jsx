import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import {
  searchClientsInit,
  addClient,
  initialLoad,
  getTaxesInit,
  showAddModal,
  showEditModal,
  showDeleteModal,
  filterClients,
  editClient,
  fetchCitiesById,
  deleteClient,
  confirmDuplicateCuitAssociation,
  hideDuplicateCuitModal,
} from './actionCreators.js';
import {
  getAllClients,
  getUsers,
  getTaxes,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getErrors,
  getAllCities,
  getAllTaxCategories,
  getShowDuplicateCuitModal,
  getDuplicateCuitData,
} from './reducer.js';
import Page from './Page.jsx';

const mapStateToProps = (state) => ({
  availableClients: getAllClients(state),
  availableUsers: getUsers(state),
  availableCities: getAllCities(state),
  availableTaxes: getTaxes(state),
  availableTaxCategories: getAllTaxCategories(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  errors: getErrors(state),
  showDuplicateCuitModal: getShowDuplicateCuitModal(state),
  duplicateCuitData: getDuplicateCuitData(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      searchClientsInit,
      addClient,
      initialLoad,
      fetchCitiesById,
      getTaxesInit,
      showAddModal,
      showEditModal,
      showDeleteModal,
      filterClients,
      editClient,
      deleteClient,
      confirmDuplicateCuitAssociation,
      hideDuplicateCuitModal,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Page);
