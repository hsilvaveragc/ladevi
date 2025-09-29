import {
  INITIAL_LOAD_INIT,
  SET_CLIENT_TYPE,
  SELECT_CLIENT,
  SET_ENTITY_TYPE,
  SET_SELECTED_CURRENCY,
  FETCH_CLIENTS_INIT,
  FETCH_CONTRACTS_INIT,
  FETCH_ORDERS_INIT,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  SHOW_INVOICE_DIALOG,
  HIDE_INVOICE_DIALOG,
  SEND_TO_XUBIO_INIT,
  FETCH_PRODUCTS_INIT,
  FETCH_EDITIONS_INIT,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_EDITION,
  SEND_MULTIPLE_TO_XUBIO_INIT,
} from './actionTypes.js';

export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const setClientType = (clientType) => ({
  type: SET_CLIENT_TYPE,
  payload: clientType,
});

export const setEntityType = (entityType) => ({
  type: SET_ENTITY_TYPE,
  payload: entityType,
});

// Flujo de Contratos
export const fetchClientsInit = (clientType) => ({
  type: FETCH_CLIENTS_INIT,
  payload: clientType,
});

export const selectClient = (client) => ({
  type: SELECT_CLIENT,
  payload: client,
});

export const fetchContractsInit = (clientId) => ({
  type: FETCH_CONTRACTS_INIT,
  payload: clientId,
});

// Flujo de Órdenes
export const fetchProductsInit = (clientType) => ({
  type: FETCH_PRODUCTS_INIT,
  payload: clientType,
});

export const setSelectedProduct = (productId) => ({
  type: SET_SELECTED_PRODUCT,
  payload: productId,
});

export const fetchEditionsInit = (productId, isComturClient) => ({
  type: FETCH_EDITIONS_INIT,
  payload: productId,
});

export const setSelectedEdition = (editionId) => ({
  type: SET_SELECTED_EDITION,
  payload: editionId,
});

export const fetchOrdersInit = (payload) => ({
  type: FETCH_ORDERS_INIT,
  payload,
});

//Filtro compartido entre contratos y órdenes
export const setSelectedCurrency = (currency) => ({
  type: SET_SELECTED_CURRENCY,
  payload: currency,
});

// Gestión del carrito
export const addToCart = (item) => ({
  type: ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (itemId) => ({
  type: REMOVE_FROM_CART,
  payload: itemId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

// Diálogos
export const showInvoiceDialog = () => ({
  type: SHOW_INVOICE_DIALOG,
});

export const hideInvoiceDialog = () => ({
  type: HIDE_INVOICE_DIALOG,
});

// Envío a Xubio
export const sendToXubioInit = (invoiceData) => ({
  type: SEND_TO_XUBIO_INIT,
  payload: invoiceData,
});

// Envío múltiple a Xubio
export const sendMultipleToXubioInit = (invoicesData) => ({
  type: SEND_MULTIPLE_TO_XUBIO_INIT,
  payload: invoicesData,
});
