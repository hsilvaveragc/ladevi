import { createSelector } from 'reselect';

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAILURE,
  EDIT_ORDER_SUCCESS,
  EDIT_ORDER_FAILURE,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  FILTER_ORDERS_INIT,
  FILTER_ORDERS_SUCCESS,
  FILTER_ORDERS_FAILURE,
  GETEDITIONSFILTER_INIT,
  GETEDITIONSFILTER_SUCCESS,
  GETEDITIONSFILTER_FAILURE,
  GET_ALL_PRODUCTEDITIONS_INIT,
  GET_ALL_PRODUCTEDITIONS_SUCESS,
  GET_ALL_PRODUCTEDITIONS_FAILURE,
  GET_CLIENTSWITHBALANCE_INIT,
  GET_CLIENTSWITHBALANCE_SUCESS,
  GET_CLIENTSWITHBALANCE_FAILURE,
  GET_ALL_CONTRACTS_INIT,
  GET_ALL_CONTRACTS_SUCESS,
  GET_ALL_CONTRACTS_FAILURE,
  GET_ALL_SPACESTYPES_INIT,
  GET_ALL_SPACETYPES_SUCESS,
  GET_ALL_SPACETYPES_FAILURE,
  GET_ALL_SPACELOCATIONS_INIT,
  GET_ALL_SPACELOCATIONS_SUCESS,
  GET_ALL_SPACELOCATIONS_FAILURE,
} from './actionTypes.js';

