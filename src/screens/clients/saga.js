import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  SEARCH_CLIENTS_INIT,
  SEARCH_CLIENTS_SUCCESS,
  SEARCH_CLIENTS_FAILURE,
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  GET_TAXES_INIT,
  GET_TAXES_SUCCESS,
  GET_TAXES_FAILURE,
  FILTER_CLIENTS_INIT,
  FILTER_CLIENTS_SUCCESS,
  FILTER_CLIENTS_FAILURE,
  ADD_CLIENT_INIT,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_FAILURE,
  EDIT_CLIENT_INIT,
  EDIT_CLIENT_SUCCESS,
  EDIT_CLIENT_FAILURE,
  GET_LOCATION_DATA_INIT,
  GET_LOCATION_DATA_SUCCESS,
  GET_LOCATION_DATA_FAILURE,
  GET_ALL_COUNTRIES_INIT,
  GET_ALL_COUNTRIES_SUCCESS,
  GET_ALL_COUNTRIES_FAILURE,
  GET_ALL_STATES_INIT,
  GET_ALL_STATES_SUCCESS,
  GET_ALL_STATES_FAILURE,
  GET_ALL_DISTRICTS_INIT,
  GET_ALL_DISTRICTS_SUCCESS,
  GET_ALL_DISTRICTS_FAILURE,
  GET_ALL_CITIES_INIT,
  GET_ALL_CITIES_SUCCESS,
  GET_ALL_CITIES_FAILURE,
  DELETE_CLIENT_INIT,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAILURE,
  GET_ALL_TAX_CATEGORIES_INIT,
  GET_ALL_TAX_CATEGORIES_SUCCESS,
  GET_ALL_TAX_CATEGORIES_FAILURE,
} from "./actionTypes.js";

import clientsService from "./service";
import usersService from "../users/service";

