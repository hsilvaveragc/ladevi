import {
  GETCURRENCIES_INIT,
  ADDCURRENCY_INIT,
  EDITCURRENCY_INIT,
  DELETECURRENCY_INIT,
  INITIAL_LOAD_INIT,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
} from './actionTypes';

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const getCurrenciesInit = () => ({
  type: GETCURRENCIES_INIT,
});

export const addCurrency = (payload) => ({
  type: ADDCURRENCY_INIT,
  payload,
});

export const editCurrency = (payload) => ({
  type: EDITCURRENCY_INIT,
  payload,
});

export const deleteCurrency = (payload) => ({
  type: DELETECURRENCY_INIT,
  payload,
});

export const showAddModal = (payload) => ({
  type: SHOW_ADD_MODAL,
});

export const showEditModal = (payload) => ({
  type: SHOW_EDIT_MODAL,
});

export const showDeleteModal = (payload) => ({
  type: SHOW_DELETE_MODAL,
});
