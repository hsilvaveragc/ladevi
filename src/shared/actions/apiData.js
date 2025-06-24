import {
  GET_ALL_API_DATA_INIT,
  GET_ALL_STATES_INIT,
  GET_ALL_DISTRICTS_INIT,
  GET_ALL_APP_ROLES_INIT,
  GET_ALL_CITIES_INIT,
} from "./types";

export const getAllApiData = () => ({
  type: GET_ALL_API_DATA_INIT,
});

export const getAllStatesByID = payload => ({
  type: GET_ALL_STATES_INIT,
  payload,
});

export const getAllDistrictsByID = payload => ({
  type: GET_ALL_DISTRICTS_INIT,
  payload,
});

export const getAllCitiesByID = payload => ({
  type: GET_ALL_CITIES_INIT,
  payload,
});

export const getAllAppRoles = () => ({
  type: GET_ALL_APP_ROLES_INIT,
});
