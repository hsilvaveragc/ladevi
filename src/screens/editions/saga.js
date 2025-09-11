import { put, all, takeLatest, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import productService from '../products/service';

import {
  EDITIONS_INITIAL_LOAD_INIT,
  EDITIONS_INITIAL_LOAD_SUCCESS,
  EDITIONS_INITIAL_LOAD_FAILURE,
  GET_ALL_EDITIONS_INIT,
  GET_ALL_EDITIONS_SUCCESS,
  GET_ALL_EDITIONS_FAILURE,
  ADD_EDITION_INIT,
  ADD_EDITION_SUCCESS,
  ADD_EDITION_FAILURE,
  EDIT_EDITION_INIT,
  EDIT_EDITION_SUCCESS,
  EDIT_EDITION_FAILURE,
  DELETE_EDITION_INIT,
  DELETE_EDITION_SUCCESS,
  DELETE_EDITION_FAILURE,
  EDITIONS_FILTER_INIT,
  EDITIONS_FILTER_SUCCESS,
  EDITIONS_FILTER_FAILURE,
  IMPORT_EDITIONS_INIT,
  IMPORT_EDITIONS_SUCCESS,
  IMPORT_EDITIONS_FAILURE,
} from './actionTypes.js';
import editionsService from './service';

export function* initialLoad() {
  try {
    const [availableEditions, availableProducts] = yield all([
      call(editionsService.getAllEditions),
      call(productService.getAllProductsOptionsFull),
    ]);
    yield put({
      type: EDITIONS_INITIAL_LOAD_SUCCESS,
      payload: {
        availableEditions,
        availableProducts,
      },
    });
  } catch (err) {
    yield put({
      type: EDITIONS_INITIAL_LOAD_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* getAllEditions({ payload }) {
  try {
    const allProductAdvertisingSpacesPayload = yield call(
      editionsService.getAllEditions,
      payload
    );
    yield put({
      type: GET_ALL_EDITIONS_SUCCESS,
      payload: allProductAdvertisingSpacesPayload,
    });
  } catch (err) {
    yield put({
      type: GET_ALL_EDITIONS_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* addEdition({ payload }) {
  try {
    const servicePayload = yield call(editionsService.addEdition, payload);
    yield all([
      call(toast.success, 'Edicion guardada con exito!'),
      put({
        type: ADD_EDITION_SUCCESS,
      }),
      put({
        type: EDITIONS_FILTER_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (err) {
    yield put({
      type: ADD_EDITION_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* editEdition({ payload }) {
  try {
    const servicePayload = yield call(editionsService.editEdition, payload);
    yield all([
      call(toast.success, 'Edicion editada con exito!'),
      put({
        type: EDIT_EDITION_SUCCESS,
      }),
      put({
        type: EDITIONS_FILTER_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (err) {
    yield put({
      type: EDIT_EDITION_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* deleteEdition({ payload }) {
  try {
    const servicePayload = yield call(editionsService.deleteEdition, payload);
    yield all([
      call(toast.success, 'Edicion borrada con exito!'),
      put({
        type: DELETE_EDITION_SUCCESS,
      }),
      put({
        type: EDITIONS_FILTER_INIT,
        payload: payload.params || {},
      }),
    ]);
  } catch (err) {
    yield put({
      type: DELETE_EDITION_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export function* filterEditions({ payload }) {
  try {
    const filterEditionsPayload = yield call(
      editionsService.filterEditions,
      payload
    );
    yield put({
      type: EDITIONS_FILTER_SUCCESS,
      payload: {
        filteredEditions: filterEditionsPayload,
      },
    });
  } catch (err) {
    yield put({
      type: EDITIONS_FILTER_FAILURE,
      error: err,
    });
  }
}

const downloadTxtFile = (texto) => {
  const element = document.createElement('a');
  const file = new Blob([texto], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = `Error importacion edicion ${format(
    new Date(),
    'dd-MM-yyyy HH:mm:ss'
  )}.txt`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export function* importEditions({ payload }) {
  try {
    const servicePayload = yield call(editionsService.importEditions, payload);
    if (servicePayload.importSuccess) {
      yield all([
        call(toast.success, 'Edicion importada con exito!'),
        put({
          type: IMPORT_EDITIONS_SUCCESS,
        }),
        put({
          type: EDITIONS_FILTER_INIT,
          payload: payload.params || {},
        }),
      ]);
    } else {
      let errorMessagge =
        'Se encontraron los siguientes errores al querer importar las ediciones\n';
      servicePayload.errors.map((error) => {
        errorMessagge += `Linea: ${error.line} Error: ${error.messageError}\n`;
        return null;
      });
      downloadTxtFile(errorMessagge);
      yield all([
        call(
          toast.error,
          'Error al importar el archivo, revise el documento descargado para mas detalle.',
          {
            closeButton: true,
          }
        ),
      ]);
      // yield put({
      //   type: IMPORT_EDITIONS_FAILURE,
      //   errors: { ...servicePayload.errors },
      // });
    }
  } catch (err) {
    yield put({
      type: IMPORT_EDITIONS_FAILURE,
      errors: { ...err.response.data.errors },
    });
  }
}

export default function* rootEditionsSaga() {
  yield all([
    takeLatest(EDITIONS_INITIAL_LOAD_INIT, initialLoad),
    takeLatest(GET_ALL_EDITIONS_INIT, getAllEditions),
    takeLatest(ADD_EDITION_INIT, addEdition),
    takeLatest(EDIT_EDITION_INIT, editEdition),
    takeLatest(DELETE_EDITION_INIT, deleteEdition),
    takeLatest(EDITIONS_FILTER_INIT, filterEditions),
    takeLatest(IMPORT_EDITIONS_INIT, importEditions),
  ]);
}
