import { createSelector } from "reselect";
import {
  FETCH_INVOICES_INIT,
  FETCH_INVOICES_SUCCESS,
  FETCH_INVOICES_FAILURE,
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
  FETCH_XUBIO_PRODUCTS_INIT,
  FETCH_XUBIO_PRODUCTS_SUCCESS,
  FETCH_XUBIO_PRODUCTS_FAILURE,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  SHOW_CONTRACT_DIALOG,
  HIDE_CONTRACT_DIALOG,
  SHOW_ORDER_DIALOG,
  HIDE_ORDER_DIALOG,
  SHOW_INVOICE_DIALOG,
  HIDE_INVOICE_DIALOG,
  SEND_TO_XUBIO_INIT,
  SEND_TO_XUBIO_SUCCESS,
  SEND_TO_XUBIO_FAILURE,
  FILTER_CONTRACTS_INIT,
  FILTER_CONTRACTS_SUCCESS,
  FILTER_CONTRACTS_FAILURE,
  FILTER_ORDERS_INIT,
  FILTER_ORDERS_SUCCESS,
  FILTER_ORDERS_FAILURE,
  UPDATE_CART_ITEM,
  SHOW_CONTRACT_DIALOG_FOR_EDIT,
} from "./actionTypes.js";

const initialState = {
  // Datos generales
  loading: false,
  errors: {},

  // Datos cargados
  xubioProducts: [],
  xubioComturProducts: [],
  clients: [],
  contracts: [],
  orders: [],

  // Datos de selección
  clientType: null, // 'ARGENTINA' o 'COMTUR'
  selectedClient: null,
  entityType: null, // 'CONTRACTS' o 'ORDERS'
  selectedCurrency: "", // Filtro de moneda

  // Estado del carrito
  cartItems: [],

  // Estado de modales
  showContractDialog: false,
  selectedContract: null,
  showOrderDialog: false,
  selectedOrder: null,
  showInvoiceDialog: false,

  // Filtros activos
  contractFilters: {},
  orderFilters: {},

  // Resultados
  invoiceResult: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    // Loading states
    case INITIAL_LOAD_INIT:
    case FETCH_INVOICES_INIT:
    case FETCH_CLIENTS_INIT:
    case FETCH_CONTRACTS_INIT:
    case FETCH_ORDERS_INIT:
    case FETCH_XUBIO_PRODUCTS_INIT:
    case SEND_TO_XUBIO_INIT:
    case FILTER_CONTRACTS_INIT:
    case FILTER_ORDERS_INIT:
      return {
        ...state,
        loading: true,
        errors: {},
      };

    // Success states
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        xubioProducts: action.payload.xubioProducts || [],
        xubioComturProducts: action.payload.xubioComturProducts || [],
      };

    case FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        clients: action.payload.clients,
      };

    case FETCH_CONTRACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contracts: action.payload.contracts,
      };

    case FILTER_CONTRACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contracts: action.payload.contracts,
      };

    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
      };

    case FILTER_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
      };

    case FETCH_XUBIO_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        xubioProducts: action.payload.xubioProducts || [],
        xubioComturProducts: action.payload.xubioComturProducts || [],
      };

    case SEND_TO_XUBIO_SUCCESS:
      return {
        ...state,
        loading: false,
        invoiceResult: action.payload.result,
        cartItems: [], // Limpiamos el carrito después de facturar
      };

    // Error states
    case INITIAL_LOAD_FAILURE:
    case FETCH_INVOICES_FAILURE:
    case FETCH_CLIENTS_FAILURE:
    case FETCH_CONTRACTS_FAILURE:
    case FETCH_ORDERS_FAILURE:
    case FETCH_XUBIO_PRODUCTS_FAILURE:
    case SEND_TO_XUBIO_FAILURE:
    case FILTER_CONTRACTS_FAILURE:
    case FILTER_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        errors: { ...action.errors },
      };

    // Selección de tipo de cliente, cliente y tipo de entidad
    case SET_CLIENT_TYPE:
      return {
        ...state,
        clientType: action.payload,
        selectedClient: null,
        entityType: null,
        contracts: [],
        orders: [],
        cartItems: [],
        selectedCurrency: "", // Resetear moneda seleccionada
      };

    case SELECT_CLIENT:
      return {
        ...state,
        selectedClient: action.payload,
        entityType: null,
        contracts: [],
        orders: [],
        cartItems: [],
        selectedCurrency: "", // Resetear moneda seleccionada
      };

    case SET_ENTITY_TYPE:
      return {
        ...state,
        entityType: action.payload,
        contracts: action.payload === "CONTRACTS" ? state.contracts : [],
        orders: action.payload === "ORDERS" ? state.orders : [],
        cartItems: [],
        selectedCurrency: "", // Resetear moneda seleccionada
      };

    case SET_SELECTED_CURRENCY:
      return {
        ...state,
        selectedCurrency: action.payload,
        cartItems: [], // Limpiamos el carrito cuando cambia la moneda
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
    case SHOW_CONTRACT_DIALOG:
      return {
        ...state,
        showContractDialog: true,
        selectedContract: action.payload,
      };

    case HIDE_CONTRACT_DIALOG:
      return {
        ...state,
        showContractDialog: false,
        selectedContract: null,
        contractDialogEditMode: false,
      };

    case SHOW_ORDER_DIALOG:
      return {
        ...state,
        showOrderDialog: true,
        selectedOrder: action.payload,
      };

    case HIDE_ORDER_DIALOG:
      return {
        ...state,
        showOrderDialog: false,
        selectedOrder: null,
      };

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

    case UPDATE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.itemId
            ? { ...action.payload.updatedItem }
            : item
        ),
      };

    case SHOW_CONTRACT_DIALOG_FOR_EDIT:
      return {
        ...state,
        showContractDialog: true,
        selectedContract: action.payload.contract,
        contractDialogEditMode: action.payload.editMode,
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

export const getSelectedClient = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedClient
);

