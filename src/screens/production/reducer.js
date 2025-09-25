import { createSelector } from 'reselect';

import {
  FETCH_PRODUCTS_INIT,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_EDITIONS_INIT,
  FETCH_EDITIONS_SUCCESS,
  FETCH_EDITIONS_FAILURE,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_EDITION,
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
  MOVE_PUBLISHING_ORDER_BETWEEN_SLOTS_INIT,
  MOVE_PUBLISHING_ORDER_BETWEEN_SLOTS_SUCCESS,
  MOVE_PUBLISHING_ORDER_BETWEEN_SLOTS_FAILURE,
} from './actionTypes';

const initialState = {
  // Datos generales
  loading: false,
  errors: {},

  // Filtros
  products: [],
  selectedProduct: null,
  editions: [],
  selectedEdition: null,

  productionTemplates: [],
  totalPages: 0,
  validationResults: {
    pageReduction: null,
    inventoryReduction: null,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    // Loading states
    case FETCH_PRODUCTS_INIT:
    case FETCH_EDITIONS_INIT:
    case FETCH_PRODUCTION_TEMPLATES_INIT:
    case ADD_SLOT_INIT:
    case REMOVE_SLOT_INIT:
    case UPDATE_OBSERVATION_INIT:
    case MARK_AS_EDITORIAL_INIT:
    case MARK_AS_CA_INIT:
    case VALIDATE_PAGE_REDUCTION_INIT:
    case VALIDATE_INVENTORY_REDUCTION_INIT:
    case MOVE_PUBLISHING_ORDER_BETWEEN_SLOTS_INIT:
      return {
        ...state,
        loading: true,
        errors: {},
      };

    case SET_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
        selectedEdition: null,
        editions: [],
      };

    case SET_SELECTED_EDITION:
      return {
        ...state,
        selectedEdition: action.payload,
      };

    // Success states
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        errors: {},
      };

    case FETCH_EDITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        editions: action.payload.editions,
        errors: {},
      };

    case FETCH_PRODUCTION_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates || [],
        totalPages: action.payload.productionTemplates?.length ?? 0,
        errors: {},
      };

    case ADD_SLOT_SUCCESS:
    case REMOVE_SLOT_SUCCESS:
    case UPDATE_OBSERVATION_SUCCESS:
    case MARK_AS_EDITORIAL_SUCCESS:
    case MARK_AS_CA_SUCCESS:
    case MOVE_PUBLISHING_ORDER_BETWEEN_SLOTS_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload,
        errors: {},
      };

    case VALIDATE_PAGE_REDUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        validationResults: {
          ...state.validationResults,
          pageReduction: action.payload.validationResult,
        },
        errors: {},
      };

    case VALIDATE_INVENTORY_REDUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        validationResults: {
          ...state.validationResults,
          inventoryReduction: action.payload.validationResult,
        },
        errors: {},
      };

    // Failure states
    case FETCH_PRODUCTS_FAILURE:
    case FETCH_EDITIONS_FAILURE:
    case FETCH_PRODUCTION_TEMPLATES_FAILURE:
    case ADD_SLOT_FAILURE:
    case REMOVE_SLOT_FAILURE:
    case UPDATE_OBSERVATION_FAILURE:
    case MARK_AS_EDITORIAL_FAILURE:
    case MARK_AS_CA_FAILURE:
    case VALIDATE_PAGE_REDUCTION_FAILURE:
    case VALIDATE_INVENTORY_REDUCTION_FAILURE:
    case MOVE_PUBLISHING_ORDER_BETWEEN_SLOTS_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.errors,
      };

    default:
      return state;
  }
}

// Selectores básicos
const getProductionState = (state) => state.production;

export const getLoading = createSelector(
  [getProductionState],
  (production) => production.loading
);

export const getErrors = createSelector(
  [getProductionState],
  (production) => production.errors
);

export const getProducts = createSelector(
  [getProductionState],
  (production) => production.products
);

export const getSelectedProduct = createSelector(
  [getProductionState],
  (production) => production.selectedProduct
);

export const getEditions = createSelector(
  [getProductionState],
  (production) => production.editions
);

export const getSelectedEdition = createSelector(
  [getProductionState],
  (production) => production.selectedEdition
);

export const getProductionTemplates = createSelector(
  [getProductionState],
  (production) => production.productionTemplates
);

export const getTotalPages = createSelector(
  [getProductionState],
  (production) => production.totalPages
);

export const getValidationResults = createSelector(
  [getProductionState],
  (production) => production.validationResults
);

// Selectores avanzados adaptados a la estructura real ProductionTemplateDto
export const getProductionTemplatesByPage = createSelector(
  [getProductionTemplates],
  (productionTemplates) => {
    // ✅ Corregido: productionTemplates es directamente el array
    const templatesByPage = {};
    productionTemplates.forEach((template) => {
      templatesByPage[template.pageNumber] = template;
    });
    return templatesByPage;
  }
);

export const getTotalSlots = createSelector(
  [getProductionTemplates],
  (productionTemplates) => {
    // ✅ Corregido: productionTemplates es directamente el array
    return (
      productionTemplates?.reduce((total, template) => {
        return (
          total +
          (template.productionSlots ? template.productionSlots.length : 0)
        );
      }, 0) ?? 0
    );
  }
);

export const getAssignedSlots = createSelector(
  [getProductionTemplates],
  (productionTemplates) => {
    // ✅ Corregido: productionTemplates es directamente el array
    const assignedSlots = [];
    productionTemplates.forEach((template) => {
      if (template.productionSlots) {
        template.productionSlots.forEach((slot) => {
          if (slot.order && slot.order.id) {
            assignedSlots.push(slot);
          }
        });
      }
    });
    return assignedSlots;
  }
);

export const getAvailableSlots = createSelector(
  [getProductionTemplates],
  (productionTemplates) => {
    // ✅ Corregido: productionTemplates es directamente el array
    const availableSlots = [];
    productionTemplates.forEach((template) => {
      if (template.productionSlots) {
        template.productionSlots.forEach((slot) => {
          if (!slot.order || !slot.order.id) {
            availableSlots.push(slot);
          }
        });
      }
    });
    return availableSlots;
  }
);

export const getSlotsByPage = createSelector(
  [getProductionTemplates],
  (productionTemplates) => {
    // ✅ Corregido: productionTemplates es directamente el array
    const slotsByPage = {};
    productionTemplates.forEach((template) => {
      slotsByPage[template.pageNumber] = template.productionSlots || [];
    });
    return slotsByPage;
  }
);
