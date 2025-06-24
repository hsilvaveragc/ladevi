import { createSelector } from "reselect";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FILTER_ORDERSFPR_INIT,
  FILTER_ORDERSFPR_SUCCESS,
  FILTER_ORDERSFPR_FAILURE,
  GET_ALL_PRODUCTEDITIONS_INIT,
  GET_ALL_PRODUCTEDITIONS_SUCESS,
  GET_ALL_PRODUCTEDITIONS_FAILURE,
  CLEARFILTERS,
} from "./actionTypes";

const initialState = {
  ordersForProduction: [],
  products: [],
  editions: [],
  loading: false,
  errors: {},
  loadingProducts: false,
  loadingProductEditions: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FILTER_ORDERSFPR_INIT:
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
        loadingProducts: true,
        errors: {},
      };
      break;
    case GET_ALL_PRODUCTEDITIONS_INIT:
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
        editions: [],
      };
      break;
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingProducts: false,
        errors: {},
        products: [...action.payload.availableProducts],
      };
      break;
    case GET_ALL_PRODUCTEDITIONS_SUCESS:
      return {
        ...state,
        loading: false,
        loadingProductEditions: false,
        errors: {},
        editions: action.payload,
      };
      break;
    case FILTER_ORDERSFPR_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: {},
        ordersForProduction: action.payload,
      };
      break;

    case FILTER_ORDERSFPR_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
      break;
    case INITIAL_LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        loadingProducts: false,
        errors: action.payload,
      };
      break;
    case GET_ALL_PRODUCTEDITIONS_FAILURE:
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

const getOrdersFPReducer = state => state.ordersForProductionReport;

export const getOrdersFPR = createSelector(
  getOrdersFPReducer,
  ordersFPReducer => ordersFPReducer.ordersForProduction
);

export const getErrors = createSelector(
  getOrdersFPReducer,
  ordersFPReducer => ordersFPReducer.errors
);

export const getLoading = createSelector(
  getOrdersFPReducer,
  ordersFPReducer => ordersFPReducer.loading
);

export const getLoadingProducts = createSelector(
  getOrdersFPReducer,
  ordersFPReducer => ordersFPReducer.loadingProducts
);

export const getLoadingProductEditions = createSelector(
  getOrdersFPReducer,
  ordersFPReducer => ordersFPReducer.loadingProductEditions
);

export const getProducts = createSelector(
  getOrdersFPReducer,
  ordersFPReducer => ordersFPReducer.products
);

export const getEditions = createSelector(
  getOrdersFPReducer,
  ordersFPReducer => ordersFPReducer.editions
);
