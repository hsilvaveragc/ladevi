import React from "react";
import { put, all, takeLatest, call, select } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  FETCH_INVOICES_INIT,
  FETCH_INVOICES_SUCCESS,
  FETCH_INVOICES_FAILURE,
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FETCH_CLIENTS_INIT,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILURE,
  FETCH_CONTRACTS_INIT,
  FETCH_CONTRACTS_SUCCESS,
  FETCH_CONTRACTS_FAILURE,
  FETCH_ORDERS_INIT,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_XUBIO_PRODUCTS_INIT,
  FETCH_XUBIO_PRODUCTS_SUCCESS,
  FETCH_XUBIO_PRODUCTS_FAILURE,
  SEND_TO_XUBIO_INIT,
  SEND_TO_XUBIO_SUCCESS,
  SEND_TO_XUBIO_FAILURE,
  FILTER_CONTRACTS_INIT,
  FILTER_CONTRACTS_SUCCESS,
  FILTER_CONTRACTS_FAILURE,
  FILTER_ORDERS_INIT,
  FILTER_ORDERS_SUCCESS,
  FILTER_ORDERS_FAILURE,
} from "./actionTypes.js";

import billingService from "./service";
import {
  getSelectedClient,
  getEntityType,
  getSelectedCurrency,
} from "./reducer";

export function* initialLoad() {
  try {
    // Cargar ambos tipos de productos Xubio al inicio
    const [xubioProducts, xubioComturProducts] = yield all([
      call(billingService.getXubioProducts),
      call(billingService.getXubioComturProducts),
    ]);

    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        xubioProducts,
        xubioComturProducts,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: INITIAL_LOAD_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error en la carga inicial",
        }),
      },
    });
    yield call(toast.error, "Hubo un error al cargar los datos iniciales");
  }
}

export function* fetchClients({ payload }) {
  try {
    const clients = yield call(billingService.getClientsByType, payload);
    yield put({
      type: FETCH_CLIENTS_SUCCESS,
      payload: {
        clients,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FETCH_CLIENTS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al cargar clientes",
        }),
      },
    });
    yield call(toast.error, "Hubo un error al cargar los clientes");
  }
}

export function* fetchContracts({ payload }) {
  try {
    const contracts = yield call(
      billingService.getPendingContractsByClient,
      payload
    );
    yield put({
      type: FETCH_CONTRACTS_SUCCESS,
      payload: {
        contracts,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FETCH_CONTRACTS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al cargar contratos",
        }),
      },
    });
    yield call(toast.error, "Hubo un error al cargar los contratos");
  }
}

export function* filterContracts({ payload }) {
  try {
    const contracts = yield call(billingService.filterContracts, payload);
    yield put({
      type: FILTER_CONTRACTS_SUCCESS,
      payload: {
        contracts,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FILTER_CONTRACTS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al filtrar contratos",
        }),
      },
    });
    yield call(toast.error, "Hubo un error al filtrar los contratos");
  }
}

export function* fetchOrders({ payload }) {
  try {
    const orders = yield call(
      billingService.getPublishingOrdersByClient,
      payload
    );
    yield put({
      type: FETCH_ORDERS_SUCCESS,
      payload: {
        orders,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FETCH_ORDERS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al cargar órdenes",
        }),
      },
    });
    yield call(
      toast.error,
      "Hubo un error al cargar las órdenes de publicación"
    );
  }
}

export function* filterOrders({ payload }) {
  try {
    const orders = yield call(billingService.filterOrders, payload);
    yield put({
      type: FILTER_ORDERS_SUCCESS,
      payload: {
        orders,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FILTER_ORDERS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al filtrar órdenes",
        }),
      },
    });
    yield call(
      toast.error,
      "Hubo un error al filtrar las órdenes de publicación"
    );
  }
}

