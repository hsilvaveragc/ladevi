import {
  INITIAL_LOAD_INIT,
  FILTER_ORDERSBYSELLER_INIT,
  GET_PRODUCT_BYTYPE_INIT,
  GET_PRODUCTEDITION_BYPRODUCT_INIT,
  CLEARFILTERS,
} from './actionTypes';

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const filterReport = (payload) => ({
  type: FILTER_ORDERSBYSELLER_INIT,
  payload,
});

export const getProductsByType = (payload) => ({
  type: GET_PRODUCT_BYTYPE_INIT,
  payload,
});

export const getProductEditionByProduct = (payload) => ({
  type: GET_PRODUCTEDITION_BYPRODUCT_INIT,
  payload,
});

export const clearFilters = () => ({
  type: CLEARFILTERS,
});
