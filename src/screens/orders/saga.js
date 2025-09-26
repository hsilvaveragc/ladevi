import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import { getErrorMessage } from "shared/utils";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  ADD_ORDER_INIT,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAILURE,
  FILTER_ORDERS_INIT,
  FILTER_ORDERS_SUCCESS,
  FILTER_ORDERS_FAILURE,
  GET_ALL_PRODUCTEDITIONS_INIT,
  GET_ALL_PRODUCTEDITIONS_SUCESS,
  GET_ALL_PRODUCTEDITIONS_FAILURE,
  EDIT_ORDER_INIT,
  EDIT_ORDER_SUCCESS,
  EDIT_ORDER_FAILURE,
  DELETE_ORDER_INIT,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  GET_ALL_CONTRACTS_INIT,
  GET_ALL_CONTRACTS_SUCESS,
  GET_ALL_CONTRACTS_FAILURE,
  GET_ALL_SPACESTYPES_INIT,
  GET_ALL_SPACETYPES_SUCESS,
  GET_ALL_SPACETYPES_FAILURE,
  GET_ALL_SPACELOCATIONS_INIT,
  GET_ALL_SPACELOCATIONS_SUCESS,
  GET_ALL_SPACELOCATIONS_FAILURE,
  GET_CLIENTSWITHBALANCE_INIT,
  GET_CLIENTSWITHBALANCE_SUCESS,
  GET_CLIENTSWITHBALANCE_FAILURE,
  GETEDITIONSFOROP_INIT,
  GETEDITIONSFILTER_INIT,
  GETEDITIONSFILTER_SUCCESS,
  GETEDITIONSFILTER_FAILURE,
} from "./actionTypes.js";
import {
  UPDATE_ORDERS_CONTRACT,
  UPDATE_CONTRACT_HISTORIAL,
} from "../contracts/actionTypes.js";

import ordersService from "./service";
import contractsService from "../contracts/service";
import usersService from "../users/service";
import productsService from "../products/service";
import clientsService from "../clients/service";

export function* initialLoad() {
  try {
    const [availableProducts, availableSalesmens, allClients] = yield all([
      call(productsService.getAllProductsOptions),
      call(usersService.getAllApplicationUserOptions),
      call(clientsService.getAllClientsOptions),
    ]);
    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        availableProducts,
        availableSalesmens,
        allClients,
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

export function* addOrder({ payload }) {
  try {
    const addOrderPayload = yield call(ordersService.addOrder, payload);

    yield put({
      type: ADD_ORDER_SUCCESS,
      payload: addOrderPayload,
    });
    yield call(toast.success, "Orden de publicación agregada con exito!");
    yield put({
      type: FILTER_ORDERS_INIT,
      payload: payload.params || {},
    });

    //Si esta asociada a un contrato actualizamos la lista de op de ese contrato
    if (payload.contractId && payload.isFromContract) {
      payload.updateOrdenesHandler({
        ...addOrderPayload.data,
        ...payload.newOP,
      });

      yield put({
        type: UPDATE_ORDERS_CONTRACT,
        payload: {
          ...addOrderPayload.data,
          productEdition: payload.productEditionSel,
        },
      });

      //Obtenemos el historial del contracto actualizado
      const historial = yield call(
        contractsService.getContractHistorial,
        payload.contractId
      );
      yield call(payload.updateHistorial, historial);

      yield put({
        type: UPDATE_CONTRACT_HISTORIAL,
        payload: historial,
      });
    }
  } catch (err) {
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
      type: ADD_ORDER_FAILURE,
      errors: auxError,
    });
  }
}

