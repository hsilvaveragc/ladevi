import { createSelector } from "reselect";
import { CONSTANTS } from "./constants";
import {
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  SET_CLIENT_TYPE,
  SELECT_CLIENT,
  SET_ENTITY_TYPE,
  SET_SELECTED_CURRENCY,
  FETCH_CLIENTS_INIT,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILURE,
  FETCH_CONTRACTS_INIT,
  FETCH_CONTRACTS_SUCCESS,
  FETCH_CONTRACTS_FAILURE,
  FETCH_ORDERS_INIT,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  SHOW_INVOICE_DIALOG,
  HIDE_INVOICE_DIALOG,
  SEND_TO_XUBIO_INIT,
  SEND_TO_XUBIO_SUCCESS,
  SEND_TO_XUBIO_FAILURE,
  FETCH_PRODUCTS_INIT,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_EDITIONS_INIT,
  FETCH_EDITIONS_SUCCESS,
  FETCH_EDITIONS_FAILURE,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_EDITION,
  SEND_MULTIPLE_TO_XUBIO_INIT,
  SEND_MULTIPLE_TO_XUBIO_SUCCESS,
  SEND_MULTIPLE_TO_XUBIO_FAILURE,
} from "./actionTypes.js";

const initialState = {
  // Datos generales
  loading: false,
  errors: {},

  // Datos cargados al inicio
  xubioProducts: [],
  xubioComturProducts: [],
  xubioGenericProduct: null,
  xubioComturGenericProduct: null,
  clientType: null,
  entityType: null,

  // Filtros compartidos
  selectedCurrency: "",

  // Filtros de contrato
  clients: [],
  selectedClient: null,
  contracts: [],
  selectedContract: null,

  //Filtros de ordenes
  products: [],
  selectedProduct: null,
  editions: [],
  selectedEdition: null,
  availableClientsForEdition: [],
  orders: [],
  selectedOrder: null,

  // Estado del carrito
  cartItems: [],

  // Estado de modales
  showInvoiceDialog: false,

  // Resultado de facturación
  invoiceResult: null,
  multipleInvoiceResults: null, // NUEVO
};

