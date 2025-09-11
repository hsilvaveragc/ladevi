import { call, put, takeLatest, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import productionService from './service';
import {
  FETCH_PRODUCTS_INIT,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_EDITIONS_INIT,
  FETCH_EDITIONS_SUCCESS,
  FETCH_EDITIONS_FAILURE,
  FETCH_PRODUCTION_ITEMS_INIT,
  FETCH_PRODUCTION_ITEMS_SUCCESS,
  FETCH_PRODUCTION_ITEMS_FAILURE,
  MOVE_ITEM_INIT,
  MOVE_ITEM_SUCCESS,
  MOVE_ITEM_FAILURE,
  ADD_SLOT_INIT,
  ADD_SLOT_SUCCESS,
  ADD_SLOT_FAILURE,
  REMOVE_SLOT_INIT,
  REMOVE_SLOT_SUCCESS,
  REMOVE_SLOT_FAILURE,
  UPDATE_OBSERVATION_INIT,
  UPDATE_OBSERVATION_SUCCESS,
  UPDATE_OBSERVATION_FAILURE,
  MARK_AS_EDITORIAL_INIT,
  MARK_AS_EDITORIAL_SUCCESS,
  MARK_AS_EDITORIAL_FAILURE,
  MARK_AS_CA_INIT,
  MARK_AS_CA_SUCCESS,
  MARK_AS_CA_FAILURE,
  GENERATE_AUTO_LAYOUT_INIT,
  GENERATE_AUTO_LAYOUT_SUCCESS,
  GENERATE_AUTO_LAYOUT_FAILURE,
  VALIDATE_PAGE_REDUCTION_INIT,
  VALIDATE_PAGE_REDUCTION_SUCCESS,
  VALIDATE_PAGE_REDUCTION_FAILURE,
  VALIDATE_INVENTORY_REDUCTION_INIT,
  VALIDATE_INVENTORY_REDUCTION_SUCCESS,
  VALIDATE_INVENTORY_REDUCTION_FAILURE,
} from './actionTypes';

export function* fetchProducts({ payload }) {
  try {
    const products = yield call(productionService.getProductsForEditions);
    yield put({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: {
        products,
      },
    });
  } catch (err) {
    yield put({
      type: FETCH_PRODUCTS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al cargar productos',
        }),
      },
    });
    yield call(toast.error, 'Hubo un error al cargar los productos');
  }
}

export function* fetchEditions({ payload }) {
  try {
    const editions = yield call(
      productionService.getEditionsByProduct,
      payload
    );
    yield put({
      type: FETCH_EDITIONS_SUCCESS,
      payload: {
        editions,
      },
    });
  } catch (err) {
    yield put({
      type: FETCH_EDITIONS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al cargar ediciones',
        }),
      },
    });
    yield call(toast.error, 'Hubo un error al cargar las ediciones');
  }
}

// Fetch production items
export function* fetchProductionItems({ payload }) {
  try {
    const response = yield call(
      productionService.getProductionItems,
      payload.editionId
    );
    yield put({
      type: FETCH_PRODUCTION_ITEMS_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: FETCH_PRODUCTION_ITEMS_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al cargar elementos de producción',
        }),
      },
    });
    yield call(toast.error, 'Error al cargar los elementos de producción');
  }
}

// Move item
export function* moveItem({ payload }) {
  try {
    yield call(
      productionService.moveItem,
      payload.itemId,
      payload.newPageNumber
    );
    yield put({
      type: MOVE_ITEM_SUCCESS,
      payload,
    });
    yield call(toast.success, 'Elemento movido correctamente');
  } catch (err) {
    yield put({
      type: MOVE_ITEM_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al mover el elemento',
        }),
      },
    });
    yield call(toast.error, 'Error al mover el elemento');
  }
}

// Add slot
export function* addSlot({ payload }) {
  try {
    const newItem = yield call(
      productionService.addSlot,
      payload.editionId,
      payload.pageNumber
    );
    yield put({
      type: ADD_SLOT_SUCCESS,
      payload: { newItem },
    });
    yield call(toast.success, 'Slot agregado correctamente');
  } catch (err) {
    yield put({
      type: ADD_SLOT_FAILURE,
      errors: {
        ...(err.response?.data?.errors || { general: 'Error al agregar slot' }),
      },
    });
    yield call(toast.error, 'Error al agregar slot');
  }
}

// Remove slot
export function* removeSlot({ payload }) {
  try {
    yield call(productionService.removeSlot, payload.itemId);
    yield put({
      type: REMOVE_SLOT_SUCCESS,
      payload,
    });
    yield call(toast.success, 'Slot eliminado correctamente');
  } catch (err) {
    yield put({
      type: REMOVE_SLOT_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al eliminar slot',
        }),
      },
    });
    yield call(toast.error, 'Error al eliminar slot');
  }
}

