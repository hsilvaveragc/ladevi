import { createSelector } from 'reselect';

import {
  SET_LOGGED_USER,
  FETCH_APP_ROLES_INIT,
  FETCH_APP_ROLES_SUCCESS,
  FETCH_APP_ROLES_FAILURE,
  FETCH_COUNTRIES_INIT,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAILURE,
  FETCH_STATES_INIT,
  FETCH_STATES_SUCCESS,
  FETCH_STATES_FAILURE,
  FETCH_DISTRICTS_INIT,
  FETCH_DISTRICTS_SUCCESS,
  FETCH_DISTRICTS_FAILURE,
} from './actionTypes';

const initialState = {
  loggedUser: {},
  appRoles: [],
  countries: [],
  statesGroupedByCountry: [],
  districtsGroupedByState: [],
  error: '',
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOGGED_USER:
      return { ...state, loggedUser: action.payload };
    case FETCH_APP_ROLES_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_APP_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        appRoles: [...action.payload],
      };
    case FETCH_COUNTRIES_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_COUNTRIES_SUCCESS:
      return {
        ...state,
        loading: false,
        countries: [...action.payload],
      };
    case FETCH_STATES_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_STATES_SUCCESS:
      return {
        ...state,
        loading: false,
        statesGroupedByCountry: [...action.payload],
      };
    case FETCH_DISTRICTS_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DISTRICTS_SUCCESS:
      return {
        ...state,
        loading: false,
        districtsGroupedByState: [...action.payload],
      };
    case FETCH_APP_ROLES_FAILURE:
    case FETCH_COUNTRIES_FAILURE:
    case FETCH_STATES_FAILURE:
    case FETCH_DISTRICTS_FAILURE:
      return { ...initialState, error: action.error };

    default:
      return state;
  }
}

const getAppDataReducer = (state) => state.appData;

export const loggedUserSelector = createSelector(
  getAppDataReducer,
  (appDataReducer) => appDataReducer.loggedUser
);

export const appRolesSelector = createSelector(
  getAppDataReducer,
  (appDataReducer) => appDataReducer.appRoles
);

export const countriesSelector = createSelector(
  getAppDataReducer,
  (appDataReducer) => appDataReducer.countries
);

export const statesGroupedByCountrySelector = createSelector(
  getAppDataReducer,
  (appDataReducer) => appDataReducer.statesGroupedByCountry
);

export const districtsGroupedByStateSelector = createSelector(
  getAppDataReducer,
  (appDataReducer) => appDataReducer.districtsGroupedByState
);
