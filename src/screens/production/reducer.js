import { createSelector } from "reselect";
import {
  SET_CLIENT_TYPE,
  SET_SELECTED_CURRENCY,
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
} from "./actionTypes";

const initialState = {
  // Datos generales
  loading: false,
  errors: {},

  // Filtros
  clientType: null,
  selectedCurrency: "",
  products: [],
  selectedProduct: null,
  editions: [],
  selectedEdition: null,
  availableClientsForEdition: [],
  // orders: [],
  // selectedOrder: null,

  productionItems: [],
  currentEditionId: null,
  totalPages: 0,
  validationResults: {
    pageReduction: null,
    inventoryReduction: null,
  },
};

export default function(state = initialState, action) {
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
    case SET_CLIENT_TYPE:
      return {
        ...state,
        clientType: action.payload,
        // Reset completo de todas las selecciones
        selectedProduct: null,
        selectedEdition: null,
        selectedCurrency: "",
        // Reset de datos cargados
        products: [],
        editions: [],
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
      };

    case SET_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
        // Reset data dependiente del producto
        selectedEdition: null,
        editions: [],
        selectedCurrency: "",
      };

    case FETCH_EDITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        editions: action.payload.editions,
      };

    case SET_SELECTED_EDITION:
      return {
        ...state,
        selectedEdition: action.payload,
        // Reset data dependiente de la edición
        selectedCurrency: "",
      };
    case SET_SELECTED_CURRENCY:
      return {
        ...state,
        selectedCurrency: action.payload,
      };
    case FETCH_PRODUCTION_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: action.payload.items,
        totalPages: action.payload.totalPages,
        errors: {},
      };

    // Move item
    case MOVE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        productionItems: state.productionItems.map(item =>
          item.id === action.payload.itemId
            ? { ...item, pageNumber: action.payload.newPageNumber }
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
          item => item.id !== action.payload.itemId
        ),
        errors: {},
      };

    // Update observation
    case UPDATE_OBSERVATION_SUCCESS:
      return {
        ...state,
        productionItems: state.productionItems.map(item =>
          item.id === action.payload.itemId
            ? { ...item, observacion: action.payload.observacion }
            : item
        ),
        errors: {},
      };

    // Mark as editorial
    case MARK_AS_EDITORIAL_SUCCESS:
      return {
        ...state,
        productionItems: state.productionItems.map(item =>
          item.id === action.payload.itemId
            ? { ...item, isEditorial: action.payload.isEditorial, isCA: false }
            : item
        ),
        errors: {},
      };

    // Mark as CA
    case MARK_AS_CA_SUCCESS:
      return {
        ...state,
        productionItems: state.productionItems.map(item =>
          item.id === action.payload.itemId
            ? { ...item, isCA: action.payload.isCA, isEditorial: false }
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
const getProductionReducer = state => state.production;

// Selectores básicos
export const getLoading = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.loading
);

export const getErrors = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.errors
);

// Selectores de selección
export const getClientType = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.clientType
);

export const getSelectedProduct = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.selectedProduct
);

export const getSelectedEdition = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.selectedEdition
);

export const getSelectedCurrency = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.selectedCurrency
);

export const getProducts = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.products
);

export const getEditions = createSelector(
  getProductionReducer,
  productionReducer => productionReducer.editions
);

// Selectors
export const getProductionItems = state => state.production.productionItems;
export const getCurrentEditionId = state => state.production.currentEditionId;
export const getTotalPages = state => state.production.totalPages;
export const getValidationResults = state => state.production.validationResults;
