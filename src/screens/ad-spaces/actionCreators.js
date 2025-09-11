import {
  GET_ALL_PRODUCT_ADVERTISING_SPACES_INIT,
  ADD_PRODUCT_ADVERTISING_SPACE_INIT,
  EDIT_PRODUCT_ADVERTISING_SPACE_INIT,
  DELETE_PRODUCT_ADVERTISING_SPACE_INIT,
  PRODUCT_ADVERTISING_SPACE_SHOW_ADD_MODAL,
  PRODUCT_ADVERTISING_SPACE_SHOW_EDIT_MODAL,
  PRODUCT_ADVERTISING_SPACE_SHOW_DELETE_MODAL,
  PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_INIT,
  FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
} from './actionTypes';

export const getAllProductAdvertisingSpaces = () => ({
  type: GET_ALL_PRODUCT_ADVERTISING_SPACES_INIT,
});

export const addProductAdvertisingSpace = (payload) => ({
  type: ADD_PRODUCT_ADVERTISING_SPACE_INIT,
  payload,
});

export const editProductAdvertisingSpace = (payload) => ({
  type: EDIT_PRODUCT_ADVERTISING_SPACE_INIT,
  payload,
});

export const deleteProductAdvertisingSpace = (payload) => ({
  type: DELETE_PRODUCT_ADVERTISING_SPACE_INIT,
  payload,
});

export const showAddModal = () => ({
  type: PRODUCT_ADVERTISING_SPACE_SHOW_ADD_MODAL,
});

export const showEditModal = () => ({
  type: PRODUCT_ADVERTISING_SPACE_SHOW_EDIT_MODAL,
});

export const showDeleteModal = () => ({
  type: PRODUCT_ADVERTISING_SPACE_SHOW_DELETE_MODAL,
});

export const initialLoad = () => ({
  type: PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_INIT,
});

export const filterProductAdvertisingSpace = (payload) => ({
  type: FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
  payload,
});
