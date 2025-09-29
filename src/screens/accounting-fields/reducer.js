import { createSelector } from 'reselect';

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  GET_ALL_ACCOUNTING_FIELDS_INIT,
  GET_ALL_ACCOUNTING_FIELDS_SUCCESS,
  GET_ALL_ACCOUNTING_FIELDS_FAILURE,
  FILTER_ACCOUNTING_FIELDS_INIT,
  FILTER_ACCOUNTING_FIELDS_SUCCESS,
  FILTER_ACCOUNTING_FIELDS_FAILURE,
  ADD_ACCOUNTING_FIELD_SUCCESS,
  ADD_ACCOUNTING_FIELD_FAILURE,
  EDIT_ACCOUNTING_FIELD_SUCCESS,
  EDIT_ACCOUNTING_FIELD_FAILURE,
  DELETE_ACCOUNTING_FIELD_SUCCESS,
  DELETE_ACCOUNTING_FIELD_FAILURE,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
} from './actionTypes.js';

const initialState = {
  items: [],
  countries: [],
  errors: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INITIAL_LOAD_INIT:
    case FILTER_ACCOUNTING_FIELDS_INIT:
    case GET_ALL_ACCOUNTING_FIELDS_INIT:
      return {
        ...state,
        loading: true,
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        items: [...action.payload.accountingFields],
        countries: [...action.payload.countries],
        loading: false,
      };
    case FILTER_ACCOUNTING_FIELDS_SUCCESS:
    case GET_ALL_ACCOUNTING_FIELDS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...action.payload],
      };
    case ADD_ACCOUNTING_FIELD_SUCCESS:
    case SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
      };
    case EDIT_ACCOUNTING_FIELD_SUCCESS:
    case SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
      };
    case DELETE_ACCOUNTING_FIELD_SUCCESS:
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
      };
    case INITIAL_LOAD_FAILURE:
    case GET_ALL_ACCOUNTING_FIELDS_FAILURE:
    case ADD_ACCOUNTING_FIELD_FAILURE:
    case EDIT_ACCOUNTING_FIELD_FAILURE:
    case DELETE_ACCOUNTING_FIELD_FAILURE:
    case FILTER_ACCOUNTING_FIELDS_FAILURE:
      return { ...state, errors: { ...action.errors } };
    default:
      return state;
  }
}

const getAccountingFieldsReducer = (state) => state.accountingFields;

export const getAccountingFields = createSelector(
  getAccountingFieldsReducer,
  (accountingFieldsReducer) => accountingFieldsReducer.items
);

export const getCountries = createSelector(
  getAccountingFieldsReducer,
  (accountingFieldsReducer) => accountingFieldsReducer.countries
);

export const getLoading = createSelector(
  getAccountingFieldsReducer,
  (accountingFieldsReducer) => accountingFieldsReducer.loading
);

export const getErrors = createSelector(
  getAccountingFieldsReducer,
  (accountingFieldsReducer) => accountingFieldsReducer.errors
);

export const getShowAddModal = createSelector(
  getAccountingFieldsReducer,
  (accountingFieldsReducer) => accountingFieldsReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getAccountingFieldsReducer,
  (accountingFieldsReducer) => accountingFieldsReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getAccountingFieldsReducer,
  (accountingFieldsReducer) => accountingFieldsReducer.showDeleteModal
);
