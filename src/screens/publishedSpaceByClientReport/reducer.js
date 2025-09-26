import { createSelector } from "reselect";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FILTER_ORDERSBYCLIENT_INIT,
  FILTER_ORDERSBYCLIENT_SUCCESS,
  FILTER_ORDERSBYCLIENT_FAILURE,
  GET_PRODUCT_BYTYPE_INIT,
  GET_PRODUCT_BYTYPE_SUCCESS,
  GET_PRODUCT_BYTYPE_FAILURE,
  GET_PRODUCTEDITION_BYPRODUCT_INIT,
  GET_PRODUCTEDITION_BYPRODUCT_SUCCESS,
  GET_PRODUCTEDITION_BYPRODUCT_FAILURE,
  CLEARFILTERS,
} from "./actionTypes";

const initialState = {
  orders: [],
  productTypes: [],
  products: [],
  editions: [],
  sellers: [],
  clients: [],
  loading: false,
  errors: {},
  loadingAllClients: false,
  loadingSellers: false,
  loadingProductTypes: false,
  loadingProducts: false,
  loadingProductEditions: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FILTER_ORDERSBYCLIENT_INIT:
      return {
        ...state,
        loading: true,
        errors: {},
      };
      break;
    case INITIAL_LOAD_INIT:
      return {
        ...state,
        loading: true,
        loadingAllClients: true,
        loadingSellers: true,
        loadingProductTypes: true,
        errors: {},
      };
      break;
    case GET_PRODUCT_BYTYPE_INIT:
      return {
        ...state,
        loading: true,
        loadingProducts: true,
        errors: {},
      };
      break;
    case GET_PRODUCTEDITION_BYPRODUCT_INIT:
      return {
        ...state,
        loading: true,
        loadingProductEditions: true,
        errors: {},
      };
      break;
    case CLEARFILTERS:
      return {
        ...state,
        loading: false,
        errors: {},
        orders: [],
        products: [],
        editions: [],
      };
      break;
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingAllClients: false,
        loadingSellers: false,
        loadingProductTypes: false,
        errors: {},
        productTypes: [...action.payload.availableProductTypes],
        sellers: [...action.payload.availableSellers],
        clients: [...action.payload.availableClients],
      };
      break;
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
    case FILTER_ORDERSBYCLIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: {},
        orders: action.payload,
      };
      break;
    case FILTER_ORDERSBYCLIENT_FAILURE:
    case INITIAL_LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        loadingAllClients: false,
        loadingSellers: false,
        loadingProductTypes: false,
        errors: action.payload,
      };
      break;
    case GET_PRODUCT_BYTYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loadingProducts: false,
        errors: action.payload,
      };
      break;
    case GET_PRODUCTEDITION_BYPRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        loadingProductEditions: false,
        errors: action.payload,
      };
      break;
    default:
      return state;
  }
}

const getReducer = state => state.publishedOrderByClientReport;

export const getOrdersByClient = createSelector(
  getReducer,
  state => state.orders
);

export const getErrors = createSelector(getReducer, state => state.errors);

export const getLoading = createSelector(getReducer, state => state.loading);

export const getLoadingAllClients = createSelector(
  getReducer,
  state => state.loadingAllClients
);

export const getLoadingProductTypes = createSelector(
  getReducer,
  state => state.loadingProductTypes
);

export const getLoadingSellers = createSelector(
  getReducer,
  state => state.loadingSellers
);

export const getLoadingProducts = createSelector(
  getReducer,
  state => state.loadingProducts
);

export const getLoadingProductEditions = createSelector(
  getReducer,
  state => state.loadingProductEditions
);

export const getProductTypes = createSelector(
  getReducer,
  state => state.productTypes
);

export const getProducts = createSelector(getReducer, state => state.products);

export const getEditions = createSelector(getReducer, state => state.editions);

export const getSellers = createSelector(getReducer, state => state.sellers);

export const getClients = createSelector(getReducer, state => state.clients);
