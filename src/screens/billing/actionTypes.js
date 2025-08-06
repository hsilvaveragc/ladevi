// Carga inicial
export const INITIAL_LOAD_INIT = "@billing/INITIAL_LOAD_INIT";
export const INITIAL_LOAD_SUCCESS = "@billing/INITIAL_LOAD_SUCCESS";
export const INITIAL_LOAD_FAILURE = "@billing/INITIAL_LOAD_FAILURE";

// Gestión de facturas
export const FETCH_INVOICES_INIT = "@billing/FETCH_INVOICES_INIT";
export const FETCH_INVOICES_SUCCESS = "@billing/FETCH_INVOICES_SUCCESS";
export const FETCH_INVOICES_FAILURE = "@billing/FETCH_INVOICES_FAILURE";

// Selección de tipo de cliente y cliente
export const SET_CLIENT_TYPE = "@billing/SET_CLIENT_TYPE";
export const SELECT_CLIENT = "@billing/SELECT_CLIENT";
export const SET_ENTITY_TYPE = "@billing/SET_ENTITY_TYPE";
export const SET_SELECTED_CURRENCY = "@billing/SET_SELECTED_CURRENCY";

// Gestión de clientes
export const FETCH_CLIENTS_INIT = "@billing/FETCH_CLIENTS_INIT";
export const FETCH_CLIENTS_SUCCESS = "@billing/FETCH_CLIENTS_SUCCESS";
export const FETCH_CLIENTS_FAILURE = "@billing/FETCH_CLIENTS_FAILURE";

// Gestión de contratos
export const FETCH_CONTRACTS_INIT = "@billing/FETCH_CONTRACTS_INIT";
export const FETCH_CONTRACTS_SUCCESS = "@billing/FETCH_CONTRACTS_SUCCESS";
export const FETCH_CONTRACTS_FAILURE = "@billing/FETCH_CONTRACTS_FAILURE";

export const FILTER_CONTRACTS_INIT = "@billing/FILTER_CONTRACTS_INIT";
export const FILTER_CONTRACTS_SUCCESS = "@billing/FILTER_CONTRACTS_SUCCESS";
export const FILTER_CONTRACTS_FAILURE = "@billing/FILTER_CONTRACTS_FAILURE";

// Gestión de órdenes
export const FETCH_ORDERS_INIT = "@billing/FETCH_ORDERS_INIT";
export const FETCH_ORDERS_SUCCESS = "@billing/FETCH_ORDERS_SUCCESS";
export const FETCH_ORDERS_FAILURE = "@billing/FETCH_ORDERS_FAILURE";

// NUEVOS: Gestión de productos para ediciones
export const FETCH_PRODUCTS_INIT = "@billing/FETCH_PRODUCTS_INIT";
export const FETCH_PRODUCTS_SUCCESS = "@billing/FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "@billing/FETCH_PRODUCTS_FAILURE";

export const FETCH_EDITIONS_INIT = "@billing/FETCH_EDITIONS_INIT";
export const FETCH_EDITIONS_SUCCESS = "@billing/FETCH_EDITIONS_SUCCESS";
export const FETCH_EDITIONS_FAILURE = "@billing/FETCH_EDITIONS_FAILURE";

export const SET_SELECTED_PRODUCT = "@billing/SET_SELECTED_PRODUCT";
export const SET_SELECTED_EDITION = "@billing/SET_SELECTED_EDITION";

// NUEVOS: Gestión de vendedores y filtros de ediciones
export const FETCH_VENDORS_INIT = "@billing/FETCH_VENDORS_INIT";
export const FETCH_VENDORS_SUCCESS = "@billing/FETCH_VENDORS_SUCCESS";
export const FETCH_VENDORS_FAILURE = "@billing/FETCH_VENDORS_FAILURE";

// Productos de Xubio
export const FETCH_XUBIO_PRODUCTS_INIT = "@billing/FETCH_XUBIO_PRODUCTS_INIT";
export const FETCH_XUBIO_PRODUCTS_SUCCESS =
  "@billing/FETCH_XUBIO_PRODUCTS_SUCCESS";
export const FETCH_XUBIO_PRODUCTS_FAILURE =
  "@billing/FETCH_XUBIO_PRODUCTS_FAILURE";

// Gestión del carrito
export const ADD_TO_CART = "@billing/ADD_TO_CART";
export const REMOVE_FROM_CART = "@billing/REMOVE_FROM_CART";
export const CLEAR_CART = "@billing/CLEAR_CART";
export const UPDATE_CART_ITEM = "@billing/UPDATE_CART_ITEM";

// Diálogos
export const SHOW_CONTRACT_DIALOG = "@billing/SHOW_CONTRACT_DIALOG";
export const HIDE_CONTRACT_DIALOG = "@billing/HIDE_CONTRACT_DIALOG";
export const SHOW_CONTRACT_DIALOG_FOR_EDIT =
  "@billing/SHOW_CONTRACT_DIALOG_FOR_EDIT";

export const SHOW_ORDER_DIALOG = "@billing/SHOW_ORDER_DIALOG";
export const HIDE_ORDER_DIALOG = "@billing/HIDE_ORDER_DIALOG";

export const SHOW_INVOICE_DIALOG = "@billing/SHOW_INVOICE_DIALOG";
export const HIDE_INVOICE_DIALOG = "@billing/HIDE_INVOICE_DIALOG";

// Envío a Xubio
export const SEND_TO_XUBIO_INIT = "@billing/SEND_TO_XUBIO_INIT";
export const SEND_TO_XUBIO_SUCCESS = "@billing/SEND_TO_XUBIO_SUCCESS";
export const SEND_TO_XUBIO_FAILURE = "@billing/SEND_TO_XUBIO_FAILURE";

// NUEVO: Envío múltiple a Xubio (para ediciones)
export const SEND_MULTIPLE_TO_XUBIO_INIT =
  "@billing/SEND_MULTIPLE_TO_XUBIO_INIT";
export const SEND_MULTIPLE_TO_XUBIO_SUCCESS =
  "@billing/SEND_MULTIPLE_TO_XUBIO_SUCCESS";
export const SEND_MULTIPLE_TO_XUBIO_FAILURE =
  "@billing/SEND_MULTIPLE_TO_XUBIO_FAILURE";
