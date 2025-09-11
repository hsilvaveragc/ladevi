import { createSelector } from 'reselect';

import {
  SEARCH_CLIENTS_INIT,
  SEARCH_CLIENTS_SUCCESS,
  SEARCH_CLIENTS_FAILURE,
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  GET_TAXES_SUCCESS,
  GET_TAXES_FAILURE,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_FAILURE,
  EDIT_CLIENT_FAILURE,
  EDIT_CLIENT_SUCCESS,
  DELETE_CLIENT_SUCCESS,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  FILTER_CLIENTS_INIT,
  FILTER_CLIENTS_SUCCESS,
  FILTER_CLIENTS_FAILURE,
  FETCH_STATES_INIT,
  FETCH_STATES_SUCCESS,
  FETCH_STATES_FAILURE,
  FETCH_DISTRICTS_INIT,
  FETCH_DISTRICTS_SUCCESS,
  FETCH_DISTRICTS_FAILURE,
  FETCH_CITIES_INIT,
  FETCH_CITIES_SUCCESS,
  FETCH_CITIES_FAILURE,
  GET_LOCATION_DATA_INIT,
  GET_LOCATION_DATA_SUCCESS,
  GET_LOCATION_DATA_FAILURE,
  GET_ALL_TAX_CATEGORIES_SUCCESS,
  GET_ALL_TAX_CATEGORIES_FAILURE,
  SHOW_DUPLICATE_CUIT_MODAL,
  HIDE_DUPLICATE_CUIT_MODAL,
} from './actionTypes.js';

const initialState = {
  clients: [],
  users: [],
  taxes: { identificationOptions: [], taxOptions: [] },
  countries: [],
  cities: [],
  districts: [],
  states: [],
  taxCategories: [],
  errors: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  showDuplicateCuitModal: false,
  duplicateCuitData: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INITIAL_LOAD_INIT:
    case SEARCH_CLIENTS_INIT:
    case FILTER_CLIENTS_INIT:
      return {
        ...state,
        loading: true,
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: true,
        users: [...action.payload.availableUsers],
        taxes: action.payload.availableTaxes,
        taxCategories: action.payload.availableTaxCategories,
      };
    case SEARCH_CLIENTS_SUCCESS:
    case FILTER_CLIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        clients: [...action.payload.availableClients],
      };
    case GET_TAXES_SUCCESS:
      return {
        ...state,
        taxes: { ...action.payload.availableTaxes },
      };
    case GET_ALL_TAX_CATEGORIES_SUCCESS:
      return {
        ...state,
        taxes: { ...action.payload.availableTaxCategories },
      };
    case ADD_CLIENT_SUCCESS:
    case SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case EDIT_CLIENT_SUCCESS:
    case SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        errors: {},
      };
    case DELETE_CLIENT_SUCCESS:
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
      };
    case FETCH_STATES_INIT:
      return {
        ...state,
        loading: true,
        states: [],
        districts: [],
        cities: [],
      };
    case FETCH_STATES_SUCCESS:
      return {
        ...state,
        loading: false,
        states: [...action.payload],
        districts: [],
        cities: [],
      };
    case FETCH_DISTRICTS_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DISTRICTS_SUCCESS:
      return {
        ...state,
        loading: false,
        districts: [...action.payload],
        cities: [],
      };
    case FETCH_CITIES_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        cities: [...action.payload],
      };
    case GET_LOCATION_DATA_INIT:
      return {
        ...state,
        loading: false,
        countries: [],
        states: [],
        districts: [],
        cities: [],
      };
    case GET_LOCATION_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        countries: [...action.payload.countriesPayload],
        states: [...action.payload.statesPayload],
        districts: [...action.payload.districtsPayload],
        cities: [...action.payload.citiesPayload],
      };
    case GET_TAXES_FAILURE:
    case GET_ALL_TAX_CATEGORIES_FAILURE:
    case SEARCH_CLIENTS_FAILURE:
    case INITIAL_LOAD_FAILURE:
    case FILTER_CLIENTS_FAILURE:
    case ADD_CLIENT_FAILURE:
    case EDIT_CLIENT_FAILURE:
    case FETCH_STATES_FAILURE:
    case FETCH_DISTRICTS_FAILURE:
    case FETCH_CITIES_FAILURE:
    case GET_LOCATION_DATA_FAILURE:
      return { ...state, loading: false, errors: { ...action.errors } };
    case SHOW_DUPLICATE_CUIT_MODAL:
      return {
        ...state,
        showDuplicateCuitModal: true,
        duplicateCuitData: action.payload,
      };

    case HIDE_DUPLICATE_CUIT_MODAL:
      return {
        ...state,
        showDuplicateCuitModal: false,
        duplicateCuitData: null,
      };
    default:
      return state;
  }
}

const getClientsReducer = (state) => state.clients;

export const getAllClients = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.clients
);

export const getErrors = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.errors
);

export const getSearchClientsLoading = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.searchClientsLoading
);

export const getUsers = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.users
);

export const getTaxes = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.taxes
);

export const getAllTaxCategories = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.taxCategories
);

export const getShowAddModal = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.showDeleteModal
);

export const fetchCountries = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.countries
);

export const fetchStates = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.states
);

export const fetchDistricts = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.districts
);

export const getAllCities = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.cities
);

export const getShowDuplicateCuitModal = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.showDuplicateCuitModal
);

export const getDuplicateCuitData = createSelector(
  getClientsReducer,
  (clientsReducer) => clientsReducer.duplicateCuitData
);
