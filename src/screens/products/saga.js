import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  GET_ALL_PRODUCTS_INIT,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_ALL_PRODUCTS_FAILURE,
  GET_ALL_PRODUCT_TYPES_INIT,
  GET_ALL_PRODUCT_TYPES_SUCCESS,
  GET_ALL_PRODUCT_TYPES_FAILURE,
  ADD_PRODUCT_INIT,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAILURE,
  PRODUCTS_INITIAL_LOAD_INIT,
  PRODUCTS_INITIAL_LOAD_SUCCESS,
  PRODUCTS_INITIAL_LOAD_FAILURE,
  EDIT_PRODUCT_INIT,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  DELETE_PRODUCT_INIT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  FILTER_PRODUCTS_INIT,
  FILTER_PRODUCTS_SUCCESS,
  FILTER_PRODUCTS_FAILURE,
} from "./actionTypes.js";

import productsService from "./service";
import { appDataService } from "../../shared/services";

export function* initialLoad() {
  try {
    const [
      products,
      productTypes,
      adsSpaceLocationType,
      availableCountries,
    ] = yield all([
      call(productsService.getAllProducts),
      call(productsService.getAllProductTypes),
      call(productsService.getAllAdvertisingSpaceLocationType),
      call(appDataService.getAllCountries),
    ]);

    yield put({
      type: PRODUCTS_INITIAL_LOAD_SUCCESS,
      payload: {
        products,
        productTypes,
        adsSpaceLocationType,
        availableCountries,
      },
    });
  } catch (err) {
    yield all([
      put({
        type: PRODUCTS_INITIAL_LOAD_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* getAllProducts() {
  try {
    const productsPayload = yield call(productsService.getAllProducts);
    yield put({
      type: GET_ALL_PRODUCTS_SUCCESS,
      payload: [...productsPayload],
    });
  } catch (err) {
    yield all([
      put({
        type: GET_ALL_PRODUCTS_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* filterProducts({ payload }) {
  try {
    const productsPayload = yield call(productsService.filterProducts, payload);
    yield put({
      type: FILTER_PRODUCTS_SUCCESS,
      payload: productsPayload,
    });
  } catch (err) {
    console.log(err);
    yield all([
      put({
        type: FILTER_PRODUCTS_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* getAllProductTypes() {
  try {
    const productTypesPayload = yield call(productsService.getAllProductTypes);
    yield put({
      type: GET_ALL_PRODUCT_TYPES_SUCCESS,
      payload: [...productTypesPayload],
    });
  } catch (err) {
    yield all([
      put({
        type: GET_ALL_PRODUCT_TYPES_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* addProduct({ payload }) {
  try {
    const addProductPayload = yield call(productsService.addProduct, payload);

    yield put({
      type: ADD_PRODUCT_SUCCESS,
      payload: addProductPayload,
    });
    yield call(toast.success, "Producto agregado con exito!");
    yield put({
      type: FILTER_PRODUCTS_INIT,
      payload: payload.params || {},
    });
  } catch (err) {
    console.log(err);
    yield all([
      put({
        type: ADD_PRODUCT_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* editProduct({ payload }) {
  try {
    const servicePayload = yield call(productsService.editProduct, payload);
    yield all([
      call(toast.success, "Producto editado con exito!"),
      put({
        type: EDIT_PRODUCT_SUCCESS,
        payload: servicePayload,
      }),
      put({
        type: FILTER_PRODUCTS_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (err) {
    yield all([
      put({
        type: EDIT_PRODUCT_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* deleteProduct({ payload }) {
  try {
    const servicePayload = yield call(productsService.deleteProduct, payload);
    yield all([
      call(toast.success, "Producto borrado con exito!"),
      put({
        type: DELETE_PRODUCT_SUCCESS,
        payload: servicePayload,
      }),
      put({
        type: GET_ALL_PRODUCTS_INIT,
      }),
    ]);
  } catch (err) {
    yield all([
      put({
        type: DELETE_PRODUCT_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export default function* rootProductsSaga() {
  yield all([
    takeLatest(PRODUCTS_INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GET_ALL_PRODUCTS_INIT, getAllProducts),
    takeLatest(GET_ALL_PRODUCT_TYPES_INIT, getAllProductTypes),
    takeLatest(ADD_PRODUCT_INIT, addProduct),
    takeLatest(EDIT_PRODUCT_INIT, editProduct),
    takeLatest(DELETE_PRODUCT_INIT, deleteProduct),
    takeLatest(FILTER_PRODUCTS_INIT, filterProducts),
  ]);
}