// Update observation
export function* updateObservation({ payload }) {
  try {
    yield call(
      productionService.updateObservation,
      payload.itemId,
      payload.observacion
    );
    yield put({
      type: UPDATE_OBSERVATION_SUCCESS,
      payload,
    });
    // No mostramos toast para esta acción para no ser intrusivos
  } catch (err) {
    yield put({
      type: UPDATE_OBSERVATION_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al actualizar observación',
        }),
      },
    });
    yield call(toast.error, 'Error al actualizar observación');
  }
}

// Mark as editorial
export function* markAsEditorial({ payload }) {
  try {
    yield call(
      productionService.markAsEditorial,
      payload.itemId,
      payload.isEditorial
    );
    yield put({
      type: MARK_AS_EDITORIAL_SUCCESS,
      payload,
    });
    yield call(
      toast.success,
      `Marcado como ${payload.isEditorial ? 'Editorial' : 'Publicidad'}`
    );
  } catch (err) {
    yield put({
      type: MARK_AS_EDITORIAL_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al actualizar tipo',
        }),
      },
    });
    yield call(toast.error, 'Error al actualizar el tipo');
  }
}

// Mark as CA
export function* markAsCA({ payload }) {
  try {
    yield call(productionService.markAsCA, payload.itemId, payload.isCA);
    yield put({
      type: MARK_AS_CA_SUCCESS,
      payload,
    });
    yield call(
      toast.success,
      `Marcado como ${payload.isCA ? 'CA' : 'Publicidad'}`
    );
  } catch (err) {
    yield put({
      type: MARK_AS_CA_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al actualizar tipo',
        }),
      },
    });
    yield call(toast.error, 'Error al actualizar el tipo');
  }
}

// Generate auto layout
export function* generateAutoLayout({ payload }) {
  try {
    const response = yield call(
      productionService.generateAutoLayout,
      payload.editionId
    );
    yield put({
      type: GENERATE_AUTO_LAYOUT_SUCCESS,
      payload: response,
    });
    yield call(toast.success, 'Layout automático generado correctamente');
  } catch (err) {
    yield put({
      type: GENERATE_AUTO_LAYOUT_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al generar layout automático',
        }),
      },
    });
    yield call(toast.error, 'Error al generar layout automático');
  }
}

// Validate page reduction
export function* validatePageReduction({ payload }) {
  try {
    const response = yield call(
      productionService.validatePageReduction,
      payload.editionId,
      payload.newPageCount
    );
    yield put({
      type: VALIDATE_PAGE_REDUCTION_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: VALIDATE_PAGE_REDUCTION_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al validar reducción de páginas',
        }),
      },
    });
  }
}

// Validate inventory reduction
export function* validateInventoryReduction({ payload }) {
  try {
    const response = yield call(
      productionService.validateInventoryReduction,
      payload.editionId,
      payload.newInventory
    );
    yield put({
      type: VALIDATE_INVENTORY_REDUCTION_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: VALIDATE_INVENTORY_REDUCTION_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al validar reducción de inventario',
        }),
      },
    });
  }
}

// Watchers
export function* watchFetchProductionItems() {}

export function* watchMoveItem() {}

export function* watchAddSlot() {}

export function* watchRemoveSlot() {}

export function* watchUpdateObservation() {}

export function* watchMarkAsEditorial() {}

export function* watchMarkAsCA() {}

export function* watchGenerateAutoLayout() {}

export function* watchValidatePageReduction() {}

export function* watchValidateInventoryReduction() {}

export default function* productionSaga() {
  yield all([
    takeLatest(FETCH_PRODUCTS_INIT, fetchProducts),
    takeLatest(FETCH_EDITIONS_INIT, fetchEditions),
    takeLatest(FETCH_PRODUCTION_ITEMS_INIT, fetchProductionItems),
    takeLatest(MOVE_ITEM_INIT, moveItem),
    takeLatest(ADD_SLOT_INIT, addSlot),
    takeLatest(REMOVE_SLOT_INIT, removeSlot),
    takeLatest(UPDATE_OBSERVATION_INIT, updateObservation),
    takeLatest(MARK_AS_EDITORIAL_INIT, markAsEditorial),
    takeLatest(MARK_AS_CA_INIT, markAsCA),
    takeLatest(GENERATE_AUTO_LAYOUT_INIT, generateAutoLayout),
    takeLatest(VALIDATE_PAGE_REDUCTION_INIT, validatePageReduction),
    takeLatest(VALIDATE_INVENTORY_REDUCTION_INIT, validateInventoryReduction),
  ]);
}
