import { createSelector } from "reselect";
import {
  GET_ALL_APP_ROLES_INIT,
  GET_ALL_APP_ROLES_SUCCESS,
  GET_ALL_APP_ROLES_FAILURE,
} from "../actions/types";

const initialState = {
  appRoles: [],
  error: "",
  loading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_APP_ROLES_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_APP_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        appRoles: [...action.payload],
      };
    case GET_ALL_APP_ROLES_FAILURE:
      return { ...initialState, error: action.error };
    default:
      return state;
  }
}

const getAppDataReducer = state => state.appData;
const getUserReducer = state => state.login;

export const getAllAppRoles = createSelector(
  getAppDataReducer,
  appDataReducer => appDataReducer.appRoles
);

export const getUserLogueado = createSelector(
  getUserReducer,
  userReducer => userReducer.userLogueado
);
