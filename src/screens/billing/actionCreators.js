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
} from "./actionTypes.js";

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
  payload: entityType, // 'CONTRACTS' o 'ORDERS'
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

export const fetchOrdersInit = clientId => ({
  type: FETCH_ORDERS_INIT,
  payload: clientId,
});

export const fetchXubioProductsInit = () => ({
  type: FETCH_XUBIO_PRODUCTS_INIT,
});

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

export const sendToXubioInit = invoiceData => ({
  type: SEND_TO_XUBIO_INIT,
  payload: invoiceData,
});

export const filterContractsInit = filters => ({
  type: FILTER_CONTRACTS_INIT,
  payload: filters,
});

export const filterOrdersInit = filters => ({
  type: FILTER_ORDERS_INIT,
  payload: filters,
});

export const updateCartItem = (itemId, updatedItem) => ({
  type: UPDATE_CART_ITEM,
  payload: {
    itemId,
    updatedItem,
  },
});

export const showContractDialogForEdit = (contract, editMode = false) => ({
  type: SHOW_CONTRACT_DIALOG_FOR_EDIT,
  payload: {
    contract,
    editMode,
  },
});
