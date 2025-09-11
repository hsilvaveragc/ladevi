import {
  FILTER_ORDERSFPR_INIT,
  INITIAL_LOAD_INIT,
  GET_ALL_PRODUCTEDITIONS_INIT,
  ADD_ORDERSFPR_INIT,
  CLEARFILTERS,
} from './actionTypes';

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const getProductEditions = (payload) => ({
  type: GET_ALL_PRODUCTEDITIONS_INIT,
  payload,
});

export const filterReport = (payload) => ({
  type: FILTER_ORDERSFPR_INIT,
  payload,
});

export const addReporteGeneration = (payload) => ({
  type: ADD_ORDERSFPR_INIT,
  payload,
});
export const clearFilters = () => ({
  type: CLEARFILTERS,
});
