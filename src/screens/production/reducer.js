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

const initialState = {
  // Datos generales
  loading: false,
  errors: {},

  // Filtros
  products: [],
  selectedProduct: null,
  editions: [],
  selectedEdition: null,

  productionItems: [],
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
    case FETCH_PRODUCTION_ITEMS_INIT:
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
        productionItems: [],
        currentEditionId: null,
      };

    // Products
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products || [],
        errors: {},
      };

    // Editions
    case FETCH_EDITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        editions: action.payload.editions || [],
        errors: {},
      };

    case SET_SELECTED_EDITION:
      return {
        ...state,
        selectedEdition: action.payload,
        productionItems: [],
        currentEditionId: action.payload?.id || null,
      };

    // Production Items - Estructura real del backend
    case FETCH_PRODUCTION_ITEMS_SUCCESS:
      const productionData = action.payload;
      // Calcular total de páginas desde los items recibidos
      const maxPageNumber =
        productionData && productionData.length > 0
          ? Math.max(...productionData.map((item) => item.PageNumber))
          : 0;

      return {
        ...state,
        loading: false,
        productionItems: productionData || [],
        totalPages: maxPageNumber,
        currentEditionId: state.selectedEdition?.id || state.currentEditionId,
        errors: {},
      };

    // Move item
    case MOVE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: state.productionItems.map((item) =>
          item.Id === action.payload.itemId
            ? {
                ...item,
                PageNumber: action.payload.targetPageNumber,
                Slot: action.payload.targetSlot,
              }
            : item
        ),
        errors: {},
      };

    // Add slot
    case ADD_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: [...state.productionItems, action.payload.newItem],
        errors: {},
      };

    // Remove slot
    case REMOVE_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: state.productionItems.filter(
          (item) => item.Id !== action.payload.itemId
        ),
        errors: {},
      };

    // Update observation
    case UPDATE_OBSERVATION_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: state.productionItems.map((item) =>
          item.Id === action.payload.itemId
            ? { ...item, Observations: action.payload.observations }
            : item
        ),
        errors: {},
      };

    // Mark as editorial
    case MARK_AS_EDITORIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: state.productionItems.map((item) =>
          item.Id === action.payload.itemId
            ? { ...item, IsEditorial: action.payload.isEditorial, IsCA: false }
            : item
        ),
        errors: {},
      };

    // Mark as CA
    case MARK_AS_CA_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: state.productionItems.map((item) =>
          item.Id === action.payload.itemId
            ? { ...item, IsCA: action.payload.isCA, IsEditorial: false }
            : item
        ),
        errors: {},
      };

    // Generate auto layout
    case GENERATE_AUTO_LAYOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: action.payload.items || action.payload,
        totalPages: action.payload.totalPages || state.totalPages,
        errors: {},
      };

    // Validate page reduction
    case VALIDATE_PAGE_REDUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        validationResults: {
          ...state.validationResults,
          pageReduction: action.payload,
        },
        errors: {},
      };

    // Validate inventory reduction
    case VALIDATE_INVENTORY_REDUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        validationResults: {
          ...state.validationResults,
          inventoryReduction: action.payload,
        },
        errors: {},
      };

    // Error states
    case FETCH_PRODUCTS_FAILURE:
    case FETCH_EDITIONS_FAILURE:
    case FETCH_PRODUCTION_ITEMS_FAILURE:
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
        errors: { ...action.errors },
      };

    default:
      return state;
  }
}

// Selectores
const getProductionReducer = (state) => state.production;

// Selectores básicos
export const getLoading = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.loading
);

export const getErrors = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.errors
);

// Selectores de datos
export const getProducts = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.products
);

export const getEditions = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.editions
);

export const getSelectedProduct = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.selectedProduct
);

export const getSelectedEdition = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.selectedEdition
);

export const getProductionItems = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.productionItems
);

export const getCurrentEditionId = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.currentEditionId
);

export const getTotalPages = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.totalPages
);

export const getValidationResults = createSelector(
  getProductionReducer,
  (productionReducer) => productionReducer.validationResults
);

// Selector para agrupar items por página (helper para el componente)
export const getProductionItemsByPage = createSelector(
  [getProductionItems],
  (items) => {
    const itemsByPage = {};

    items.forEach((item) => {
      const pageNumber = item.PageNumber;
      if (!itemsByPage[pageNumber]) {
        itemsByPage[pageNumber] = [];
      }
      itemsByPage[pageNumber].push(item);
    });

    // Ordenar items dentro de cada página por Slot
    Object.keys(itemsByPage).forEach((pageNumber) => {
      itemsByPage[pageNumber].sort((a, b) => a.Slot - b.Slot);
    });

    return itemsByPage;
  }
);

// Selector para verificar si un item está asignado (tiene PublishingOrderId)
export const getAssignedItems = createSelector([getProductionItems], (items) =>
  items.filter((item) => item.PublishingOrderId > 0)
);

// Selector para obtener items disponibles (sin asignar)
export const getAvailableItems = createSelector([getProductionItems], (items) =>
  items.filter((item) => item.Id === 0 || item.PublishingOrderId === 0)
);
