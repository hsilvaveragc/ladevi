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
  FETCH_PRODUCTION_TEMPLATES_INIT,
  FETCH_PRODUCTION_TEMPLATES_SUCCESS,
  FETCH_PRODUCTION_TEMPLATES_FAILURE,
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
  VALIDATE_PAGE_REDUCTION_INIT,
  VALIDATE_PAGE_REDUCTION_SUCCESS,
  VALIDATE_PAGE_REDUCTION_FAILURE,
  VALIDATE_INVENTORY_REDUCTION_INIT,
  VALIDATE_INVENTORY_REDUCTION_SUCCESS,
  VALIDATE_INVENTORY_REDUCTION_FAILURE,
} from './actionTypes';

// Fetch products
export function* fetchProducts() {
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
    yield call(toast.error, 'Error al cargar productos');
  }
}

// Fetch editions
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
    yield call(toast.error, 'Error al cargar ediciones');
  }
}

// Fetch production templates (anteriormente production items)
export function* fetchProductionTemplates({ payload }) {
  try {
    const data = yield call(productionService.getProductionTemplates, payload);
    yield put({
      type: FETCH_PRODUCTION_TEMPLATES_SUCCESS,
      payload: {
        productionTemplates: data,
        editionId: payload,
      },
    });
  } catch (err) {
    yield put({
      type: FETCH_PRODUCTION_TEMPLATES_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al cargar plantillas de producción',
        }),
      },
    });
    yield call(toast.error, 'Error al cargar plantillas de producción');
  }
}

// Add slot
export function* addSlot(action) {
  try {
    const data = yield call(
      productionService.addSlot,
      action.payload.productionTemplateId,
      action.payload.inventoryAdvertisingSpaceId
    );
    yield put({
      type: ADD_SLOT_SUCCESS,
      payload: {
        productionTemplates: data.productionTemplates || data,
      },
    });
    yield call(toast.success, 'Slot agregado correctamente');
  } catch (err) {
    yield put({
      type: ADD_SLOT_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al agregar slot',
        }),
      },
    });
    yield call(toast.error, 'Error al agregar slot');
  }
}

// Remove slot
export function* removeSlot(action) {
  try {
    const data = yield call(
      productionService.removeSlot,
      action.payload.slotId
    );
    yield put({
      type: REMOVE_SLOT_SUCCESS,
      payload: {
        productionTemplates: data.productionTemplates || data,
      },
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

// Update slot observation (anteriormente update observation)
export function* updateSlotObservation(action) {
  try {
    const data = yield call(
      productionService.updateSlotObservation,
      action.payload.slotId,
      action.payload.observations
    );
    yield put({
      type: UPDATE_OBSERVATION_SUCCESS,
      payload: {
        productionTemplates: data.productionTemplates || data,
      },
    });
    yield call(toast.success, 'Observación actualizada');
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

// Mark slot as editorial (anteriormente mark as editorial)
export function* markSlotAsEditorial(action) {
  try {
    const data = yield call(
      productionService.markSlotAsEditorial,
      action.payload.slotId,
      action.payload.isEditorial
    );
    yield put({
      type: MARK_AS_EDITORIAL_SUCCESS,
      payload: {
        productionTemplates: data.productionTemplates || data,
      },
    });
    yield call(
      toast.success,
      action.payload.isEditorial
        ? 'Marcado como editorial'
        : 'Desmarcado como editorial'
    );
  } catch (err) {
    yield put({
      type: MARK_AS_EDITORIAL_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al marcar como editorial',
        }),
      },
    });
    yield call(toast.error, 'Error al marcar como editorial');
  }
}

// Mark slot as CA (anteriormente mark as CA)
export function* markSlotAsCA(action) {
  try {
    const data = yield call(
      productionService.markSlotAsCA,
      action.payload.slotId,
      action.payload.isCA
    );
    yield put({
      type: MARK_AS_CA_SUCCESS,
      payload: {
        productionTemplates: data.productionTemplates || data,
      },
    });
    yield call(
      toast.success,
      action.payload.isCA ? 'Marcado como CA' : 'Desmarcado como CA'
    );
  } catch (err) {
    yield put({
      type: MARK_AS_CA_FAILURE,
      errors: {
        ...(err.response?.data?.errors || {
          general: 'Error al marcar como CA',
        }),
      },
    });
    yield call(toast.error, 'Error al marcar como CA');
  }
}

// Validate page reduction
export function* validatePageReduction(action) {
  try {
    const data = yield call(
      productionService.validatePageReduction,
      action.payload.productEditionId,
      action.payload.newPageCount
    );
    yield put({
      type: VALIDATE_PAGE_REDUCTION_SUCCESS,
      payload: {
        validationResult: data,
      },
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
    yield call(toast.error, 'Error al validar reducción de páginas');
  }
}

// Validate inventory reduction
export function* validateInventoryReduction(action) {
  try {
    const data = yield call(
      productionService.validateInventoryReduction,
      action.payload.productEditionId,
      action.payload.inventoryChanges
    );
    yield put({
      type: VALIDATE_INVENTORY_REDUCTION_SUCCESS,
      payload: {
        validationResult: data,
      },
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
    yield call(toast.error, 'Error al validar reducción de inventario');
  }
}

// Root saga
export default function* productionSaga() {
  yield all([
    takeLatest(FETCH_PRODUCTS_INIT, fetchProducts),
    takeLatest(FETCH_EDITIONS_INIT, fetchEditions),
    takeLatest(FETCH_PRODUCTION_TEMPLATES_INIT, fetchProductionTemplates),
    takeLatest(ADD_SLOT_INIT, addSlot),
    takeLatest(REMOVE_SLOT_INIT, removeSlot),
    takeLatest(UPDATE_OBSERVATION_INIT, updateSlotObservation),
    takeLatest(MARK_AS_EDITORIAL_INIT, markSlotAsEditorial),
    takeLatest(MARK_AS_CA_INIT, markSlotAsCA),
    takeLatest(VALIDATE_PAGE_REDUCTION_INIT, validatePageReduction),
    takeLatest(VALIDATE_INVENTORY_REDUCTION_INIT, validateInventoryReduction),
  ]);
}
