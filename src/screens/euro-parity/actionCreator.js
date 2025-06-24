import {
  INITIAL_LOAD_INIT,
  GETEUROPARITIES_INIT,
  ADDEUROPARITY_INIT,
  DELETEEUROPARITY_INIT,
  SHOW_ADD_MODAL,
  SHOW_DELETE_MODAL,
} from "./actionTypes";

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const getEuroParitiesInit = () => ({
  type: GETEUROPARITIES_INIT,
});

export const addEuroParity = payload => ({
  type: ADDEUROPARITY_INIT,
  payload,
});

export const deleteEuroParity = payload => ({
  type: DELETEEUROPARITY_INIT,
  payload,
});

export const showAddModal = payload => ({
  type: SHOW_ADD_MODAL,
});

export const showDeleteModal = payload => ({
  type: SHOW_DELETE_MODAL,
});
