import { put, all, takeLatest, call } from "redux-saga/effects";
import {
  GET_ALL_API_DATA_INIT,
  GET_ALL_APP_ROLES_INIT,
  GET_ALL_APP_ROLES_SUCCESS,
  GET_ALL_APP_ROLES_FAILURE,
} from "../actions/types";
import { appDataService } from "../services";

export function* getInitialLoad() {
  try {
    yield put({
      type: GET_ALL_APP_ROLES_INIT,
    });
  } catch (err) {}
}

export function* getAllAppRoles() {
  try {
    const appRolesPayload = yield call(appDataService.getAllAppRoles);
    yield put({
      type: GET_ALL_APP_ROLES_SUCCESS,
      payload: [...appRolesPayload],
    });
  } catch (err) {
    yield put({
      type: GET_ALL_APP_ROLES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export default function* rootUsersSaga() {
  yield all([
    takeLatest(GET_ALL_API_DATA_INIT, getInitialLoad),
    takeLatest(GET_ALL_APP_ROLES_INIT, getAllAppRoles),
  ]);
}
