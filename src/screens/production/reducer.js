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
  currentEditionId: null,
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
    case MOVE_ITEM_INIT:
    case ADD_SLOT_INIT:
    case REMOVE_SLOT_INIT:
    case UPDATE_OBSERVATION_INIT:
    case MARK_AS_EDITORIAL_INIT:
    case MARK_AS_CA_INIT:
    case GENERATE_AUTO_LAYOUT_INIT:
    case VALIDATE_PAGE_REDUCTION_INIT:
    case VALIDATE_INVENTORY_REDUCTION_INIT:
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
        productionTemplates: action.payload.productionTemplates,
        currentEditionId: action.payload.editionId,
        totalPages: action.payload.productionTemplates.length,
        errors: {},
      };

    case MOVE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates,
        errors: {},
      };

    case ADD_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates,
        errors: {},
      };

    case REMOVE_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates,
        errors: {},
      };

    case UPDATE_OBSERVATION_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates,
        errors: {},
      };

    case MARK_AS_EDITORIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates,
        errors: {},
      };

    case MARK_AS_CA_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates,
        errors: {},
      };

    case GENERATE_AUTO_LAYOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        productionTemplates: action.payload.productionTemplates,
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
    case MOVE_ITEM_FAILURE:
    case ADD_SLOT_FAILURE:
    case REMOVE_SLOT_FAILURE:
    case UPDATE_OBSERVATION_FAILURE:
    case MARK_AS_EDITORIAL_FAILURE:
    case MARK_AS_CA_FAILURE:
    case GENERATE_AUTO_LAYOUT_FAILURE:
    case VALIDATE_PAGE_REDUCTION_FAILURE:
    case VALIDATE_INVENTORY_REDUCTION_FAILURE:
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

export const getCurrentEditionId = createSelector(
  [getProductionState],
  (production) => production.currentEditionId
);

export const getTotalPages = createSelector(
  [getProductionState],
  (production) => production.totalPages
);

export const getValidationResults = createSelector(
  [getProductionState],
  (production) => production.validationResults
);

// Selectores avanzados
export const getProductionTemplatesByPage = createSelector(
  [getProductionTemplates],
  (templates) => {
    const templatesByPage = {};
    templates.forEach((template) => {
      templatesByPage[template.pageNumber] = template;
    });
    return templatesByPage;
  }
);

export const getTotalSlots = createSelector(
  [getProductionTemplates],
  (templates) => {
    return templates.reduce((total, template) => {
      return total + template.productionSlots.length;
    }, 0);
  }
);

export const getAssignedSlots = createSelector(
  [getProductionTemplates],
  (templates) => {
    const assignedSlots = [];
    templates.forEach((template) => {
      template.productionSlots.forEach((slot) => {
        if (slot.publishingOrderId) {
          assignedSlots.push(slot);
        }
      });
    });
    return assignedSlots;
  }
);

export const getAvailableSlots = createSelector(
  [getProductionTemplates],
  (templates) => {
    const availableSlots = [];
    templates.forEach((template) => {
      template.productionSlots.forEach((slot) => {
        if (!slot.publishingOrderId) {
          availableSlots.push(slot);
        }
      });
    });
    return availableSlots;
  }
);

export const getSlotsByPage = createSelector(
  [getProductionTemplates],
  (templates) => {
    const slotsByPage = {};
    templates.forEach((template) => {
      slotsByPage[template.pageNumber] = template.productionSlots;
    });
    return slotsByPage;
  }
);
