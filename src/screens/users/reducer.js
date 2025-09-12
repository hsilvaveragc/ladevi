import { createSelector } from "reselect";
import {
  USERS_INITIAL_LOAD_INIT,
  USERS_INITIAL_LOAD_SUCCESS,
  USERS_INITIAL_LOAD_FAILURE,
  GET_ALL_USERS_INIT,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  FILTER_USERS_INIT,
  FILTER_USERS_SUCCESS,
  FILTER_USERS_FAILURE,
} from "./actionTypes";

const initialState = {
  users: [],
  countries: [],
  appRoles: [],
  errors: {},
  loading: false,
  showEditModal: false,
  showDeleteModal: false,
  showAddModal: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USERS_INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...action.payload.availableUsers],
        countries: [...action.payload.availableCountries],
        appRoles: [...action.payload.availableAppRoles],
      };
    case USERS_INITIAL_LOAD_INIT:
    case FILTER_USERS_INIT:
    case GET_ALL_USERS_INIT:
      return {
        ...state,
        loading: true,
      };
    case FILTER_USERS_SUCCESS:
    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...action.payload],
        errors: {},
      };
    case SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        errors: {},
      };
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
      };
    case ADD_USER_SUCCESS:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        errors: {},
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
      };
    case USERS_INITIAL_LOAD_FAILURE:
    case DELETE_USER_FAILURE:
    case GET_ALL_USERS_FAILURE:
    case ADD_USER_FAILURE:
    case EDIT_USER_FAILURE:
    case FILTER_USERS_FAILURE:
      return { ...state, errors: { ...action.errors } };
    default:
      return state;
  }
}

const getUsersReducer = state => state.users;

export const getUsers = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.users
);

export const getAppRoles = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.appRoles
);

export const getCountries = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.countries
);

export const getLoading = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.loading
);

export const getErrors = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.errors
);

export const getShowAddModal = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getUsersReducer,
  usersReducer => usersReducer.showDeleteModal
);
