import { createSelector } from "reselect";
import {
  GET_ALL_PRODUCT_ADVERTISING_SPACES_INIT,
  GET_ALL_PRODUCT_ADVERTISING_SPACES_SUCCESS,
  GET_ALL_PRODUCT_ADVERTISING_SPACES_FAILURE,
  ADD_PRODUCT_ADVERTISING_SPACE_SUCCESS,
  ADD_PRODUCT_ADVERTISING_SPACE_FAILURE,
  EDIT_PRODUCT_ADVERTISING_SPACE_SUCCESS,
  EDIT_PRODUCT_ADVERTISING_SPACE_FAILURE,
  DELETE_PRODUCT_ADVERTISING_SPACE_SUCCESS,
  DELETE_PRODUCT_ADVERTISING_SPACE_FAILURE,
  PRODUCT_ADVERTISING_SPACE_SHOW_ADD_MODAL,
  PRODUCT_ADVERTISING_SPACE_SHOW_EDIT_MODAL,
  PRODUCT_ADVERTISING_SPACE_SHOW_DELETE_MODAL,
  PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_INIT,
  PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_SUCCESS,
  FILTER_PRODUCT_ADVERTISING_SPACES_INIT,
  FILTER_PRODUCT_ADVERTISING_SPACES_SUCCESS,
  FILTER_PRODUCT_ADVERTISING_SPACES_FAILURE,
} from "./actionTypes";

const initialState = {
  adSpaces: [],
  adsSpaceLocationType: [],
  products: [],
  errors: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_INIT:
    case GET_ALL_PRODUCT_ADVERTISING_SPACES_INIT:
    case FILTER_PRODUCT_ADVERTISING_SPACES_INIT:
      return {
        ...state,
        loading: true,
      };
    case FILTER_PRODUCT_ADVERTISING_SPACES_SUCCESS:
    case GET_ALL_PRODUCT_ADVERTISING_SPACES_SUCCESS:
      return {
        ...state,
        loading: false,
        adSpaces: [...action.payload],
      };
    case PRODUCT_ADVERTISING_SPACE_INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        adSpaces: [...action.payload.availableProductAdvertisingSpaces],
        products: [...action.payload.availableProducts],
        adsSpaceLocationType: [...action.payload.adsSpaceLocationType],
      };
    case ADD_PRODUCT_ADVERTISING_SPACE_SUCCESS:
    case PRODUCT_ADVERTISING_SPACE_SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case EDIT_PRODUCT_ADVERTISING_SPACE_SUCCESS:
    case PRODUCT_ADVERTISING_SPACE_SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        errors: {},
      };
    case DELETE_PRODUCT_ADVERTISING_SPACE_SUCCESS:
    case PRODUCT_ADVERTISING_SPACE_SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
      };
    case GET_ALL_PRODUCT_ADVERTISING_SPACES_FAILURE:
    case ADD_PRODUCT_ADVERTISING_SPACE_FAILURE:
    case EDIT_PRODUCT_ADVERTISING_SPACE_FAILURE:
    case DELETE_PRODUCT_ADVERTISING_SPACE_FAILURE:
    case FILTER_PRODUCT_ADVERTISING_SPACES_FAILURE:
      return { ...state, errors: { ...action.errors } };
    default:
      return state;
  }
}

const getAdvertisingSpacesReducer = state => state.advertisingSpaces;

export const getProductAdvertisingSpaces = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer => productAdvertisingSpaceReducer.adSpaces
);

export const getProducts = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer => productAdvertisingSpaceReducer.products
);

export const getLoading = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer => productAdvertisingSpaceReducer.loading
);

export const getErrors = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer => productAdvertisingSpaceReducer.errors
);

export const getShowAddModal = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer => productAdvertisingSpaceReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer => productAdvertisingSpaceReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer =>
    productAdvertisingSpaceReducer.showDeleteModal
);

export const getAdsSpaceLocationType = createSelector(
  getAdvertisingSpacesReducer,
  productAdvertisingSpaceReducer =>
    productAdvertisingSpaceReducer.adsSpaceLocationType
);
