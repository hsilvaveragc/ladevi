import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import ordersFPRService from "./service";
import productsService from "../products/service";
import ordersService from "../orders/service";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FILTER_ORDERSFPR_INIT,
  FILTER_ORDERSFPR_SUCCESS,
  FILTER_ORDERSFPR_FAILURE,
  GET_ALL_PRODUCTEDITIONS_INIT,
  GET_ALL_PRODUCTEDITIONS_SUCESS,
  GET_ALL_PRODUCTEDITIONS_FAILURE,
  ADD_ORDERSFPR_INIT,
  ADD_ORDERSFPR_SUCCESS,
  ADD_ORDERSFPR_FAILURE,
} from "./actionTypes";

export function* initialLoad() {
  try {
    const [availableProducts] = yield all([
      call(productsService.getAllProducts),
    ]);
    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        availableProducts,
      },
    });
  } catch (error) {
    console.log(error);
    yield all([
      put({
        type: INITIAL_LOAD_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* addReportOPGeneration({ payload }) {
  try {
    yield call(ordersFPRService.addReportOPGeneration, payload);
  } catch (err) {
    console.log(err);
    yield put({
      type: ADD_ORDERSFPR_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getAllProductEditions({ payload }) {
  try {
    const productEditionsPayload = yield call(
      ordersService.getAllEditionsForReport,
      payload
    );

    console.log(productEditionsPayload);

    yield put({
      type: GET_ALL_PRODUCTEDITIONS_SUCESS,
      payload: [...productEditionsPayload],
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GET_ALL_PRODUCTEDITIONS_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* filterOrders({ payload }) {
  try {
    const filterOrderPayload = yield call(
      ordersFPRService.filterOrdersFPR,
      payload
    );

    if (filterOrderPayload.length === 0) {
      //alert("No hay resultados");
      yield all([call(toast.info, "No hay resultados")]);
    }

    yield put({
      type: FILTER_ORDERSFPR_SUCCESS,
      payload: filterOrderPayload,
    });
  } catch (err) {
    console.log(err);
    yield all([
      put({
        type: FILTER_ORDERSFPR_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export default function* rootOrderFPRSaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(FILTER_ORDERSFPR_INIT, filterOrders),
    takeLatest(GET_ALL_PRODUCTEDITIONS_INIT, getAllProductEditions),
    takeLatest(ADD_ORDERSFPR_INIT, addReportOPGeneration),
  ]);
}
