import { put, all, takeLatest, call } from "redux-saga/effects";
import { push } from "connected-react-router";
import { toast } from "react-toastify";

import loginService from "./service";
import {
  LOGIN_INIT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_INIT,
  LOGOUT_SUCCESS,
  FORGOT_PASSWORD_INIT,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  GET_ALL_API_DATA_INIT,
  CONFIRM_USER_INIT,
  CONFIRM_USER_SUCCESS,
  CONFIRM_USER_FAILURE,
  RESET_PASSWORD_INIT,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from "./actionTypes";

import loginUtils from "./utils";

export function* loginFlow({ payload }) {
  try {
    const loginPayload = yield call(loginService.login, payload);
    console.log(loginPayload);
    yield call(loginUtils.setLocalStorage, loginPayload);
    yield put({ type: LOGIN_SUCCESS, payload: loginPayload.user });
    yield put({ type: GET_ALL_API_DATA_INIT });
    yield put(push("/"));
  } catch (err) {
    yield put({ type: LOGIN_FAILURE, error: "Usuario / Contraseña inválidos" });
  }
}

export function* logoutFlow() {
  const localStorageClear = localStorage.clear();
  const reload = window.location.reload();
  yield call(reload);
  yield call(localStorageClear);
  yield put({ type: LOGOUT_SUCCESS });
}

export function* forgotPasswordFlow({ payload }) {
  try {
    const forgotPasswordPayload = yield call(
      loginService.forgotPassword,
      payload
    );
    yield call(toast.success, `Se ha enviado un email a ${payload.username}`);
    yield put({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: forgotPasswordPayload,
    });
  } catch (err) {
    yield put({
      type: FORGOT_PASSWORD_FAILURE,
      error: "Error",
    });
  }
}

export function* confirmUser({ payload }) {
  try {
    const confirmUserPayload = yield call(loginService.confirmUser, payload);
    yield put({
      type: CONFIRM_USER_SUCCESS,
      payload: confirmUserPayload,
    });
  } catch (err) {
    yield put({
      type: CONFIRM_USER_FAILURE,
      error: "Error",
    });
  }
}

export function* resetPassword({ payload }) {
  try {
    console.log(payload);
    const resetPasswordPayload = yield call(
      loginService.resetPassword,
      payload
    );
    yield call(toast.success, `La contraseña fue cambiada con exito!`);

    yield put({
      type: RESET_PASSWORD_SUCCESS,
      payload: resetPasswordPayload,
    });
  } catch (err) {
    yield call(toast.error, `Hubo un error :(`);
    yield put({
      type: RESET_PASSWORD_FAILURE,
      error: "Error",
    });
  }
}

export default function* rootLoginSaga() {
  yield all([
    takeLatest(LOGIN_INIT, loginFlow),
    takeLatest(LOGOUT_INIT, logoutFlow),
    takeLatest(FORGOT_PASSWORD_INIT, forgotPasswordFlow),
    takeLatest(CONFIRM_USER_INIT, confirmUser),
    takeLatest(RESET_PASSWORD_INIT, resetPassword),
  ]);
}
