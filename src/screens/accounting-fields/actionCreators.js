import {
  GET_ALL_ACCOUNTING_FIELDS_INIT,
  ADD_ACCOUNTING_FIELD_INIT,
  EDIT_ACCOUNTING_FIELD_INIT,
  DELETE_ACCOUNTING_FIELD_INIT,
  ACCOUNTING_FIELDS_SHOW_ADD_MODAL,
  ACCOUNTING_FIELDS_SHOW_EDIT_MODAL,
  ACCOUNTING_FIELDS_SHOW_DELETE_MODAL,
  ACCOUNTING_FIELDS_INITIAL_LOAD_INIT,
  FILTER_ACCOUNTING_FIELDS_INIT,
} from "./actionTypes";

export const initialLoad = () => ({
  type: ACCOUNTING_FIELDS_INITIAL_LOAD_INIT,
});

export const getAllAccountingFields = () => ({
  type: GET_ALL_ACCOUNTING_FIELDS_INIT,
});

export const filterAccountingFields = payload => ({
  type: FILTER_ACCOUNTING_FIELDS_INIT,
  payload,
});

export const addAccountingField = payload => ({
  type: ADD_ACCOUNTING_FIELD_INIT,
  payload,
});

export const editAccountingField = payload => ({
  type: EDIT_ACCOUNTING_FIELD_INIT,
  payload,
});

export const deleteAccountingField = payload => ({
  type: DELETE_ACCOUNTING_FIELD_INIT,
  payload,
});

export const showAccountingFieldsAddModal = () => ({
  type: ACCOUNTING_FIELDS_SHOW_ADD_MODAL,
});

export const showAccountingFieldsEditModal = () => ({
  type: ACCOUNTING_FIELDS_SHOW_EDIT_MODAL,
});

export const showAccountingFieldsDeleteModal = () => ({
  type: ACCOUNTING_FIELDS_SHOW_DELETE_MODAL,
});