export const getEntityType = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.entityType
);

export const getSelectedCurrency = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedCurrency
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

export const getOrders = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.orders
);

// Selector para obtener los contratos filtrados por moneda
export const getContractsFilteredByCurrency = createSelector(
  [getContracts, getSelectedCurrency],
  (contracts, selectedCurrency) => {
    if (!Array.isArray(contracts) || contracts.length === 0) {
      return [];
    }

    if (!selectedCurrency) {
      return contracts; // Podríamos mostrar todos los contratos si no hay moneda seleccionada
    }

    return contracts.filter(
      contract => contract.currencyName === selectedCurrency
    );
  }
);

// Selector para obtener las órdenes filtradas por moneda
export const getOrdersFilteredByCurrency = createSelector(
  [getOrders, getSelectedCurrency],
  (orders, selectedCurrency) => {
    if (!selectedCurrency) return []; // Si no hay moneda seleccionada, no mostrar órdenes
    return orders.filter(order => order.currencyName === selectedCurrency);
  }
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
    if (clientType === "COMTUR") {
      return comturProducts;
    }
    return argentinaProducts;
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
export const getShowContractDialog = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.showContractDialog
);

export const getSelectedContract = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedContract
);

export const getShowOrderDialog = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.showOrderDialog
);

export const getSelectedOrder = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.selectedOrder
);

export const getShowInvoiceDialog = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.showInvoiceDialog
);

// Selector de resultado
export const getInvoiceResult = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.invoiceResult
);

// Selector para obtener el ítem del carrito correspondiente a un contrato específico
export const getCartItemByContractId = createSelector(
  [getCartItems, (state, contractId) => contractId],
  (cartItems, contractId) => {
    return cartItems.find(
      item => item.type === "CONTRACT" && item.contractId === contractId
    );
  }
);

// Selector para verificar si un ítem específico está en el carrito
export const isItemInCart = createSelector(
  [getCartItems, (state, itemId, contractId) => ({ itemId, contractId })],
  (cartItems, { itemId, contractId }) => {
    return cartItems.some(
      item =>
        item.type === "CONTRACT" &&
        item.contractId === contractId &&
        item.items.some(subItem => subItem.id === itemId)
    );
  }
);

export const getContractDialogEditMode = createSelector(
  getBillingReducer,
  billingReducer => billingReducer.contractDialogEditMode
);
