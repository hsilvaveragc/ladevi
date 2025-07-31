// eslint-disable-next-line
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import ContractsPage from "./ContractsPage";

import {
  initialLoad,
  searchContracts,
  showAddModal,
  showEditModal,
  showDeleteModal,
  filterContracts,
  addContract,
  editContract,
  deleteContract,
} from "./actionCreators";
import {
  getContracts,
  getSalesmens,
  getProducts,
  getSpaceTypes,
  getSpaceLocations,
  getClients,
  getErrors,
  getCountries,
  getSearchContractsLoading,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getCurrencies,
  getLoading,
  getEuroParities,
} from "./reducer";

import {
  getEditions,
  getSpaceTypes as getSpaceTypesForOrder,
  getSpaceLocations as getSpaceLocationsForOrder,
} from "../orders/reducer";

import { loggedUserSelector } from "../../shared/appData/reducers";

import {
  getSpaceTypesAvailable,
  getSpaceLocationsAvailable,
  addOrder,
  editOrder,
  deleteOrder,
  getClientsWithBalanceAvailable,
  getEditionsForOP,
} from "../orders/actionCreators";

const mapStateToProps = state => ({
  availableContracts: getContracts(state),
  availableSalesmens: getSalesmens(state),
  availableProducts: getProducts(state),
  availableSpaceTypes: getSpaceTypes(state),
  availableSpaceLocations: getSpaceLocations(state),
  availableClients: getClients(state),
  availableCountries: getCountries(state),
  availableCurrencies: getCurrencies(state),
  availableEuroParities: getEuroParities(state),
  errors: getErrors(state),
  isLoading: getSearchContractsLoading(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  loggedUser: loggedUserSelector(state),
  availableEditions: getEditions(state),
  availableSpaceLocationsForOrder: getSpaceLocationsForOrder(state),
  availableSpaceTypesForOrder: getSpaceTypesForOrder(state),
  loading: getLoading(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      initialLoad,
      searchContracts,
      showAddModal,
      showEditModal,
      showDeleteModal,
      filterContracts,
      addContract,
      editContract,
      deleteContract,
      getProductEditions: getEditionsForOP,
      getSpaceTypesAvailable,
      getSpaceLocationsAvailable,
      addOrder,
      editOrder,
      deleteOrder,
      getClientsWithBalance: getClientsWithBalanceAvailable,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ContractsPage);
