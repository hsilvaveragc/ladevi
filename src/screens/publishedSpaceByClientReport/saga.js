import { put, all, takeLatest, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import productsService from '../products/service';
import ordersService from '../orders/service';
import usersService from '../users/service';
import clientsService from '../clients/service';

import ordersByClient from './service';
import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FILTER_ORDERSBYCLIENT_INIT,
  FILTER_ORDERSBYCLIENT_SUCCESS,
  FILTER_ORDERSBYCLIENT_FAILURE,
  GET_PRODUCT_BYTYPE_INIT,
  GET_PRODUCT_BYTYPE_SUCCESS,
  GET_PRODUCT_BYTYPE_FAILURE,
  GET_PRODUCTEDITION_BYPRODUCT_INIT,
  GET_PRODUCTEDITION_BYPRODUCT_SUCCESS,
  GET_PRODUCTEDITION_BYPRODUCT_FAILURE,
} from './actionTypes';

export function* initialLoad() {
  try {
    const [availableClients, availableSellers, availableProductTypes] =
      yield all([
        call(clientsService.getAllClientsOptions),
        call(usersService.getAllApplicationUserOptions),
        call(productsService.getAllProductTypes),
      ]);

    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        availableProductTypes,
        availableSellers,
        availableClients,
      },
    });
  } catch (err) {
    yield all([
      put({
        type: INITIAL_LOAD_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* getAllProductEditions({ payload }) {
  try {
    const productEditionsPayload = yield call(
      ordersService.getAllEditions,
      payload
    );

    yield put({
      type: GET_PRODUCTEDITION_BYPRODUCT_SUCCESS,
      payload: [...productEditionsPayload],
    });
  } catch (err) {
    yield put({
      type: GET_PRODUCTEDITION_BYPRODUCT_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getProductByType({ payload }) {
  try {
    const productPayload = yield call(
      productsService.getProductsByProductTypeOptions,
      payload
    );

    yield put({
      type: GET_PRODUCT_BYTYPE_SUCCESS,
      payload: productPayload,
    });
  } catch (err) {
    yield all([
      put({
        type: GET_PRODUCT_BYTYPE_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* filterReport({ payload }) {
  try {
    const filterOrderPayload = yield call(
      ordersByClient.filterOrdersByClient,
      payload
    );

    if (filterOrderPayload.length === 0) {
      //alert("No hay resultados");
      yield all([call(toast.info, 'No hay resultados')]);
    }

    yield put({
      type: FILTER_ORDERSBYCLIENT_SUCCESS,
      payload: filterOrderPayload,
    });
  } catch (err) {
    yield all([
      put({
        type: FILTER_ORDERSBYCLIENT_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export default function* rootOrdersByClient() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(FILTER_ORDERSBYCLIENT_INIT, filterReport),
    takeLatest(GET_PRODUCT_BYTYPE_INIT, getProductByType),
    takeLatest(GET_PRODUCTEDITION_BYPRODUCT_INIT, getAllProductEditions),
  ]);
}