const initialState = {
  orders: [],
  products: [],
  editionsFilter: [],
  salesmens: [],
  allClients: [],
  editions: [],
  clientsWithBalance: [],
  contracts: [],
  spaceTypes: [],
  spaceLocations: [],
  errors: {},
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  loadingOrders: false,
  loadingProducts: false,
  loadingEditionsFilter: false,
  loadingSalesmens: false,
  loadingAllClients: false,
  loadingEidtions: false,
  loadingClientsWithBalance: false,
  loadingContracts: false,
  loadingSpaceTypes: false,
  loadingSpaceLocations: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INITIAL_LOAD_INIT: {
      return {
        ...state,
        loadingProducts: true,
        loadingSalesmens: true,
        loadingAllClients: true,
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
        editionsFilter: [],
      };
    }
    case GETEDITIONSFILTER_INIT:
      return {
        ...state,
        loadingEditionsFilter: true,
      };
    case FILTER_ORDERS_INIT:
      return {
        ...state,
        loadingOrders: true,
      };
    case GET_ALL_PRODUCTEDITIONS_INIT:
      return {
        ...state,
        loadingEidtions: true,
      };
    case GET_CLIENTSWITHBALANCE_INIT:
      return {
        ...state,
        loadingClientsWithBalance: true,
      };
    case GET_ALL_CONTRACTS_INIT:
      return {
        ...state,
        loadingContracts: true,
      };
    case GET_ALL_SPACESTYPES_INIT:
      return {
        ...state,
        loadingSpaceTypes: true,
      };
    case GET_ALL_SPACELOCATIONS_INIT:
      return {
        ...state,
        loadingSpaceLocations: true,
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loadingProducts: false,
        loadingSalesmens: false,
        loadingAllClients: false,
        salesmens: [...action.payload.availableSalesmens],
        products: [...action.payload.availableProducts],
        allClients: [...action.payload.allClients],
      };
    case GETEDITIONSFILTER_SUCCESS:
      return {
        ...state,
        loadingEditionsFilter: false,
        editionsFilter: [...action.payload],
      };
    case FILTER_ORDERS_SUCCESS:
      return {
        ...state,
        loadingOrders: false,
        orders: [...action.payload.availableOrders],
      };
    case GET_ALL_PRODUCTEDITIONS_SUCESS:
      return {
        ...state,
        loadingEidtions: false,
        editions: [...action.payload],
      };
    case GET_CLIENTSWITHBALANCE_SUCESS:
      return {
        ...state,
        loadingClientsWithBalance: false,
        clientsWithBalance: [...action.payload],
      };
    case GET_ALL_CONTRACTS_SUCESS:
      return {
        ...state,
        loadingContracts: false,
        contracts: [...action.payload],
      };
    case GET_ALL_SPACETYPES_SUCESS:
      return {
        ...state,
        loadingSpaceTypes: false,
        spaceTypes: [...action.payload],
      };
    case GET_ALL_SPACELOCATIONS_SUCESS:
      return {
        ...state,
        loadingSpaceLocations: false,
        spaceLocations: [...action.payload],
      };
    case ADD_ORDER_SUCCESS:
    case SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        editions: [],
        clientsWithBalance: [],
        contracts: [],
        spaceLocations: [],
        spaceTypes: [],
        errors: {},
      };
    case EDIT_ORDER_SUCCESS:
    case SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        editions: [],
        clientsWithBalance: [],
        contracts: [],
        spaceLocations: [],
        spaceTypes: [],
        errors: {},
      };
    case DELETE_ORDER_SUCCESS:
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        editions: [],
        clientsWithBalance: [],
        contracts: [],
        spaceLocations: [],
        spaceTypes: [],
        errors: {},
      };

    case INITIAL_LOAD_FAILURE:
      return {
        ...state,
        loadingProducts: false,
        loadingSalesmens: false,
        loadingAllClients: false,
        errors: { ...action.errors },
      };
    case GETEDITIONSFILTER_FAILURE:
      return {
        ...state,
        loadingEditionsFilter: false,
      };
    case FILTER_ORDERS_FAILURE:
      return {
        ...state,
        loadingOrders: false,
        errors: { ...action.errors },
      };
    case GET_ALL_PRODUCTEDITIONS_FAILURE: {
      return {
        ...state,
        loadingEidtions: false,
      };
    }
    case GET_CLIENTSWITHBALANCE_FAILURE:
      return {
        ...state,
        loadingClientsWithBalance: false,
        errors: { ...action.errors },
      };
    case GET_ALL_CONTRACTS_FAILURE:
      return {
        ...state,
        loadingContracts: false,
      };
    case GET_ALL_SPACETYPES_FAILURE:
      return {
        ...state,
        loadingSpaceTypes: false,
      };
    case GET_ALL_SPACELOCATIONS_FAILURE:
      return {
        ...state,
        loadingSpaceLocations: false,
      };
    case ADD_ORDER_FAILURE:
    case EDIT_ORDER_FAILURE:
    case DELETE_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        errors: { ...action.errors },
      };
    default:
      return state;
  }
}

const getOrdersReducer = (state) => state.orders;

export const getOrders = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.orders
);

export const getProducts = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.products
);

export const getEditionsForFilter = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.editionsFilter
);

export const getSalesmens = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.salesmens
);

export const getAllClients = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.allClients
);

export const getEditions = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.editions
);

export const getClientsWithBalance = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.clientsWithBalance
);

export const getContracts = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.contracts
);

export const getSpaceTypes = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.spaceTypes
);

export const getSpaceLocations = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.spaceLocations
);

export const getErrors = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.errors
);

export const getShowAddModal = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.showDeleteModal
);

export const getLoadingOrders = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingOrders
);

export const getLoadingProducts = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingProducts
);

export const getLoadingEditionsFilter = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingEditionsFilter
);

export const getLoadingSalesmens = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingSalesmens
);

export const getLoadingAllClients = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingAllClients
);

export const getLoadingEditions = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingEidtions
);

export const getLoadingClientsWithBalance = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingClientsWithBalance
);

export const getLoadingContracts = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingContracts
);

export const getLoadingSpaceTypes = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingSpaceTypes
);

export const getLoadingSpaceLocations = createSelector(
  getOrdersReducer,
  (ordersReducer) => ordersReducer.loadingSpaceLocations
);
