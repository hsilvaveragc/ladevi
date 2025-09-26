import {
  INITIAL_LOAD_INIT,
  SEARCH_CONTRACTS_INIT,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  ADD_CONTRACT_INIT,
  EDIT_CONTRACT_INIT,
  DELETE_CONTRACT_INIT,
  FILTER_CONTRACTS_INIT,
  GET_SPACETYPES_INIT,
  GET_CURRENCIES_INIT,
  GET_EUROPARITY_INIT,
} from "./actionTypes.js";

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const searchContracts = () => ({
  type: SEARCH_CONTRACTS_INIT,
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

export const filterContracts = payload => ({
  type: FILTER_CONTRACTS_INIT,
  payload,
});

export const addContract = payload => ({
  type: ADD_CONTRACT_INIT,
  payload,
});

export const editContract = payload => ({
  type: EDIT_CONTRACT_INIT,
  payload,
});

export const deleteContract = payload => ({
  type: DELETE_CONTRACT_INIT,
  payload,
});

export const getSpaceTypesByProduct = payload => ({
  type: GET_SPACETYPES_INIT,
  payload,
});

export const getCurrenciesByCountry = payload => ({
  type: GET_CURRENCIES_INIT,
  payload,
});

export const getEuroParity = payload => ({
  type: GET_EUROPARITY_INIT,
  payload,
});
