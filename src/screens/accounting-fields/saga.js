import { put, all, takeLatest, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import { appDataService } from 'shared/services';

import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  GET_ALL_ACCOUNTING_FIELDS_INIT,
  GET_ALL_ACCOUNTING_FIELDS_SUCCESS,
  GET_ALL_ACCOUNTING_FIELDS_FAILURE,
  ADD_ACCOUNTING_FIELD_INIT,
  ADD_ACCOUNTING_FIELD_SUCCESS,
  ADD_ACCOUNTING_FIELD_FAILURE,
  EDIT_ACCOUNTING_FIELD_INIT,
  EDIT_ACCOUNTING_FIELD_SUCCESS,
  EDIT_ACCOUNTING_FIELD_FAILURE,
  DELETE_ACCOUNTING_FIELD_INIT,
  DELETE_ACCOUNTING_FIELD_SUCCESS,
  FILTER_ACCOUNTING_FIELDS_INIT,
  FILTER_ACCOUNTING_FIELDS_SUCCESS,
  FILTER_ACCOUNTING_FIELDS_FAILURE,
} from './actionTypes.js';
import accountingFieldsService from './service';

export function* initialLoad() {
  try {
    const [accountingFields, countries] = yield all([
      call(accountingFieldsService.getAllAccountingFields),
      call(appDataService.fetchCountries),
    ]);
    yield put({
      type: INITIAL_LOAD_SUCCESS,
      payload: {
        accountingFields,
        countries,
      },
    });
  } catch (error) {
    yield all([
      put({
        type: INITIAL_LOAD_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* getAllAccountingFields({ payload }) {
  try {
    const allProductAdvertisingSpacesPayload = yield call(
      accountingFieldsService.getAllAccountingFields,
      payload
    );
    yield put({
      type: GET_ALL_ACCOUNTING_FIELDS_SUCCESS,
      payload: allProductAdvertisingSpacesPayload,
    });
  } catch (error) {
    yield all([
      put({
        type: GET_ALL_ACCOUNTING_FIELDS_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* filterAccountingFields({ payload }) {
  try {
    const filterPayload = yield call(
      accountingFieldsService.filterAccountingFields,
      payload
    );
    yield put({
      type: FILTER_ACCOUNTING_FIELDS_SUCCESS,
      payload: filterPayload,
    });
  } catch (error) {
    yield all([
      put({
        type: FILTER_ACCOUNTING_FIELDS_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* addAccountingField({ payload }) {
  try {
    yield call(accountingFieldsService.addAccountingField, payload);
    yield all([
      call(toast.success, 'Campo contable guardado con exito!'),
      put({
        type: ADD_ACCOUNTING_FIELD_SUCCESS,
      }),
      put({
        type: FILTER_ACCOUNTING_FIELDS_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (error) {
    yield all([
      put({
        type: ADD_ACCOUNTING_FIELD_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* editAccountingField({ payload }) {
  try {
    yield call(accountingFieldsService.editAccountingField, payload);
    yield all([
      call(toast.success, 'Campo contable editado con exito!'),
      put({
        type: EDIT_ACCOUNTING_FIELD_SUCCESS,
      }),
      put({
        type: FILTER_ACCOUNTING_FIELDS_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (error) {
    yield all([
      put({
        type: EDIT_ACCOUNTING_FIELD_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export function* deleteAccountingField({ payload }) {
  try {
    yield call(accountingFieldsService.deleteAccountingField, payload);
    yield all([
      call(toast.success, 'Campo contable borrado con exito!'),
      put({
        type: DELETE_ACCOUNTING_FIELD_SUCCESS,
      }),
      put({
        type: FILTER_ACCOUNTING_FIELDS_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (error) {
    yield all([
      put({
        type: EDIT_ACCOUNTING_FIELD_FAILURE,
        errors: { ...error.response.data.errors },
      }),
      call(toast.error, 'Hubo un error :('),
    ]);
  }
}

export default function* rootAccountingFieldsSaga() {
  yield all([
    takeLatest(INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GET_ALL_ACCOUNTING_FIELDS_INIT, getAllAccountingFields),
    takeLatest(ADD_ACCOUNTING_FIELD_INIT, addAccountingField),
    takeLatest(EDIT_ACCOUNTING_FIELD_INIT, editAccountingField),
    takeLatest(DELETE_ACCOUNTING_FIELD_INIT, deleteAccountingField),
    takeLatest(FILTER_ACCOUNTING_FIELDS_INIT, filterAccountingFields),
  ]);
}
