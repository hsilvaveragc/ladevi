import {
  INITIAL_LOAD_INIT,
  SEARCH_CLIENTS_INIT,
  ADD_CLIENT_INIT,
  GET_TAXES_INIT,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  FILTER_CLIENTS_INIT,
  EDIT_CLIENT_INIT,
  GET_LOCATION_DATA_INIT,
  FETCH_STATES_INIT,
  FETCH_DISTRICTS_INIT,
  FETCH_CITIES_INIT,
  DELETE_CLIENT_INIT,
  CONFIRM_DUPLICATE_CUIT_ASSOCIATION,
  HIDE_DUPLICATE_CUIT_MODAL,
} from "./actionTypes.js";

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const searchClientsInit = () => ({
  type: SEARCH_CLIENTS_INIT,
});

export const addClient = payload => ({
  type: ADD_CLIENT_INIT,
  payload,
});

export const getTaxesInit = payload => ({
  type: GET_TAXES_INIT,
  payload,
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

export const filterClients = payload => ({
  type: FILTER_CLIENTS_INIT,
  payload,
});

export const editClient = payload => ({
  type: EDIT_CLIENT_INIT,
  payload,
});

export const getLocationData = payload => ({
  type: GET_LOCATION_DATA_INIT,
  payload,
});

export const getAllStatesByID = payload => ({
  type: FETCH_STATES_INIT,
  payload,
});

export const getAllDistrictsByID = payload => ({
  type: FETCH_DISTRICTS_INIT,
  payload,
});

export const fetchCitiesById = payload => ({
  type: FETCH_CITIES_INIT,
  payload,
});

export const deleteClient = payload => ({
  type: DELETE_CLIENT_INIT,
  payload,
});

export const confirmDuplicateCuitAssociation = payload => ({
  type: CONFIRM_DUPLICATE_CUIT_ASSOCIATION,
  payload,
});

export const hideDuplicateCuitModal = () => ({
  type: HIDE_DUPLICATE_CUIT_MODAL,
});