export function* fetchXubioProducts() {
  try {
    const [xubioProducts, xubioComturProducts] = yield all([
      call(billingService.getXubioProducts),
      call(billingService.getXubioComturProducts),
    ]);

    yield put({
      type: FETCH_XUBIO_PRODUCTS_SUCCESS,
      payload: {
        xubioProducts,
        xubioComturProducts,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FETCH_XUBIO_PRODUCTS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al cargar productos de Xubio",
        }),
      },
    });
    yield call(toast.error, "Hubo un error al cargar los productos de Xubio");
  }
}

export function* sendToXubio({ payload }) {
  // Mostrar toast de procesamiento
  const toastId = toast.info(
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="spinner-border spinner-border-sm me-2" role="status">
        <span className="visually-hidden"></span>
      </div>
      <span className="ml-3">Procesando facturación...</span>
    </div>,
    { autoClose: false, closeButton: false, position: "top-center" }
  );

  try {
    const result = yield call(billingService.sendToXubio, payload);

    // Obtener el estado actual
    const state = yield select();

    // Obtener el cliente, tipo de entidad y moneda seleccionados
    const selectedClient = getSelectedClient(state);
    const entityType = getEntityType(state);
    const selectedCurrency = getSelectedCurrency(state);

    // Hacer dispatch del éxito primero
    yield put({
      type: SEND_TO_XUBIO_SUCCESS,
      payload: {
        result,
      },
    });

    // Cerrar el toast de procesamiento
    toast.dismiss(toastId);

    const successMessage =
      result && result.numeroDocumento
        ? `Factura Nro. ${result.numeroDocumento} generada en Xubio con éxito`
        : "Factura enviada a Xubio con éxito";

    yield call(toast.success, successMessage, {
      autoClose: 1000000,
      closeButton: true,
      position: "top-center",
    });

    // Recargar los datos según el tipo de entidad
    if (entityType === "CONTRACTS") {
      // Primero recargar todos los contratos para ese cliente
      yield put({
        type: FETCH_CONTRACTS_INIT,
        payload: selectedClient.id,
      });
    } else if (entityType === "ORDERS") {
      // Primero recargar todas las órdenes para ese cliente
      yield put({
        type: FETCH_ORDERS_INIT,
        payload: selectedClient.id,
      });
    }
  } catch (err) {
    // Cerrar el toast de procesamiento en caso de error
    toast.dismiss(toastId);

    let auxError = {};

    // Verificar si existe la respuesta y los datos de error
    if (err.response && err.response.data && err.response.data.errors) {
      auxError = {
        ...err.response.data.errors,
      };
      // Manejar el caso especial cuando hay una clave vacía en el objeto de errores
      if (auxError[""] && auxError[""].length > 0) {
        // Mostrar el primer mensaje de error en la clave vacía
        yield call(toast.error, auxError[""][0], { position: "top-center" });

        // Si solo hay errores en la clave vacía, también podemos crear un error general
        if (Object.keys(auxError).length === 1) {
          auxError.general = auxError[""][0];
        }
      }
    }

    console.log(auxError);
    yield put({
      type: SEND_TO_XUBIO_FAILURE,
      errors: auxError,
    });

    // Si no hay errores específicos o si auxError está vacío, mostrar mensaje genérico
    if (Object.keys(auxError).length === 0) {
      yield call(toast.error, "Hubo un error", { position: "top-center" });
    }
  }
}

export default function* rootBillingSaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(FETCH_CLIENTS_INIT, fetchClients),
    takeLatest(FETCH_CONTRACTS_INIT, fetchContracts),
    takeLatest(FETCH_ORDERS_INIT, fetchOrders),
    takeLatest(FETCH_XUBIO_PRODUCTS_INIT, fetchXubioProducts),
    takeLatest(SEND_TO_XUBIO_INIT, sendToXubio),
    takeLatest(FILTER_CONTRACTS_INIT, filterContracts),
    takeLatest(FILTER_ORDERS_INIT, filterOrders),
  ]);
}
