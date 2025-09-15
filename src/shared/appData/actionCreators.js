import {
  SET_LOGGED_USER,
  FETCH_APP_ROLES_INIT,
  FETCH_COUNTRIES_INIT,
  FETCH_STATES_INIT,
  FETCH_DISTRICTS_INIT,
  FETCH_CITIES_INIT,
} from "./actionTypes";

export const setLoggedUser = payload => ({
  type: SET_LOGGED_USER,
  payload,
});

export const fetchAppRoles = () => ({
  type: FETCH_APP_ROLES_INIT,
});

export const fetchCountries = () => ({
  type: FETCH_COUNTRIES_INIT,
});

export const fetchStates = () => ({
  type: FETCH_STATES_INIT,
});

export const fetchDistricts = payload => ({
  type: FETCH_DISTRICTS_INIT,
  payload,
});

export const fetchCitiesById = payload => ({
  type: FETCH_CITIES_INIT,
  payload,
});
