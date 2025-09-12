import { createSelector } from "reselect";

import {
  GETCURRENCIES_INIT,
  GETCURRENCIES_SUCCESS,
  GETCURRENCIES_FAILURE,
  //ADDCURRENCY_INIT,
  ADDCURRENCY_SUCCESS,
  ADDCURRENCY_FAILURE,
  //EDITCURRENCY_INIT,
  EDITCURRENCY_SUCCESS,
  EDITCURRENCY_FAILURE,
  DELETECURRENCY_INIT,
  DELETECURRENCY_SUCCESS,
  DELETECURRENCY_FAILURE,
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
} from "./actionTypes";

const initialState = {
  currencies: [],
  countries: [],
  errors: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case INITIAL_LOAD_INIT:
    case GETCURRENCIES_INIT:
    case DELETECURRENCY_INIT:
      return {
        ...state,
        loading: true,
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        countries: [...action.payload.availableCountries],
        currencies: [...action.payload.availableCurrencies],
        loading: false,
      };
    case GETCURRENCIES_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        currencies: action.payload,
      };
    case SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
      };
    case SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
      };
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
      };
    case ADDCURRENCY_SUCCESS:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case EDITCURRENCY_SUCCESS:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        errors: {},
      };
    case DELETECURRENCY_SUCCESS:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
        loading: false,
      };
    case INITIAL_LOAD_FAILURE:
    case GETCURRENCIES_FAILURE:
    case ADDCURRENCY_FAILURE:
    case EDITCURRENCY_FAILURE:
    case DELETECURRENCY_FAILURE:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
}

const getCurrencyReducer = state => state.currency;

export const getCountries = createSelector(
  getCurrencyReducer,
  state => state.countries
);

export const getCurrencies = createSelector(
  getCurrencyReducer,
  state => state.currencies
);

export const getLoading = createSelector(
  getCurrencyReducer,
  state => state.loading
);

export const getErrors = createSelector(
  getCurrencyReducer,
  state => state.errors
);

export const getShowAddModal = createSelector(
  getCurrencyReducer,
  state => state.showAddModal
);

export const getShowEditModal = createSelector(
  getCurrencyReducer,
  state => state.showEditModal
);

export const getShowDeleteModal = createSelector(
  getCurrencyReducer,
  state => state.showDeleteModal
);
