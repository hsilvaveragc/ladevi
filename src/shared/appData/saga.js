import { put, all, takeLatest, call } from 'redux-saga/effects';

import { appDataService } from '../services';

import {
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

export function* fetchAppRoles() {
  try {
    const appRolesPayload = yield call(appDataService.fetchOptionsAppRoles);
    yield put({
      type: FETCH_APP_ROLES_SUCCESS,
      payload: [...appRolesPayload],
    });
  } catch (err) {
    yield put({
      type: FETCH_APP_ROLES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* fetchCountries() {
  try {
    const countriesPayload = yield call(appDataService.fetchCountries);
    yield put({
      type: FETCH_COUNTRIES_SUCCESS,
      payload: [...countriesPayload],
    });
  } catch (err) {
    yield put({
      type: FETCH_COUNTRIES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* fetchStates() {
  try {
    const statesPayload = yield call(
      appDataService.getAllStatesGroupedByCountry
    );
    yield put({
      type: FETCH_STATES_SUCCESS,
      payload: [...statesPayload],
    });
  } catch (err) {
    yield put({
      type: FETCH_STATES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* fetchDistricts() {
  try {
    const districtsPayload = yield call(
      appDataService.getAllDistrictsGroupedByState
    );
    yield put({
      type: FETCH_DISTRICTS_SUCCESS,
      payload: [...districtsPayload],
    });
  } catch (err) {
    yield put({
      type: FETCH_DISTRICTS_FAILURE,
      error: err.response.data.message,
    });
  }
}

export default function* rootAppDataSaga() {
  yield all([
    takeLatest(FETCH_APP_ROLES_INIT, fetchAppRoles),
    takeLatest(FETCH_COUNTRIES_INIT, fetchCountries),
    takeLatest(FETCH_STATES_INIT, fetchStates),
    takeLatest(FETCH_DISTRICTS_INIT, fetchDistricts),
  ]);
}
