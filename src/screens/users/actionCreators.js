import {
  USERS_INITIAL_LOAD_INIT,
  GET_ALL_USERS_INIT,
  ADD_USER_INIT,
  EDIT_USER_INIT,
  DELETE_USER_INIT,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  FILTER_USERS_INIT,
} from "./actionTypes";

export const initialLoad = () => ({
  type: USERS_INITIAL_LOAD_INIT,
});

export const getUsersInit = () => ({
  type: GET_ALL_USERS_INIT,
});

export const filterUsers = payload => ({
  type: FILTER_USERS_INIT,
  payload,
});

export const addUserInit = payload => ({
  type: ADD_USER_INIT,
  payload,
});

export const editUserInit = payload => ({
  type: EDIT_USER_INIT,
  payload,
});

export const deleteUserInit = payload => ({
  type: DELETE_USER_INIT,
  payload,
});

export const showAddModal = payload => ({
  type: SHOW_ADD_MODAL,
});

export const showEditModal = payload => ({
  type: SHOW_EDIT_MODAL,
});

export const showDeleteModal = payload => ({
  type: SHOW_DELETE_MODAL,
});
