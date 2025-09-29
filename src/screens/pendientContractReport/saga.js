import { put, all, takeLatest, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import usersService from '../users/service';
import clientsService from '../clients/service';

import pendientContractService from './service';
import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  FILTER_PENDIENTCONTRACT_INIT,
  FILTER_PENDIENTCONTRACT_SUCCESS,
  FILTER_PENDIENTCONTRACT_FAILURE,
} from './actionTypes';

export function* initialLoad() {
  try {
    const [availableSellers, availableClients] = yield all([
      call(usersService.getAllApplicationUserOptions),
      call(clientsService.getAllClientsOptions),
    ]);

    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
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

export function* filterReport({ payload }) {
  try {
    const filterPendientContractPayload = yield call(
      pendientContractService.filterPendientContracts,
      payload
    );

    if (filterPendientContractPayload.length === 0) {
      //alert("No hay resultados");
      yield all([call(toast.info, 'No hay resultados')]);
    }

    yield put({
      type: FILTER_PENDIENTCONTRACT_SUCCESS,
      payload: filterPendientContractPayload,
    });
  } catch (err) {
    yield all([
      put({
        type: FILTER_PENDIENTCONTRACT_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export default function* rootPendientContract() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(FILTER_PENDIENTCONTRACT_INIT, filterReport),
  ]);
}
