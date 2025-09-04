import {
  PRODUCTS_INITIAL_LOAD_INIT,
  GET_ALL_PRODUCTS_INIT,
  GET_ALL_PRODUCT_TYPES_INIT,
  ADD_PRODUCT_INIT,
  EDIT_PRODUCT_INIT,
  DELETE_PRODUCT_INIT,
  PRODUCT_SHOW_ADD_MODAL,
  PRODUCT_SHOW_EDIT_MODAL,
  PRODUCT_SHOW_DELETE_MODAL,
  FILTER_PRODUCTS_INIT,
} from "./actionTypes";

export const initialLoad = () => ({
  type: PRODUCTS_INITIAL_LOAD_INIT,
});

export const getAllProducts = () => ({
  type: GET_ALL_PRODUCTS_INIT,
});

export const filterProducts = payload => ({
  type: FILTER_PRODUCTS_INIT,
  payload,
});

export const getAllProductTypes = () => ({
  type: GET_ALL_PRODUCT_TYPES_INIT,
});

export const addProduct = payload => ({
  type: ADD_PRODUCT_INIT,
  payload,
});

export const editProduct = payload => ({
  type: EDIT_PRODUCT_INIT,
  payload,
});

export const deleteProduct = payload => ({
  type: DELETE_PRODUCT_INIT,
  payload,
});

export const showAddModal = () => ({
  type: PRODUCT_SHOW_ADD_MODAL,
});

export const showEditModal = () => ({
  type: PRODUCT_SHOW_EDIT_MODAL,
});

export const showDeleteModal = () => ({
  type: PRODUCT_SHOW_DELETE_MODAL,
});
