import React from "react";
import { put, all, takeLatest, call, select } from "redux-saga/effects";
import { toast } from "react-toastify";
import { CONSTANTS } from "./constants";
import billingService from "./service";
import {
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
  SEND_TO_XUBIO_INIT,
  SEND_TO_XUBIO_SUCCESS,
  SEND_TO_XUBIO_FAILURE,
  FETCH_PRODUCTS_INIT,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_EDITIONS_INIT,
  FETCH_EDITIONS_SUCCESS,
  FETCH_EDITIONS_FAILURE,
  SEND_MULTIPLE_TO_XUBIO_INIT,
  SEND_MULTIPLE_TO_XUBIO_SUCCESS,
  SEND_MULTIPLE_TO_XUBIO_FAILURE,
} from "./actionTypes";
import {
  getSelectedClient,
  getEntityType,
  getSelectedCurrency,
} from "./reducer";

export function* initialLoad() {
  try {
    const [
      xubioProducts,
      xubioComturProducts,
      xubioGenericProduct,
      xubioComturGenericProduct,
    ] = yield all([
      call(billingService.getXubioProducts),
      call(billingService.getXubioComturProducts),
      call(billingService.getXubioGenericProduct),
      call(billingService.getXubioComturGenericProduct),
    ]);

    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        xubioProducts,
        xubioComturProducts,
        xubioGenericProduct,
        xubioComturGenericProduct,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: INITIAL_LOAD_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al cargar los datos iniciales",
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

export function* fetchProducts({ payload }) {
  try {
    const products = yield call(billingService.getProductsForEditions);
    yield put({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: {
        products,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FETCH_PRODUCTS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al cargar productos",
        }),
      },
    });
    yield call(toast.error, "Hubo un error al cargar los productos");
  }
}

export function* fetchEditions({ payload }) {
  try {
    const editions = yield call(billingService.getEditionsByProduct, payload);
    yield put({
      type: FETCH_EDITIONS_SUCCESS,
      payload: {
        editions,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FETCH_EDITIONS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al cargar ediciones",
        }),
      },
    });
    yield call(toast.error, "Hubo un error al cargar las ediciones");
  }
}

export function* fetchOrders({ payload }) {
  try {
    let orders;

    console.log("Cargando órdenes por edición:", payload.editionId);

    // Obtener el tipo de cliente del estado
    const state = yield select();
    const clientType = state.billing.clientType;
    const isComturClient = clientType === CONSTANTS.COMTUR_CODE;

    console.log(
      "Tipo de cliente:",
      clientType,
      "isComturClient:",
      isComturClient
    );

    orders = yield call(
      billingService.getOrdersByEdition,
      payload.editionId,
      isComturClient
    );

    console.log("Órdenes cargadas por edición:", orders);

    yield put({
      type: FETCH_ORDERS_SUCCESS,
      payload: {
        orders,
      },
    });
  } catch (err) {
    console.log("Error cargando órdenes:", err);
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
      autoClose: 10000,
      closeButton: true,
      position: "top-center",
    });

    // Recargar los datos según el tipo de entidad
    if (entityType === CONSTANTS.CONTRACTS_CODE) {
      // Primero recargar todos los contratos para ese cliente
      yield put({
        type: FETCH_CONTRACTS_INIT,
        payload: selectedClient.id,
      });
    } else if (entityType === CONSTANTS.ORDERS_CODE) {
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

export function* sendMultipleToXubio({ payload }) {
  // Mostrar toast de procesamiento
  const toastId = toast.info(
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="spinner-border spinner-border-sm me-2" role="status">
        <span className="visually-hidden"></span>
      </div>
      <span className="ml-3">Procesando facturación múltiple...</span>
    </div>,
    { autoClose: false, closeButton: false, position: "top-center" }
  );

  try {
    const results = yield call(
      billingService.sendMultipleInvoicesToXubio,
      payload
    );

    // Obtener el estado actual
    const state = yield select();
    const entityType = getEntityType(state);
    const selectedEdition = state.billing.selectedEdition;

    // Hacer dispatch del éxito
    yield put({
      type: SEND_MULTIPLE_TO_XUBIO_SUCCESS,
      payload: {
        results,
      },
    });

    // Cerrar el toast de procesamiento
    toast.dismiss(toastId);

    // Mostrar mensaje de éxito
    const successCount = results.successCount || 0;
    const errorCount = results.errorCount || 0;

    let invoiceNumbers = "";
    if (successCount > 0) {
      invoiceNumbers = results.results
        .map(item => `${item.numeroDocumento}`)
        .join(", ");
    }

    let successMessage = `Facturación completada: ${successCount}, facturas generadas (${invoiceNumbers})`;
    if (errorCount > 0) {
      successMessage += `, ${errorCount} errores`;
    }

    yield call(toast.success, successMessage, {
      autoClose: 15000,
      closeButton: true,
      position: "top-center",
    });

    // Mostrar errores individuales si los hay
    if (results.errors && results.errors.length > 0) {
      results.errors.forEach(error => {
        toast.error(error, { position: "top-center", autoClose: 10000 });
      });
    }

    // Recargar los datos de la edición
    if (selectedEdition) {
      yield put({
        type: FETCH_ORDERS_INIT,
        payload: { editionId: selectedEdition },
      });
    }
  } catch (err) {
    // Cerrar el toast de procesamiento en caso de error
    toast.dismiss(toastId);

    console.log(err);
    yield put({
      type: SEND_MULTIPLE_TO_XUBIO_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: "Error al procesar facturación múltiple",
        }),
      },
    });

    yield call(
      toast.error,
      "Hubo un error al procesar la facturación múltiple",
      {
        position: "top-center",
      }
    );
  }
}

export default function* rootBillingSaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(FETCH_CLIENTS_INIT, fetchClients),
    takeLatest(FETCH_CONTRACTS_INIT, fetchContracts),
    takeLatest(FETCH_PRODUCTS_INIT, fetchProducts),
    takeLatest(FETCH_EDITIONS_INIT, fetchEditions),
    takeLatest(FETCH_ORDERS_INIT, fetchOrders),
    takeLatest(SEND_TO_XUBIO_INIT, sendToXubio),
    takeLatest(SEND_MULTIPLE_TO_XUBIO_INIT, sendMultipleToXubio),
  ]);
}
