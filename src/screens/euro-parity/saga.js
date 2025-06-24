import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  GETEUROPARITIES_INIT,
  GETEUROPARITIES_SUCCESS,
  GETEUROPARITIES_FAILURE,
  ADDEUROPARITY_INIT,
  ADDEUROPARITY_SUCCESS,
  ADDEUROPARITY_FAILURE,
  DELETEEUROPARITY_INIT,
  DELETEEUROPARITY_SUCCESS,
  DELETEEUROPARITY_FAILURE,
} from "./actionTypes";

import euroParityService from "./service";

export function* initialLoad() {
  try {
    const [availableEuroParities] = yield all([
      call(euroParityService.getAllEuroParities),
    ]);
    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        availableEuroParities,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: INITIAL_LOAD_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}
export function* getEuroParities() {
  try {
    const euroParitiesPayload = yield call(
      euroParityService.getAllEuroParities
    );
    yield put({
      type: GETEUROPARITIES_SUCCESS,
      payload: euroParitiesPayload,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GETEUROPARITIES_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* addEuroParity({ payload }) {
  try {
    // Asegúrate de que euroParityService.addEuroParity devuelve una Promise
    const addEuroParityPayload = yield call(
      [euroParityService, euroParityService.addEuroParity],
      payload
    );

    // Espera a que todas estas acciones se completen antes de continuar
    yield all([
      put({ type: ADDEUROPARITY_SUCCESS, payload: addEuroParityPayload }),
      call(toast.success, "Paridad Euro creada con éxito!"),
    ]);

    // Después de que se complete el success, iniciamos la nueva obtención de datos
    yield put({ type: GETEUROPARITIES_INIT, payload: {} });
  } catch (err) {
    yield put({
      type: ADDEUROPARITY_FAILURE,
      errors: { ...err.response.data.errors },
    });
    yield call(toast.error, "Hubo un error");
  }
}

export function* deleteEuroParity({ payload }) {
  try {
    const deletePayload = yield call(
      euroParityService.deleteEuroParity,
      payload
    );
    yield all([
      put({ type: DELETEEUROPARITY_SUCCESS, payload: deletePayload }),
      call(toast.success, "Paridad Euro borrada con éxito!"),
      put({ type: GETEUROPARITIES_INIT, payload: {} }),
    ]);
  } catch (err) {
    yield put({
      type: DELETEEUROPARITY_FAILURE,
      error: err.response.data.message,
    });
    yield call(toast.error, "Hubo un error");
  }
}

export default function* rootEuroParitySaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GETEUROPARITIES_INIT, getEuroParities),
    takeLatest(ADDEUROPARITY_INIT, addEuroParity),
    takeLatest(DELETEEUROPARITY_INIT, deleteEuroParity),
  ]);
}