export function* initialLoad() {
  try {
    const [availableUsers, availableTaxes, availableTaxCategories] = yield all([
      call(usersService.getUsers),
      call(clientsService.getAllTaxes),
      call(clientsService.getAllTaxCtegories),
    ]);
    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        availableUsers,
        availableTaxes,
        availableTaxCategories,
      },
    });
    yield put({
      type: GET_ALL_COUNTRIES_INIT,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: INITIAL_LOAD_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* searchClients() {
  try {
    const clientsPayload = yield call(clientsService.getAllClients);
    yield put({
      type: SEARCH_CLIENTS_SUCCESS,
      payload: {
        availableClients: [...clientsPayload],
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: SEARCH_CLIENTS_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* getTaxes({ payload }) {
  try {
    const taxesPayload = yield call(clientsService.getTaxes, payload);
    yield put({
      type: GET_TAXES_SUCCESS,
      payload: {
        availableTaxes: { ...taxesPayload },
      },
    });
  } catch (err) {
    yield put({
      type: GET_TAXES_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* filterClients({ payload }) {
  let filterPayload;
  try {
    filterPayload = yield call(clientsService.filterClients, payload);
    yield put({
      type: FILTER_CLIENTS_SUCCESS,
      payload: {
        availableClients: [...filterPayload],
      },
    });
  } catch (err) {
    console.log(err);
    console.log(filterPayload);
    yield put({
      type: FILTER_CLIENTS_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* addClient({ payload }) {
  try {
    const addClientPayload = yield call(clientsService.addClient, payload);
    yield all([
      put({ type: ADD_CLIENT_SUCCESS, payload: addClientPayload }),
      call(toast.success, "Cliente creado con éxito!"),
      put({ type: FILTER_CLIENTS_INIT, payload: payload.params || {} }),
    ]);
  } catch (err) {
    const auxError = {
      ...err.response.data.errors,
      brandName:
        err.response.data.errors.brandName &&
        err.response.data.errors.brandName[0].includes("Unicidad")
          ? "La marca ya se encuentra en uso"
          : err.response.data.errors.brandName,
      legalName:
        err.response.data.errors.legalName &&
        err.response.data.errors.legalName[0].includes("Unicidad")
          ? "La razón social ya se encuentra en uso"
          : err.response.data.errors.legalName,
    };
    console.log(auxError);
    yield put({
      type: ADD_CLIENT_FAILURE,
      errors: auxError,
    });
    if (!auxError) {
      yield call(toast.error, "Hubo un error");
    }
  }
}

export function* editClient({ payload }) {
  try {
    const editClientPayload = yield call(clientsService.editClient, payload);
    yield all([
      put({ type: EDIT_CLIENT_SUCCESS, payload: editClientPayload }),
      call(toast.success, "Cliente editado con éxito!"),
      put({ type: FILTER_CLIENTS_INIT, payload: payload.params || {} }),
    ]);
  } catch (err) {
    console.log(err);
    yield put({
      type: EDIT_CLIENT_FAILURE,
      errors: { ...err.response.data.errors },
    });
    if (!err.response.data.errors) {
      yield call(toast.error, "Hubo un error");
    }
  }
}

export function* locationData({ payload }) {
  try {
    const [
      countriesPayload,
      statesPayload,
      districtsPayload,
      citiesPayload,
    ] = yield all([
      call(clientsService.getAllCountries),
      call(clientsService.getAllStates, payload.countryId),
      call(clientsService.getAllDistricts, payload.stateId),
      call(clientsService.getAllCities, payload.districtId),
    ]);
    yield put({
      type: GET_LOCATION_DATA_SUCCESS,
      payload: {
        countriesPayload,
        statesPayload,
        districtsPayload,
        citiesPayload,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GET_LOCATION_DATA_FAILURE,
      errors: { ...err.response.data.errors },
    });
    yield call(
      toast.error,
      "Hubo un error al obtener los datos de paises. Por favor recargue la página e intente nuevamente"
    );
  }
}

export function* getAllCountries() {
  try {
    const countriesPayload = yield call(clientsService.getAllCountries);
    yield put({
      type: GET_ALL_COUNTRIES_SUCCESS,
      payload: [...countriesPayload],
    });
  } catch (err) {
    yield put({
      type: GET_ALL_COUNTRIES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getAllStates({ payload }) {
  try {
    const statesPayload = yield call(clientsService.getAllStates, payload);
    yield put({
      type: GET_ALL_STATES_SUCCESS,
      payload: [...statesPayload],
    });
  } catch (err) {
    yield put({
      type: GET_ALL_STATES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getAllDistricts({ payload }) {
  try {
    const districtsPayload = yield call(
      clientsService.getAllDistricts,
      payload
    );
    yield put({
      type: GET_ALL_DISTRICTS_SUCCESS,
      payload: [...districtsPayload],
    });
  } catch (err) {
    yield put({
      type: GET_ALL_DISTRICTS_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getAllCities({ payload }) {
  try {
    const citiesPayload = yield call(clientsService.getAllCities, payload);
    yield put({
      type: GET_ALL_CITIES_SUCCESS,
      payload: [...citiesPayload],
    });
  } catch (err) {
    yield put({
      type: GET_ALL_CITIES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* deleteClient({ payload }) {
  try {
    const deletePayload = yield call(clientsService.deleteClient, payload);
    yield all([
      put({ type: DELETE_CLIENT_SUCCESS, payload: deletePayload }),
      call(toast.success, "Cliente borrado con éxito!"),
      put({ type: FILTER_CLIENTS_INIT, payload: payload.params }),
    ]);
  } catch (err) {
    yield put({
      type: DELETE_CLIENT_FAILURE,
      error: err.response.data.message,
    });
    yield call(toast.error, "Hubo un error");
  }
}

export function* getAllTaxCategories({ payload }) {
  try {
    const taxCategoriesPayload = yield call(
      clientsService.getAllTaxCategories,
      payload
    );
    yield put({
      type: GET_ALL_TAX_CATEGORIES_SUCCESS,
      payload: [...taxCategoriesPayload],
    });
  } catch (err) {
    yield put({
      type: GET_ALL_TAX_CATEGORIES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export default function* rootClientsSaga() {
  yield all([
    takeLatest(SEARCH_CLIENTS_INIT, searchClients),
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GET_TAXES_INIT, getTaxes),
    takeLatest(FILTER_CLIENTS_INIT, filterClients),
    takeLatest(ADD_CLIENT_INIT, addClient),
    takeLatest(EDIT_CLIENT_INIT, editClient),
    takeLatest(GET_LOCATION_DATA_INIT, locationData),
    takeLatest(GET_ALL_COUNTRIES_INIT, getAllCountries),
    takeLatest(GET_ALL_STATES_INIT, getAllStates),
    takeLatest(GET_ALL_DISTRICTS_INIT, getAllDistricts),
    takeLatest(GET_ALL_CITIES_INIT, getAllCities),
    takeLatest(DELETE_CLIENT_INIT, deleteClient),
    takeLatest(GET_ALL_TAX_CATEGORIES_INIT, getAllTaxCategories),
  ]);
}
