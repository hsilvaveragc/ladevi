import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../shared/utils/index.js";

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  ADD_CONTRACT_INIT,
  ADD_CONTRACT_SUCCESS,
  ADD_CONTRACT_FAILURE,
  GET_ALL_CONTRACTS_INIT,
  FILTER_CONTRACTS_SUCCESS,
  FILTER_CONTRACTS_FAILURE,
  FILTER_CONTRACTS_INIT,
  EDIT_CONTRACT_INIT,
  EDIT_CONTRACT_SUCCESS,
  EDIT_CONTRACT_FAILURE,
  SEARCH_CONTRACTS_INIT,
  DELETE_CONTRACT_INIT,
  DELETE_CONTRACT_SUCCESS,
  DELETE_CONTRACT_FAILURE,
  GET_SPACETYPES_INIT,
  GET_SPACETYPES_SUCCESS,
  GET_SPACETYPES_FAILURE,
  GET_CURRENCIES_INIT,
  GET_CURRENCIES_SUCCESS,
  GET_CURRENCIES_FAILURE,
  GET_EUROPARITY_INIT,
  GET_EUROPARITY_SUCCESS,
  GET_EUROPARITY_FAILURE,
} from "./actionTypes.js";

import contractsService from "./service";
import usersService from "../users/service";
import productsService from "../products/service";
import clientsService from "../clients/service";
import adSpacesService from "../ad-spaces/service";

export function* initialLoad() {
  try {
    const [
      availableSalesmens,
      availableProducts,
      availableSpaceTypes,
      availableSpaceLocations,
      availableClients,
      availableCountries,
      availableCurrencies,
      availableEuroParities,
    ] = yield all([
      call(usersService.getAllApplicationUserOptions),
      call(productsService.getAllProductsOptionsFull),
      // call(adSpacesService.getProductAdvertisingSpaceOptionsFull),
      call(contractsService.getAllSpaceTypes),
      call(contractsService.getAllSpaceLocations),
      call(clientsService.getAllClientsOptionsFull),
      call(contractsService.getCountriesOptions),
      call(contractsService.getCurrencies),
      call(contractsService.getEuroParities),
    ]);
    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        availableSalesmens,
        availableProducts,
        availableSpaceTypes,
        availableSpaceLocations,
        availableClients,
        availableCountries,
        availableCurrencies,
        availableEuroParities,
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

export function* filterContracts({ payload }) {
  try {
    const filterPayload = yield call(contractsService.filterContracts, payload);
    console.log(filterPayload);
    yield put({
      type: FILTER_CONTRACTS_SUCCESS,
      payload: {
        availableContracts: [...filterPayload],
      },
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FILTER_CONTRACTS_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* addContract({ payload }) {
  try {
    const addContractPayload = yield call(
      contractsService.addContract,
      payload
    );

    yield put({
      type: ADD_CONTRACT_SUCCESS,
      payload: addContractPayload,
    });

    yield call(
      toast.success,
      "Contrato Nro " + addContractPayload.data.number + " agregado con exito!",
      { autoClose: 10000 }
    );
    yield put({
      type: FILTER_CONTRACTS_INIT,
      payload: payload.searchFilters,
    });
    /*yield put({
      type: FILTER_CONTRACTS_INIT,
      payload: {},
    });*/
  } catch (err) {
    console.log(err);
    yield all([
      put({
        type: ADD_CONTRACT_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      //call(toast.error, "Hubo un error");
      call(toast.error, getErrorMessage(err.response.data.errors)),
    ]);
  }
}

export function* editContract({ payload }) {
  try {
    const editContractPayload = yield call(
      contractsService.editContract,
      payload
    );

    if (payload.notClose) {
      yield all([
        put({ type: EDIT_CONTRACT_SUCCESS, payload: editContractPayload }),
        put({
          type: FILTER_CONTRACTS_INIT,
          payload: payload.searchFilters,
        }),
      ]);
      payload.contratoSuccess();
    } else {
      yield all([
        put({ type: EDIT_CONTRACT_SUCCESS, payload: editContractPayload }),
        call(toast.success, "Contrato editado con éxito!"),
        put({
          type: FILTER_CONTRACTS_INIT,
          payload: payload.searchFilters,
        }),
      ]);
    }
  } catch (err) {
    console.log(err);
    yield put({
      type: EDIT_CONTRACT_FAILURE,
      errors: { ...err.response.data.errors },
    });
    // yield call(toast.error, "Hubo un error");
    yield call(toast.error, getErrorMessage(err.response.data.errors));
  }
}

export function* deleteContract({ payload }) {
  try {
    const deleteContractPayload = yield call(
      contractsService.deleteContract,
      payload
    );
    yield all([
      put({ type: DELETE_CONTRACT_SUCCESS, payload: deleteContractPayload }),
      call(toast.success, "Contrato eliminado con éxito!"),
    ]);
  } catch (err) {
    console.log(err);
    yield put({
      type: DELETE_CONTRACT_FAILURE,
      errors: { ...err.response.data.errors },
    });
    yield call(toast.error, "Hubo un error");
  }
}

export function* getSpaceTypes({ payload }) {
  try {
    const spaceTypePayload = yield call(
      contractsService.getAllSpaceTypes,
      payload
    );
    yield put({
      type: GET_SPACETYPES_SUCCESS,
      payload: spaceTypePayload,
    });
  } catch (err) {
    yield put({
      type: GET_SPACETYPES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getCurrencies({ payload }) {
  try {
    const currencyPayload = yield call(contractsService.getCurrencies, payload);
    yield put({
      type: GET_CURRENCIES_SUCCESS,
      payload: currencyPayload,
    });
  } catch (err) {
    yield put({
      type: GET_CURRENCIES_FAILURE,
      error: err.response.data.message,
    });
  }
}

export function* getEuroParities({ payload }) {
  try {
    const euroParityPayload = yield call(
      contractsService.getEuroParities,
      payload
    );
    yield put({
      type: GET_EUROPARITY_SUCCESS,
      payload: euroParityPayload,
    });
  } catch (err) {
    yield put({
      type: GET_EUROPARITY_FAILURE,
      error: err.response.data.message,
    });
  }
}

export default function* rootContractsSaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(ADD_CONTRACT_INIT, addContract),
    takeLatest(FILTER_CONTRACTS_INIT, filterContracts),
    takeLatest(EDIT_CONTRACT_INIT, editContract),
    takeLatest(DELETE_CONTRACT_INIT, deleteContract),
    takeLatest(GET_SPACETYPES_INIT, getSpaceTypes),
    takeLatest(GET_CURRENCIES_INIT, getCurrencies),
    takeLatest(GET_EUROPARITY_INIT, getEuroParities),
  ]);
}
