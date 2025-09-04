import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  GETCURRENCIES_INIT,
  GETCURRENCIES_SUCCESS,
  GETCURRENCIES_FAILURE,
  ADDCURRENCY_INIT,
  ADDCURRENCY_SUCCESS,
  ADDCURRENCY_FAILURE,
  EDITCURRENCY_INIT,
  EDITCURRENCY_SUCCESS,
  EDITCURRENCY_FAILURE,
  DELETECURRENCY_INIT,
  DELETECURRENCY_SUCCESS,
  DELETECURRENCY_FAILURE,
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
} from "./actionTypes";

import currencyService from "./service";
import contractsService from "../contracts/service";

export function* initialLoad() {
  try {
    const [availableCountries, availableCurrencies] = yield all([
      call(contractsService.getCountriesOptions),
      call(currencyService.getAllCurrencies),
    ]);
    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        availableCountries,
        availableCurrencies,
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

export function* getCurrencies() {
  try {
    const currenciesPayload = yield call(currencyService.getAllCurrencies);
    yield put({
      type: GETCURRENCIES_SUCCESS,
      payload: currenciesPayload,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GETCURRENCIES_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* addCurrency({ payload }) {
  try {
    const addCurrencyPayload = yield call(currencyService.addCurrency, payload);
    yield all([
      put({ type: ADDCURRENCY_SUCCESS, payload: addCurrencyPayload }),
      call(toast.success, "Moneda creada con éxito!"),
      put({ type: GETCURRENCIES_INIT, payload: {} }),
    ]);
  } catch (err) {
    yield put({
      type: ADDCURRENCY_FAILURE,
      errors: { ...err.response.data.errors },
    });
    yield call(toast.error, "Hubo un error");
  }
}

export function* editCurrency({ payload }) {
  try {
    const editCurrencyPayload = yield call(
      currencyService.editCurrency,
      payload
    );
    yield all([
      put({ type: EDITCURRENCY_SUCCESS, payload: editCurrencyPayload }),
      call(toast.success, "Moneda editada con éxito!"),
      put({ type: GETCURRENCIES_INIT, payload: {} }),
    ]);
  } catch (err) {
    console.log(err);
    yield put({
      type: EDITCURRENCY_FAILURE,
      errors: { ...err.response.data.errors },
    });
    yield call(toast.error, "Hubo un error");
  }
}

export function* deleteCurrency({ payload }) {
  try {
    const deletePayload = yield call(currencyService.deleteCurrency, payload);
    yield all([
      put({ type: DELETECURRENCY_SUCCESS, payload: deletePayload }),
      call(toast.success, "Moneda borrada con éxito!"),
      put({ type: GETCURRENCIES_INIT, payload: {} }),
    ]);
  } catch (err) {
    yield put({
      type: DELETECURRENCY_FAILURE,
      error: err.response.data.message,
    });
    yield call(toast.error, "Hubo un error");
  }
}

export default function* rootCurrencySaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GETCURRENCIES_INIT, getCurrencies),
    takeLatest(ADDCURRENCY_INIT, addCurrency),
    takeLatest(EDITCURRENCY_INIT, editCurrency),
    takeLatest(DELETECURRENCY_INIT, deleteCurrency),
  ]);
}
