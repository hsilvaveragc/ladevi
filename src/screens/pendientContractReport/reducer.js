import { createSelector } from "reselect";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FILTER_PENDIENTCONTRACT_INIT,
  FILTER_PENDIENTCONTRACT_SUCCESS,
  FILTER_PENDIENTCONTRACT_FAILURE,
  CLEARFILTERS,
} from "./actionTypes";

const initialState = {
  contracts: [],
  sellers: [],
  clients: [],
  loading: false,
  errors: {},
  loadingAllClients: false,
  loadingSellers: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FILTER_PENDIENTCONTRACT_INIT:
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
        errors: {},
      };
      break;
    case CLEARFILTERS:
      return {
        ...state,
        loading: false,
        loadingAllClients: false,
        loadingSellers: false,
        errors: {},
      };
      break;
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingAllClients: false,
        loadingSellers: false,
        errors: {},
        sellers: [...action.payload.availableSellers],
        clients: [...action.payload.availableClients],
      };
      break;
    case FILTER_PENDIENTCONTRACT_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: {},
        contracts: action.payload,
      };
      break;
    case INITIAL_LOAD_FAILURE:
    case FILTER_PENDIENTCONTRACT_FAILURE:
      return {
        ...state,
        loading: false,
        loadingAllClients: false,
        loadingSellers: false,
        errors: action.payload,
      };
      break;
    case FILTER_PENDIENTCONTRACT_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
      break;
    default:
      return state;
  }
}

const getReducer = state => state.pendientContractReport;

export const getPendientContracts = createSelector(
  getReducer,
  state => state.contracts
);

export const getErrors = createSelector(getReducer, state => state.errors);

export const getLoading = createSelector(getReducer, state => state.loading);

export const getLoadingAllClients = createSelector(
  getReducer,
  state => state.loadingAllClients
);

export const getLoadingSellers = createSelector(
  getReducer,
  state => state.loadingSellers
);

export const getSellers = createSelector(getReducer, state => state.sellers);

export const getClients = createSelector(getReducer, state => state.clients);