export default function(state = initialState, action) {
  switch (action.type) {
    // Loading states
    case INITIAL_LOAD_INIT:
    case FETCH_CLIENTS_INIT:
    case FETCH_CONTRACTS_INIT:
    case FETCH_PRODUCTS_INIT:
    case FETCH_EDITIONS_INIT:
    case FETCH_ORDERS_INIT:
    case SEND_TO_XUBIO_INIT:
    case SEND_MULTIPLE_TO_XUBIO_INIT:
      return {
        ...state,
        loading: true,
        errors: {},
      };

    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        xubioProducts: action.payload.xubioProducts || [],
        xubioComturProducts: action.payload.xubioComturProducts || [],
        xubioGenericProduct: action.payload.xubioGenericProduct || null,
        xubioComturGenericProduct:
          action.payload.xubioComturGenericProduct || null,
      };

    case SET_CLIENT_TYPE:
      return {
        ...state,
        clientType: action.payload,
        // Reset completo de todas las selecciones
        entityType: null,
        selectedClient: null,
        selectedProduct: null,
        selectedEdition: null,
        selectedCurrency: "",
        // Reset de datos cargados
        clients: [],
        contracts: [],
        products: [],
        editions: [],
        orders: [],
        cartItems: [],
      };

    case SET_ENTITY_TYPE:
      return {
        ...state,
        entityType: action.payload,
        // Reset datos que dependan del tipo de entidad
        contracts:
          action.payload === CONSTANTS.CONTRACTS_CODE ? state.contracts : [],
        orders: action.payload === CONSTANTS.ORDERS_CODE ? state.orders : [],
        cartItems: [],
        selectedCurrency: "",
        // Reset específico para cada tipo
        ...(action.payload === CONSTANTS.CONTRACTS_CODE
          ? {
              // Si cambia a contratos, limpio datos de ediciones
              products: [],
              editions: [],
              selectedProduct: null,
              selectedEdition: null,
            }
          : action.payload === CONSTANTS.ORDERS_CODE
          ? {
              // Si cambia a ediciones, limpio datos de contratos
              selectedClient: null,
              contracts: [],
            }
          : {}),
      };

    // Flujo de Contratos
    case FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        clients: action.payload.clients,
      };

    case SELECT_CLIENT:
      return {
        ...state,
        selectedClient: action.payload,
        // Reset data dependientes del cliente
        contracts: [],
        cartItems: [],
        selectedCurrency: "",
      };

    case FETCH_CONTRACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contracts: action.payload.contracts,
      };

    // Flujo de Órdenes
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
        orders: [],
        cartItems: [],
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
        orders: [],
        cartItems: [],
        selectedCurrency: "",
      };

    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
      };

    // Filtro compartido entre contratos y órdenes
    case SET_SELECTED_CURRENCY:
      return {
        ...state,
        selectedCurrency: action.payload,
        cartItems: [], // Limpiamos el carrito cuando cambia la moneda
      };

    // Envío a Xubio
    case SEND_TO_XUBIO_SUCCESS:
      return {
        ...state,
        loading: false,
        invoiceResult: action.payload.result,
        cartItems: [], // Limpiamos el carrito después de facturar
      };

    case SEND_MULTIPLE_TO_XUBIO_SUCCESS:
      return {
        ...state,
        loading: false,
        multipleInvoiceResults: action.payload.results,
        cartItems: [], // Limpiamos el carrito después de facturar
      };

    // Manejo del carrito
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    // Manejo de modales
    case SHOW_INVOICE_DIALOG:
      return {
        ...state,
        showInvoiceDialog: true,
      };

    case HIDE_INVOICE_DIALOG:
      return {
        ...state,
        showInvoiceDialog: false,
      };

    // Error states
    case INITIAL_LOAD_FAILURE:
    case FETCH_CLIENTS_FAILURE:
    case FETCH_CONTRACTS_FAILURE:
    case FETCH_PRODUCTS_FAILURE:
    case FETCH_EDITIONS_FAILURE:
    case FETCH_ORDERS_FAILURE:
    case SEND_TO_XUBIO_FAILURE:
    case SEND_MULTIPLE_TO_XUBIO_FAILURE:
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
const getBillingReducer = state => state.billing;

// Selectores básicos
export const getLoading = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.loading
);

export const getErrors = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.errors
);

// Selectores de selección
export const getClientType = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.clientType
);

export const getEntityType = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.entityType
);

export const getSelectedClient = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedClient
);

export const getSelectedProduct = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedProduct
);

export const getSelectedEdition = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedEdition
);

export const getSelectedCurrency = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedCurrency
);

export const getSelectedContract = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedContract
);

export const getSelectedOrder = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedOrder
);

// Selectores de datos
export const getClients = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.clients
);

export const getContracts = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.contracts
);

export const getProducts = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.products
);

export const getEditions = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.editions
);

export const getOrders = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.orders
);

// Selectores de productos Xubio
export const getXubioProducts = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.xubioProducts
);

export const getXubioComturProducts = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.xubioComturProducts
);

// Selector para obtener los productos correctos según el tipo de cliente
export const getCurrentXubioProducts = createSelector(
  [getXubioProducts, getXubioComturProducts, getClientType],
  (argentinaProducts, comturProducts, clientType) => {
    if (clientType === CONSTANTS.COMTUR_CODE) {
      return comturProducts;
    }
    return argentinaProducts;
  }
);

// Selectores del producto xubio generico
export const getGenericXubioProduct = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.xubioGenericProduct
);

export const getXubioComturGenericProduct = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.xubioComturGenericProduct
);

// Selector para obtener el producto xubio generico según el tipo de cliente
export const getCurrentXubioGenericProduct = createSelector(
  [getGenericXubioProduct, getXubioComturGenericProduct, getClientType],
  (argentinaGenericProduct, comturGenericProduct, clientType) => {
    if (clientType === CONSTANTS.COMTUR_CODE) {
      return comturGenericProduct;
    }
    return argentinaGenericProduct;
  }
);

// Selectores de carrito
export const getCartItems = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.cartItems
);

export const getCartTotal = createSelector(
  getCartItems,
  cartItems => cartItems.reduce((total, item) => total + item.amount, 0)
);

// Selectores de modales
export const getShowInvoiceDialog = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.showInvoiceDialog
);
