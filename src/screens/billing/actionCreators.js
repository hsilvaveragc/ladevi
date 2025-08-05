import {
  FETCH_INVOICES_INIT,
  INITIAL_LOAD_INIT,
  SET_CLIENT_TYPE,
  SELECT_CLIENT,
  SET_ENTITY_TYPE,
  SET_SELECTED_CURRENCY,
  FETCH_CLIENTS_INIT,
  FETCH_CONTRACTS_INIT,
  FETCH_ORDERS_INIT,
  FETCH_XUBIO_PRODUCTS_INIT,
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
  FILTER_CONTRACTS_INIT,
  FILTER_ORDERS_INIT,
  UPDATE_CART_ITEM,
  SHOW_CONTRACT_DIALOG_FOR_EDIT,
  // Nuevas acciones
  FETCH_PRODUCTS_INIT,
  FETCH_EDITIONS_INIT,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_EDITION,
  FETCH_VENDORS_INIT,
  FETCH_CLIENTS_FROM_EDITION_INIT,
  SEND_MULTIPLE_TO_XUBIO_INIT,
} from "./actionTypes.js";

// Acciones existentes
export const initialLoad = () => ({
  type: INITIAL_LOAD_INIT,
});

export const fetchInvoicesInit = () => ({
  type: FETCH_INVOICES_INIT,
});

export const setClientType = clientType => ({
  type: SET_CLIENT_TYPE,
  payload: clientType, // 'ARGENTINA' o 'COMTUR'
});

export const selectClient = client => ({
  type: SELECT_CLIENT,
  payload: client,
});

export const setEntityType = entityType => ({
  type: SET_ENTITY_TYPE,
  payload: entityType, // 'CONTRACTS' o 'EDITIONS'
});

export const setSelectedCurrency = currency => ({
  type: SET_SELECTED_CURRENCY,
  payload: currency,
});

export const fetchClientsInit = clientType => ({
  type: FETCH_CLIENTS_INIT,
  payload: clientType,
});

export const fetchContractsInit = clientId => ({
  type: FETCH_CONTRACTS_INIT,
  payload: clientId,
});

export const fetchOrdersInit = payload => ({
  type: FETCH_ORDERS_INIT,
  payload, // Puede ser clientId o { editionId }
});

export const fetchXubioProductsInit = () => ({
  type: FETCH_XUBIO_PRODUCTS_INIT,
});

// NUEVAS ACCIONES PARA EDICIONES
export const fetchProductsInit = clientType => ({
  type: FETCH_PRODUCTS_INIT,
  payload: clientType,
});

export const fetchEditionsInit = (productId, isComturClient) => ({
  type: FETCH_EDITIONS_INIT,
  payload: productId,
});

export const setSelectedProduct = productId => ({
  type: SET_SELECTED_PRODUCT,
  payload: productId,
});

export const setSelectedEdition = editionId => ({
  type: SET_SELECTED_EDITION,
  payload: editionId,
});

export const fetchVendorsInit = () => ({
  type: FETCH_VENDORS_INIT,
});

export const fetchClientsFromEditionInit = editionId => ({
  type: FETCH_CLIENTS_FROM_EDITION_INIT,
  payload: editionId,
});

// Gestión del carrito
export const addToCart = item => ({
  type: ADD_TO_CART,
  payload: item,
});

export const removeFromCart = itemId => ({
  type: REMOVE_FROM_CART,
  payload: itemId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const updateCartItem = (itemId, updatedItem) => ({
  type: UPDATE_CART_ITEM,
  payload: {
    itemId,
    updatedItem,
  },
});

// Diálogos
export const showContractDialog = contract => ({
  type: SHOW_CONTRACT_DIALOG,
  payload: contract,
});

export const hideContractDialog = () => ({
  type: HIDE_CONTRACT_DIALOG,
});

export const showOrderDialog = order => ({
  type: SHOW_ORDER_DIALOG,
  payload: order,
});

export const hideOrderDialog = () => ({
  type: HIDE_ORDER_DIALOG,
});

export const showInvoiceDialog = () => ({
  type: SHOW_INVOICE_DIALOG,
});

export const hideInvoiceDialog = () => ({
  type: HIDE_INVOICE_DIALOG,
});

export const showContractDialogForEdit = (contract, editMode = false) => ({
  type: SHOW_CONTRACT_DIALOG_FOR_EDIT,
  payload: {
    contract,
    editMode,
  },
});

// Envío a Xubio
export const sendToXubioInit = invoiceData => ({
  type: SEND_TO_XUBIO_INIT,
  payload: invoiceData,
});

// NUEVA: Envío múltiple a Xubio
export const sendMultipleToXubioInit = invoicesData => ({
  type: SEND_MULTIPLE_TO_XUBIO_INIT,
  payload: invoicesData,
});

// Filtros
export const filterContractsInit = filters => ({
  type: FILTER_CONTRACTS_INIT,
  payload: filters,
});

export const filterOrdersInit = filters => ({
  type: FILTER_ORDERS_INIT,
  payload: filters,
});