export function* editOrder({ payload }) {
  try {
    const editOrderPayload = yield call(ordersService.editOrder, payload);

    yield put({
      type: EDIT_ORDER_SUCCESS,
      payload: editOrderPayload,
    });

    yield call(toast.success, "Orden de publicación modificada con exito!");

    if (payload.contractId && payload.isFromContract) {
      payload.updateOrdenesHandler({
        ...payload,
        ...payload.newOP,
      });
    }

    if (!payload.isFromContract) {
      yield put({
        type: FILTER_ORDERS_INIT,
        payload: payload.params || {},
      });
    }
  } catch (err) {
    console.log(err);
    yield all([
      put({
        type: EDIT_ORDER_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, getErrorMessage(err.response.data.errors)),
    ]);
  }
}

export function* deleteOrder({ payload }) {
  try {
    const deleteOrderPayload = yield call(ordersService.deleteOrder, payload);

    yield put({ type: DELETE_ORDER_SUCCESS, payload: deleteOrderPayload });
    yield call(toast.success, "Orden de publicación eliminada con exito!");

    if (payload.contractId && payload.isFromContract) {
      payload.updateOrdenesHandler({
        ...payload,
      });
    }
    console.log("Parametros: ", payload.params);

    if (!payload.isFromContract) {
      yield put({
        type: FILTER_ORDERS_INIT,
        payload: payload.params || {},
      });
    }
  } catch (err) {
    console.log(err);
    yield all([
      put({
        type: DELETE_ORDER_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export function* filterOrders({ payload }) {
  try {
    const filterPayload = yield call(ordersService.filterOrders, payload);
    yield put({
      type: FILTER_ORDERS_SUCCESS,
      payload: {
        availableOrders: [...filterPayload],
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FILTER_ORDERS_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* getEditionsFilter({ payload }) {
  try {
    const productEditionsPayload = yield call(
      ordersService.getAllEditions,
      payload
    );
    yield put({
      type: GETEDITIONSFILTER_SUCCESS,
      payload: [...productEditionsPayload],
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GETEDITIONSFILTER_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getAllProductEditions({ payload }) {
  try {
    const productEditionsPayload = yield call(
      ordersService.getAllEditions,
      payload
    );
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

export function* getEditionsForOP({ payload }) {
  try {
    const productEditionsPayload = yield call(
      ordersService.getEditionsForOP,
      payload
    );
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

export function* getContractsAvailable({ payload }) {
  try {
    const contractPayload = yield call(
      ordersService.getAvailableContracts,
      payload
    );
    yield put({
      type: GET_ALL_CONTRACTS_SUCESS,
      payload: [...contractPayload],
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GET_ALL_CONTRACTS_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getSpaceTypesAvailable({ payload }) {
  try {
    const spaceTypePayload = yield call(
      ordersService.getAvailableSpaceTypes,
      payload
    );
    yield put({
      type: GET_ALL_SPACETYPES_SUCESS,
      payload: [...spaceTypePayload],
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GET_ALL_SPACETYPES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getSpaceLocationsAvailable({ payload }) {
  try {
    const spaceLocationPayload = yield call(
      ordersService.getAvailableSpaceLocations,
      payload
    );
    yield put({
      type: GET_ALL_SPACELOCATIONS_SUCESS,
      payload: [...spaceLocationPayload],
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GET_ALL_SPACELOCATIONS_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getClientsWithBalance({ payload }) {
  try {
    console.log(payload);
    const clientsWithBalancePayload = yield call(
      ordersService.getClientsWithBalance,
      payload
    );
    yield put({
      type: GET_CLIENTSWITHBALANCE_SUCESS,
      payload: [...clientsWithBalancePayload],
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: GET_CLIENTSWITHBALANCE_FAILURE,
      error: err.response.data.message,
    });
  }
}

export default function* rootOrdersSaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GETEDITIONSFILTER_INIT, getEditionsFilter),
    takeLatest(FILTER_ORDERS_INIT, filterOrders),
    takeLatest(GET_ALL_PRODUCTEDITIONS_INIT, getAllProductEditions),
    takeLatest(GET_CLIENTSWITHBALANCE_INIT, getClientsWithBalance),
    takeLatest(GET_ALL_CONTRACTS_INIT, getContractsAvailable),
    takeLatest(ADD_ORDER_INIT, addOrder),
    takeLatest(EDIT_ORDER_INIT, editOrder),
    takeLatest(DELETE_ORDER_INIT, deleteOrder),
    takeLatest(GET_ALL_SPACESTYPES_INIT, getSpaceTypesAvailable),
    takeLatest(GET_ALL_SPACELOCATIONS_INIT, getSpaceLocationsAvailable),
    takeLatest(GETEDITIONSFOROP_INIT, getEditionsForOP),
  ]);
}
