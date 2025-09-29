import {
  INITIAL_LOAD_INIT,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  ADD_ORDER_INIT,
  EDIT_ORDER_INIT,
  DELETE_ORDER_INIT,
  FILTER_ORDERS_INIT,
  GETEDITIONSFILTER_INIT,
  GET_ALL_PRODUCTEDITIONS_INIT,
  GETEDITIONSFOROP_INIT,
  GET_CLIENTSWITHBALANCE_INIT,
  GET_ALL_CONTRACTS_INIT,
  GET_ALL_SPACESTYPES_INIT,
  GET_ALL_SPACELOCATIONS_INIT,
} from './actionTypes.js';

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const showAddModal = () => ({
  type: SHOW_ADD_MODAL,
});

export const showEditModal = () => ({
  type: SHOW_EDIT_MODAL,
});

export const showDeleteModal = () => ({
  type: SHOW_DELETE_MODAL,
});

export const addOrder = (payload) => ({
  type: ADD_ORDER_INIT,
  payload,
});

export const editOrder = (payload) => ({
  type: EDIT_ORDER_INIT,
  payload,
});

export const deleteOrder = (payload) => ({
  type: DELETE_ORDER_INIT,
  payload,
});

export const filterOrders = (payload) => ({
  type: FILTER_ORDERS_INIT,
  payload,
});

export const getEditionsFilter = (payload) => ({
  type: GETEDITIONSFILTER_INIT,
  payload,
});

export const getProductEditions = (payload) => ({
  type: GET_ALL_PRODUCTEDITIONS_INIT,
  payload,
});

export const getEditionsForOP = (payload) => ({
  type: GETEDITIONSFOROP_INIT,
  payload,
});

export const getClientsWithBalanceAvailable = (payload) => ({
  type: GET_CLIENTSWITHBALANCE_INIT,
  payload,
});

export const getContractsAvailable = (payload) => ({
  type: GET_ALL_CONTRACTS_INIT,
  payload,
});

export const getSpaceTypesAvailable = (payload) => ({
  type: GET_ALL_SPACESTYPES_INIT,
  payload,
});

export const getSpaceLocationsAvailable = (payload) => ({
  type: GET_ALL_SPACELOCATIONS_INIT,
  payload,
});
