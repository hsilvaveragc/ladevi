import {
  INITIAL_LOAD_INIT,
  FILTER_PENDIENTCONTRACT_INIT,
  CLEARFILTERS,
} from "./actionTypes";

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const filterReport = payload => ({
  type: FILTER_PENDIENTCONTRACT_INIT,
  payload,
});

export const clearFilters = () => ({
  type: CLEARFILTERS,
});
