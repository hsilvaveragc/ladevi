// eslint-disable-next-line
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import Page from "./Page";

import {
  initialLoad,
  showAddModal,
  showEditModal,
  showDeleteModal,
  addOrder,
  editOrder,
  deleteOrder,
  filterOrders,
  getEditionsFilter,
  getProductEditions,
  getEditionsForOP,
  getClientsWithBalanceAvailable,
  getContractsAvailable,
  getSpaceTypesAvailable,
  getSpaceLocationsAvailable,
} from "./actionCreators";

import {
  getOrders,
  getProducts,
  getEditionsForFilter,
  getSalesmens,
  getAllClients,
  getEditions,
  getClientsWithBalance,
  getContracts,
  getSpaceTypes,
  getSpaceLocations,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getLoadingOrders,
  getLoadingProducts,
  getLoadingEditionsFilter,
  getLoadingSalesmens,
  getLoadingAllClients,
  getLoadingEditions,
  getLoadingClientsWithBalance,
  getLoadingContracts,
  getLoadingSpaceTypes,
  getLoadingSpaceLocations,
} from "./reducer";

const mapStateToProps = state => ({
  availableOrders: getOrders(state),
  availableProducts: getProducts(state),
  availableEditionsForFilter: getEditionsForFilter(state),
  availableSalesmens: getSalesmens(state),
  allClients: getAllClients(state),
  availableEditions: getEditions(state),
  availableClients: getClientsWithBalance(state),
  availableContracts: getContracts(state),
  availableSpaceTypes: getSpaceTypes(state),
  availableSpaceLocations: getSpaceLocations(state),
  errors: getErrors(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  isLoading: getLoadingOrders(state),
  isLoadingProducts: getLoadingProducts(state),
  isLoadingEditionsFilter: getLoadingEditionsFilter(state),
  isLoadingSalesmens: getLoadingSalesmens(state),
  isLoadingAllClients: getLoadingAllClients(state),
  isLoadingEditions: getLoadingEditions(state),
  isLoadingClients: getLoadingClientsWithBalance(state),
  isLoadingContracts: getLoadingContracts(state),
  isLoadingSpaceTypes: getLoadingSpaceTypes(state),
  isLoadingSpaceLocations: getLoadingSpaceLocations(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      initialLoad,
      showAddModal,
      showEditModal,
      showDeleteModal,
      addOrder,
      editOrder,
      deleteOrder,
      filterOrders,
      getEditionsFilter,
      getProductEditions,
      getEditionsForOP,
      getClientsWithBalanceAvailable,
      getContractsAvailable,
      getSpaceTypesAvailable,
      getSpaceLocationsAvailable,
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
