import { put, all, takeLatest, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import { appDataService } from 'shared/services';

import {
  USERS_INITIAL_LOAD_INIT,
  USERS_INITIAL_LOAD_SUCCESS,
  USERS_INITIAL_LOAD_FAILURE,
  GET_ALL_USERS_INIT,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  EDIT_USER_INIT,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  ADD_USER_INIT,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
  DELETE_USER_INIT,
  DELETE_USER_SUCCESS,
  FILTER_USERS_INIT,
  FILTER_USERS_SUCCESS,
  FILTER_USERS_FAILURE,
  //DELETE_USER_FAILURE, //TODO
} from './actionTypes';
import usersService from './service';

export function* initialLoad() {
  try {
    const [availableUsers, availableCountries, availableAppRoles] = yield all([
      call(usersService.getUsers),
      call(appDataService.fetchCountries),
      call(appDataService.fetchAppRoles),
    ]);
    yield put({
      type: USERS_INITIAL_LOAD_SUCCESS,
      payload: {
        availableUsers,
        availableCountries,
        availableAppRoles,
      },
    });
  } catch (err) {
    yield all([
      put({
        type: USERS_INITIAL_LOAD_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* getUsers() {
  try {
    const usersPayload = yield call(usersService.getUsers);
    yield put({ type: GET_ALL_USERS_SUCCESS, payload: usersPayload });
  } catch (err) {
    yield all([
      put({
        type: GET_ALL_USERS_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* filterUsers({ payload }) {
  try {
    const usersPayload = yield call(usersService.filterUsers, payload);
    yield put({ type: FILTER_USERS_SUCCESS, payload: usersPayload });
  } catch (err) {
    yield all([
      put({
        type: FILTER_USERS_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* addUser({ payload }) {
  try {
    const usersPayload = yield call(usersService.addUser, payload);
    yield all([
      put({ type: ADD_USER_SUCCESS, payload: usersPayload }),
      call(toast.success, 'Usuario creado con éxito!'),
      put({ type: FILTER_USERS_INIT, payload: payload.params || {} }),
    ]);
  } catch (err) {
    yield all([
      put({
        type: ADD_USER_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* editUser({ payload }) {
  try {
    const usersPayload = yield call(usersService.editUser, payload);
    yield all([
      put({ type: EDIT_USER_SUCCESS, payload: usersPayload }),
      call(toast.success, 'Usuario editado con éxito!'),
      put({ type: FILTER_USERS_INIT, payload: payload.params || {} }),
    ]);
  } catch (err) {
    yield all([
      put({
        type: EDIT_USER_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* deleteUser({ payload }) {
  try {
    const usersPayload = yield call(usersService.deleteUser, payload);
    yield all([
      put({ type: DELETE_USER_SUCCESS, payload: usersPayload }),
      call(toast.success, 'Usuario eliminado con éxito!'),
      put({ type: GET_ALL_USERS_INIT }),
    ]);
  } catch (err) {
    yield put({ type: DELETE_USER_SUCCESS, error: err.response.data.message });
    yield call(toast.success, 'Usuario eliminado con éxito!');
    yield put({ type: GET_ALL_USERS_INIT });
  }
}

export default function* rootUsersSaga() {
  yield all([
    takeLatest(USERS_INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GET_ALL_USERS_INIT, getUsers),
    takeLatest(ADD_USER_INIT, addUser),
    takeLatest(EDIT_USER_INIT, editUser),
    takeLatest(DELETE_USER_INIT, deleteUser),
    takeLatest(FILTER_USERS_INIT, filterUsers),
  ]);
}
