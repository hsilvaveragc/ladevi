import {
  GET_ALL_EDITIONS_INIT,
  ADD_EDITION_INIT,
  EDIT_EDITION_INIT,
  DELETE_EDITION_INIT,
  EDITIONS_SHOW_ADD_MODAL,
  EDITIONS_HIDE_ADD_MODAL,
  EDITIONS_SHOW_EDIT_MODAL,
  EDITIONS_HIDE_EDIT_MODAL,
  EDITIONS_SHOW_DELETE_MODAL,
  EDITIONS_HIDE_DELETE_MODAL,
  EDITIONS_INITIAL_LOAD_INIT,
  EDITIONS_FILTER_INIT,
  IMPORT_EDITIONS_INIT,
  IMPORT_EDITIONS_FAILURE,
} from "./actionTypes";

export const initialLoad = () => ({
  type: EDITIONS_INITIAL_LOAD_INIT,
});

export const getAllEditions = () => ({
  type: GET_ALL_EDITIONS_INIT,
});

export const addEdition = payload => ({
  type: ADD_EDITION_INIT,
  payload,
});

export const editEdition = payload => ({
  type: EDIT_EDITION_INIT,
  payload,
});

export const deleteEdition = payload => ({
  type: DELETE_EDITION_INIT,
  payload,
});

export const showEditionsAddModal = () => ({
  type: EDITIONS_SHOW_ADD_MODAL,
});

export const hideEditionsAddModal = () => ({
  type: EDITIONS_HIDE_ADD_MODAL,
});

export const showEditionsEditModal = () => ({
  type: EDITIONS_SHOW_EDIT_MODAL,
});

export const hideEditionsEditModal = () => ({
  type: EDITIONS_HIDE_EDIT_MODAL,
});

export const showEditionsDeleteModal = () => ({
  type: EDITIONS_SHOW_DELETE_MODAL,
});

export const hideEditionsDeleteModal = () => ({
  type: EDITIONS_HIDE_DELETE_MODAL,
});

export const editionsFilterBy = payload => ({
  type: EDITIONS_FILTER_INIT,
  payload,
});

export const importEditions = payload => ({
  type: IMPORT_EDITIONS_INIT,
  payload,
});

export const importEditionsFailure = payload => ({
  type: IMPORT_EDITIONS_FAILURE,
  payload,
});
