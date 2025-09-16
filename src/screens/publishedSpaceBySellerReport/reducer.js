import { createSelector } from 'reselect';

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FILTER_ORDERSBYSELLER_INIT,
  FILTER_ORDERSBYSELLER_SUCCESS,
  FILTER_ORDERSBYSELLER_FAILURE,
  GET_PRODUCT_BYTYPE_INIT,
  GET_PRODUCT_BYTYPE_SUCCESS,
  GET_PRODUCT_BYTYPE_FAILURE,
  GET_PRODUCTEDITION_BYPRODUCT_INIT,
  GET_PRODUCTEDITION_BYPRODUCT_SUCCESS,
  GET_PRODUCTEDITION_BYPRODUCT_FAILURE,
  CLEARFILTERS,
} from './actionTypes';

const initialState = {
  ordersBySeller: {
    main: [],
    bySeller: [],
    byEdition: [],
  },
  productTypes: [],
  products: [],
  editions: [],
  sellers: [],
  loading: false,
  errors: {},
  loadingSellers: false,
  loadingProductTypes: false,
  loadingProducts: false,
  loadingProductEditions: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FILTER_ORDERSBYSELLER_INIT:
      return {
        ...state,
        loading: true,
        errors: {},
      };
    case INITIAL_LOAD_INIT:
      return {
        ...state,
        loading: true,
        loadingSellers: true,
        loadingProductTypes: true,
        errors: {},
      };
    case GET_PRODUCT_BYTYPE_INIT:
      return {
        ...state,
        loading: true,
        loadingProducts: true,
        errors: {},
      };
    case GET_PRODUCTEDITION_BYPRODUCT_INIT:
      return {
        ...state,
        loading: true,
        loadingProductEditions: true,
        errors: {},
      };
    case CLEARFILTERS:
      return {
        ...state,
        loading: false,
        errors: {},
        products: [],
        editions: [],
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingSellers: false,
        loadingProductTypes: false,
        errors: {},
        productTypes: [...action.payload.availableProductTypes],
        sellers: [...action.payload.availableSellers],
      };
    case GET_PRODUCT_BYTYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingProducts: false,
        errors: {},
        products: action.payload,
      };
    case GET_PRODUCTEDITION_BYPRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingProductEditions: false,
        errors: {},
        editions: action.payload,
      };
    case FILTER_ORDERSBYSELLER_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: {},
        ordersBySeller: action.payload,
      };
    case INITIAL_LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        loadingSellers: false,
        loadingProductTypes: false,
        errors: action.payload,
      };
    case FILTER_ORDERSBYSELLER_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case GET_PRODUCT_BYTYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loadingProducts: false,
        errors: action.payload,
      };
    case GET_PRODUCTEDITION_BYPRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        loadingProductEditions: false,
        errors: action.payload,
      };
    default:
      return state;
  }
}

const getReducer = (state) => state.publishedOrderBySellerReport;

export const getOrdersBySeller = createSelector(
  getReducer,
  (state) => state.ordersBySeller
);

export const getErrors = createSelector(getReducer, (state) => state.errors);

export const getLoading = createSelector(getReducer, (state) => state.loading);

export const getLoadingSellers = createSelector(
  getReducer,
  (state) => state.loadingSellers
);

export const getLoadingProductTypes = createSelector(
  getReducer,
  (state) => state.loadingProductTypes
);

export const getLoadingProducts = createSelector(
  getReducer,
  (state) => state.loadingProducts
);

export const getLoadingProductEditions = createSelector(
  getReducer,
  (state) => state.loadingProductEditions
);

export const getProductTypes = createSelector(
  getReducer,
  (state) => state.productTypes
);

export const getProducts = createSelector(
  getReducer,
  (state) => state.products
);

export const getEditions = createSelector(
  getReducer,
  (state) => state.editions
);

export const getSellers = createSelector(getReducer, (state) => state.sellers);
