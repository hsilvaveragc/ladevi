import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
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
  getLocationData,
  getAllStatesByID,
  getAllDistrictsByID,
  getAllCitiesByID,
  deleteClient,
  // getAllTaxCategories,
} from "./actionCreators.js";

import {
  getAllClients,
  getUsers,
  getTaxes,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getErrors,
  getAllCountries,
  getAllStates,
  getAllDistricts,
  getAllCities,
  getAllTaxCategories,
} from "./reducer";

import Page from "./Page.jsx";

const mapStateToProps = state => ({
  availableClients: getAllClients(state),
  availableUsers: getUsers(state),
  availableTaxes: getTaxes(state),
  availableCountries: getAllCountries(state),
  availableStates: getAllStates(state),
  availableDistricts: getAllDistricts(state),
  availableCities: getAllCities(state),
  availableTaxCategories: getAllTaxCategories(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  errors: getErrors(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      searchClientsInit,
      addClient,
      initialLoad,
      getAllStatesByID,
      getAllDistrictsByID,
      getAllCitiesByID,
      getTaxesInit,
      // getAllTaxCategories,
      showAddModal,
      showEditModal,
      showDeleteModal,
      filterClients,
      editClient,
      getLocationData,
      deleteClient,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Page);
