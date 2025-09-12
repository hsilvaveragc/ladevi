import { createSelector } from "reselect";
import {
  GET_ALL_PRODUCTS_INIT,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_ALL_PRODUCTS_FAILURE,
  GET_ALL_PRODUCT_TYPES_INIT,
  GET_ALL_PRODUCT_TYPES_SUCCESS,
  GET_ALL_PRODUCT_TYPES_FAILURE,
  PRODUCTS_INITIAL_LOAD_INIT,
  PRODUCTS_INITIAL_LOAD_SUCCESS,
  PRODUCT_SHOW_ADD_MODAL,
  PRODUCT_SHOW_EDIT_MODAL,
  PRODUCT_SHOW_DELETE_MODAL,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAILURE,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  FILTER_PRODUCTS_INIT,
  FILTER_PRODUCTS_SUCCESS,
  FILTER_PRODUCTS_FAILURE,
} from "./actionTypes.js";

const initialState = {
  items: [],
  countries: [],
  productTypes: [],
  adsSpaceLocationType: [],
  xubioProducts: [],
  xubioProductsComtur: [],
  errors: {},
  loading: true,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...action.payload.products],
        productTypes: [...action.payload.productTypes],
        adsSpaceLocationType: [...action.payload.adsSpaceLocationType],
        countries: [...action.payload.availableCountries],
        xubioProducts: [...action.payload.xubioProducts],
        xubioProductsComtur: [...action.payload.xubioProductsComtur],
      };
    case GET_ALL_PRODUCTS_INIT:
    case FILTER_PRODUCTS_INIT:
    case PRODUCTS_INITIAL_LOAD_INIT:
      return {
        ...state,
        loading: true,
      };
    case FILTER_PRODUCTS_SUCCESS:
    case GET_ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...action.payload],
      };
    case GET_ALL_PRODUCT_TYPES_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_PRODUCT_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        productTypes: [...action.payload],
      };
    case ADD_PRODUCT_SUCCESS:
    case PRODUCT_SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case EDIT_PRODUCT_SUCCESS:
    case PRODUCT_SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        errors: {},
      };
    case DELETE_PRODUCT_SUCCESS:
    case PRODUCT_SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
      };

    case ADD_PRODUCT_FAILURE:
    case EDIT_PRODUCT_FAILURE:
    case DELETE_PRODUCT_FAILURE:
    case GET_ALL_PRODUCTS_FAILURE:
    case GET_ALL_PRODUCT_TYPES_FAILURE:
    case FILTER_PRODUCTS_FAILURE:
      return { ...state, errors: { ...action.errors } };
    default:
      return state;
  }
}

const getProductsReducer = state => state.products;

export const getProducts = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.items
);
export const getCountries = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.countries
);

export const getIsLoading = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.loading
);

export const getErrors = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.errors
);

export const getProductTypes = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.productTypes
);

export const getAdsSpaceLocationType = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.adsSpaceLocationType
);

export const getShowAddModal = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.showDeleteModal
);

export const getXubioProducts = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.xubioProducts
);

export const getXubioProductsComtur = createSelector(
  getProductsReducer,
  productsReducer => productsReducer.xubioProductsComtur
);
