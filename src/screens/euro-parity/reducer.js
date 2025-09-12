import { createSelector } from "reselect";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  SHOW_ADD_MODAL,
  SHOW_DELETE_MODAL,
  GETEUROPARITIES_INIT,
  GETEUROPARITIES_SUCCESS,
  GETEUROPARITIES_FAILURE,
  ADDEUROPARITY_SUCCESS,
  ADDEUROPARITY_FAILURE,
  DELETEEUROPARITY_SUCCESS,
  DELETEEUROPARITY_FAILURE,
} from "./actionTypes";

const initialState = {
  euroParities: [],
  errors: {},
  loading: false,
  showAddModal: false,
  showDeleteModal: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case INITIAL_LOAD_INIT:
    case GETEUROPARITIES_INIT:
      return {
        ...state,
        loading: true,
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        euroParities: [...action.payload.availableEuroParities],
        loading: false,
      };
    case GETEUROPARITIES_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        euroParities: action.payload,
      };
    case SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
      };
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
      };
    case ADDEUROPARITY_SUCCESS:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case DELETEEUROPARITY_SUCCESS:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
      };
    case INITIAL_LOAD_FAILURE:
    case GETEUROPARITIES_FAILURE:
    case ADDEUROPARITY_FAILURE:
    case DELETEEUROPARITY_FAILURE:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
}

const getEuroParityReducer = state => state.euroParity;

export const getEuroParities = createSelector(
  getEuroParityReducer,
  state => state.euroParities
);

export const getLoading = createSelector(
  getEuroParityReducer,
  state => state.loading
);

export const getErrors = createSelector(
  getEuroParityReducer,
  state => state.errors
);

export const getShowAddModal = createSelector(
  getEuroParityReducer,
  state => state.showAddModal
);

export const getShowDeleteModal = createSelector(
  getEuroParityReducer,
  state => state.showDeleteModal
);
