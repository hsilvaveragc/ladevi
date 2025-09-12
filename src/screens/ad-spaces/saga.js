import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  GET_ALL_PRODUCT_ADVERTISING_SPACES_INIT,
  GET_ALL_PRODUCT_ADVERTISING_SPACES_SUCCESS,
  GET_ALL_PRODUCT_ADVERTISING_SPACES_FAILURE,
  ADD_PRODUCT_ADVERTISING_SPACE_INIT,
  ADD_PRODUCT_ADVERTISING_SPACE_SUCCESS,
  ADD_PRODUCT_ADVERTISING_SPACE_FAILURE,
  EDIT_PRODUCT_ADVERTISING_SPACE_INIT,
  EDIT_PRODUCT_ADVERTISING_SPACE_SUCCESS,
  EDIT_PRODUCT_ADVERTISING_SPACE_FAILURE,
  DELETE_PRODUCT_ADVERTISING_SPACE_INIT,
  DELETE_PRODUCT_ADVERTISING_SPACE_SUCCESS,
  DELETE_PRODUCT_ADVERTISING_SPACE_FAILURE,
  PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_INIT,
  PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_SUCCESS,
  PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_FAILURE,
  FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
  FILTER_PRODUCT_ADVERTISING_SPACES_SUCCESS,
  FILTER_PRODUCT_ADVERTISING_SPACES_FAILURE,
} from "./actionTypes";

import productsService from "../products/service";
import productAdsService from "./service";

export function* initialLoad() {
  try {
    const [
      availableProducts,
      adsSpaceLocationType,
      availableProductAdvertisingSpaces,
    ] = yield all([
      call(productsService.getAllProducts),
      call(productsService.getAllAdvertisingSpaceLocationType),
      call(productAdsService.getAllProductAdvertisingSpaces),
    ]);
    yield put({
      type: PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_SUCCESS,
      payload: {
        availableProducts,
        adsSpaceLocationType,
        availableProductAdvertisingSpaces,
      },
    });
  } catch (err) {
    yield put({
      type: PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_FAILURE,
      error: err,
    });
  }
}

export function* getAllProductAdvertisingSpaces({ payload }) {
  try {
    const allProductAdvertisingSpacesPayload = yield call(
      productAdsService.getAllProductAdvertisingSpaces,
      payload
    );
    yield put({
      type: GET_ALL_PRODUCT_ADVERTISING_SPACES_SUCCESS,
      payload: allProductAdvertisingSpacesPayload,
    });
  } catch (error) {
    yield all([
      put({
        type: GET_ALL_PRODUCT_ADVERTISING_SPACES_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* addProductAdvertisingSpace({ payload }) {
  try {
    yield call(productAdsService.addProductAdvertisingSpace, payload);
    yield all([
      call(toast.success, "Tipo de Espacio guardado con exito!"),
      put({
        type: ADD_PRODUCT_ADVERTISING_SPACE_SUCCESS,
      }),
      put({
        type: FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (error) {
    yield all([
      put({
        type: ADD_PRODUCT_ADVERTISING_SPACE_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* editProductAdvertisingSpace({ payload }) {
  try {
    yield call(productAdsService.editProductAdvertisingSpace, payload);
    yield all([
      call(toast.success, "Tipo de Espacio editado con exito!"),
      put({
        type: EDIT_PRODUCT_ADVERTISING_SPACE_SUCCESS,
      }),
      put({
        type: FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (error) {
    yield all([
      put({
        type: EDIT_PRODUCT_ADVERTISING_SPACE_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* deleteProductAdvertisingSpace({ payload }) {
  try {
    yield call(productAdsService.deleteProductAdvertisingSpace, payload);
    yield all([
      call(toast.success, "Tipo de Espacio borrado con exito!"),
      put({
        type: DELETE_PRODUCT_ADVERTISING_SPACE_SUCCESS,
      }),
      put({
        type: FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (error) {
    yield all([
      put({
        type: DELETE_PRODUCT_ADVERTISING_SPACE_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* filterProductAdvertisingSpace({ payload }) {
  try {
    const response = yield call(
      productAdsService.filterProductAdvertisingSpace,
      payload
    );
    yield put({
      type: FILTER_PRODUCT_ADVERTISING_SPACES_SUCCESS,
      payload: response,
    });
  } catch (error) {
    yield all([
      put({
        type: FILTER_PRODUCT_ADVERTISING_SPACES_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export default function* rootAdSpacesSaga() {
  yield all([
    takeLatest(PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_INIT, initialLoad),
    takeLatest(
      GET_ALL_PRODUCT_ADVERTISING_SPACES_INIT,
      getAllProductAdvertisingSpaces
    ),
    takeLatest(ADD_PRODUCT_ADVERTISING_SPACE_INIT, addProductAdvertisingSpace),
    takeLatest(
      EDIT_PRODUCT_ADVERTISING_SPACE_INIT,
      editProductAdvertisingSpace
    ),
    takeLatest(
      DELETE_PRODUCT_ADVERTISING_SPACE_INIT,
      deleteProductAdvertisingSpace
    ),
    takeLatest(
      FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
      filterProductAdvertisingSpace
    ),
  ]);
}
