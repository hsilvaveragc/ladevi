import {
  GET_ALL_ACCOUNTING_FIELDS_INIT,
  ADD_ACCOUNTING_FIELD_INIT,
  EDIT_ACCOUNTING_FIELD_INIT,
  DELETE_ACCOUNTING_FIELD_INIT,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  INITIAL_LOAD_INIT,
  FILTER_ACCOUNTING_FIELDS_INIT,
} from './actionTypes';

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const getAllAccountingFields = () => ({
  type: GET_ALL_ACCOUNTING_FIELDS_INIT,
});

export const filterAccountingFields = (payload) => ({
  type: FILTER_ACCOUNTING_FIELDS_INIT,
  payload,
});

export const addAccountingField = (payload) => ({
  type: ADD_ACCOUNTING_FIELD_INIT,
  payload,
});

export const editAccountingField = (payload) => ({
  type: EDIT_ACCOUNTING_FIELD_INIT,
  payload,
});

export const deleteAccountingField = (payload) => ({
  type: DELETE_ACCOUNTING_FIELD_INIT,
  payload,
});

export const showAccountingFieldsAddModal = () => ({
  type: SHOW_ADD_MODAL,
});

export const showAccountingFieldsEditModal = () => ({
  type: SHOW_EDIT_MODAL,
});

export const showAccountingFieldsDeleteModal = () => ({
  type: SHOW_DELETE_MODAL,
});
