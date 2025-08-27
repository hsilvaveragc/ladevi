import { createSelector } from "reselect";
import {
  EDITIONS_INITIAL_LOAD_INIT,
  EDITIONS_INITIAL_LOAD_SUCCESS,
  EDITIONS_INITIAL_LOAD_FAILURE,
  GET_ALL_EDITIONS_INIT,
  GET_ALL_EDITIONS_SUCCESS,
  GET_ALL_EDITIONS_FAILURE,
  ADD_EDITION_SUCCESS,
  ADD_EDITION_FAILURE,
  EDIT_EDITION_SUCCESS,
  EDIT_EDITION_FAILURE,
  DELETE_EDITION_SUCCESS,
  DELETE_EDITION_FAILURE,
  EDITIONS_SHOW_ADD_MODAL,
  EDITIONS_HIDE_ADD_MODAL,
  EDITIONS_SHOW_EDIT_MODAL,
  EDITIONS_HIDE_EDIT_MODAL,
  EDITIONS_SHOW_DELETE_MODAL,
  EDITIONS_HIDE_DELETE_MODAL,
  EDITIONS_FILTER_INIT,
  EDITIONS_FILTER_SUCCESS,
  EDITIONS_FILTER_FAILURE,
} from "./actionTypes.js";

const initialState = {
  editions: [],
  products: [],
  errors: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EDITIONS_INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        editions: [...action.payload.availableEditions],
        products: [...action.payload.availableProducts],
      };
    case EDITIONS_INITIAL_LOAD_INIT:
    case GET_ALL_EDITIONS_INIT:
    case EDITIONS_FILTER_INIT:
      return {
        ...state,
        loading: true,
      };
    case EDITIONS_FILTER_SUCCESS:
      return {
        ...state,
        loading: false,
        editions: [...action.payload.filteredEditions],
      };
    case GET_ALL_EDITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        editions: [...action.payload],
      };
    case ADD_EDITION_SUCCESS:
    case EDITIONS_SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: true,
        errors: {},
      };
    case EDITIONS_HIDE_ADD_MODAL:
      return {
        ...state,
        showAddModal: false,
        errors: {},
      };
    case EDIT_EDITION_SUCCESS:
    case EDITIONS_SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: true,
        errors: {},
      };
    case EDITIONS_HIDE_EDIT_MODAL:
      return {
        ...state,
        showEditModal: false,
        errors: {},
      };
    case DELETE_EDITION_SUCCESS:
    case EDITIONS_SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: true,
        errors: {},
      };
    case EDITIONS_HIDE_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: false,
        errors: {},
      };
    case EDITIONS_INITIAL_LOAD_FAILURE:
    case GET_ALL_EDITIONS_FAILURE:
    case ADD_EDITION_FAILURE:
    case EDIT_EDITION_FAILURE:
    case DELETE_EDITION_FAILURE:
    case EDITIONS_FILTER_FAILURE:
      return { ...state, errors: { ...action.errors } };
    default:
      return state;
  }
}

const getEditionsReducer = state => state.editions;

export const getEditions = createSelector(
  getEditionsReducer,
  editionReducer => editionReducer.editions
);
export const getProducts = createSelector(
  getEditionsReducer,
  editionReducer => editionReducer.products
);

export const getLoading = createSelector(
  getEditionsReducer,
  editionReducer => editionReducer.loading
);

export const getErrors = createSelector(
  getEditionsReducer,
  editionReducer => editionReducer.errors
);

export const getShowAddModal = createSelector(
  getEditionsReducer,
  editionReducer => editionReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getEditionsReducer,
  editionReducer => editionReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getEditionsReducer,
  editionReducer => editionReducer.showDeleteModal
);
