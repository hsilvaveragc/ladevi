import { createSelector } from "reselect";
import {
  SEARCH_CONTRACTS_INIT,
  SEARCH_CONTRACTS_SUCCESS,
  SEARCH_CONTRACTS_FAILURE,
  INITIAL_LOAD_INIT,
  INITIAL_LOAD_SUCCESS,
  INITIAL_LOAD_FAILURE,
  ADD_CONTRACT_INIT,
  ADD_CONTRACT_SUCCESS,
  ADD_CONTRACT_FAILURE,
  EDIT_CONTRACT_INIT,
  EDIT_CONTRACT_SUCCESS,
  EDIT_CONTRACT_FAILURE,
  DELETE_CONTRACT_SUCCESS,
  SHOW_ADD_MODAL,
  SHOW_EDIT_MODAL,
  SHOW_DELETE_MODAL,
  FILTER_CONTRACTS_INIT,
  FILTER_CONTRACTS_SUCCESS,
  FILTER_CONTRACTS_FAILURE,
  GET_SPACETYPES_SUCCESS,
  GET_CURRENCIES_INIT,
  GET_CURRENCIES_SUCCESS,
  GET_CURRENCIES_FAILURE,
  GET_EUROPARITY_INIT,
  GET_EUROPARITY_SUCCESS,
  GET_EUROPARITY_FAILURE,
  UPDATE_CONTRACT_HISTORIAL,
  UPDATE_ORDERS_CONTRACT,
} from "./actionTypes.js";

const initialState = {
  contracts: [],
  salesmens: [],
  products: [],
  spaceLocations: [],
  spaceTypes: [],
  clients: [],
  countries: [],
  currencies: [],
  euroParities: [],
  errors: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  ordersEditions: {},
  checkingordersEditions: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case INITIAL_LOAD_INIT:
    case SEARCH_CONTRACTS_INIT:
    case FILTER_CONTRACTS_INIT:
    case GET_CURRENCIES_INIT:
    case GET_EUROPARITY_INIT:
    case ADD_CONTRACT_INIT:
    case EDIT_CONTRACT_INIT:
      return {
        ...state,
        loading: true,
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        //contracts: [...action.payload.availableContracts],
        salesmens: [...action.payload.availableSalesmens],
        products: [...action.payload.availableProducts],
        spaceLocations: [...action.payload.availableSpaceLocations],
        spaceTypes: [...action.payload.availableSpaceTypes],
        clients: [...action.payload.availableClients],
        countries: [...action.payload.availableCountries],
        currencies: [...action.payload.availableCurrencies],
        euroParities: [...action.payload.availableEuroParities],
        contracts: [],
      };
    case SEARCH_CONTRACTS_SUCCESS:
    case FILTER_CONTRACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contracts: [...action.payload.availableContracts],
      };
    case GET_CURRENCIES_SUCCESS:
      return {
        ...state,
        loading: false,
        currencies: [...action.payload],
      };
    case GET_EUROPARITY_SUCCESS:
      return {
        ...state,
        loading: false,
        euroParities: [...action.payload],
      };
    case ADD_CONTRACT_SUCCESS:
      return {
        ...state,
        loading: false,
        showAddModal: !state.showAddModal,
        contracts: [],
      };
      break;
    case SHOW_ADD_MODAL:
      return {
        ...state,
        showAddModal: !state.showAddModal,
        errors: {},
      };
    case EDIT_CONTRACT_SUCCESS:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        contracts: [],
        loading: false,
      };
      break;
    case SHOW_EDIT_MODAL:
      return {
        ...state,
        showEditModal: !state.showEditModal,
        errors: {},
      };
    case DELETE_CONTRACT_SUCCESS:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        contracts: [],
        loading: false,
      };
      break;
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
        errors: {},
      };
    case GET_SPACETYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        spaceTypes: [...action.payload],
      };
    case SEARCH_CONTRACTS_FAILURE:
    case INITIAL_LOAD_FAILURE:
    case FILTER_CONTRACTS_FAILURE:
    case ADD_CONTRACT_FAILURE:
    case EDIT_CONTRACT_FAILURE:
    case GET_CURRENCIES_FAILURE:
    case GET_EUROPARITY_FAILURE:
      return { ...state, loading: false, errors: { ...action.errors } };
    case UPDATE_CONTRACT_HISTORIAL:
      const indexContract = state.contracts.findIndex(
        c => c.id === action.payload[0].contractId
      );

      const newContracts = [
        ...state.contracts.slice(0, indexContract),
        {
          ...state.contracts[indexContract],
          contractHistoricals: action.payload,
        },
        ...state.contracts.slice(indexContract + 1),
      ];

      return {
        ...state,
        contracts: newContracts,
      };
    case UPDATE_ORDERS_CONTRACT:
      console.log(action.payload);
      const indexContractSelected = state.contracts.findIndex(
        c => c.id === action.payload.contractId
      );
      const indexSoldSpace = state.contracts[
        indexContractSelected
      ].soldSpaces.findIndex(sp => sp.id === action.payload.soldSpaceId);
      return {
        ...state,
        contracts:
          indexContractSelected === -1
            ? state.contracts
            : [
                ...state.contracts.slice(0, indexContractSelected),
                {
                  ...state.contracts[indexContractSelected],
                  soldSpaces: [
                    ...state.contracts[indexContractSelected].soldSpaces.slice(
                      0,
                      indexSoldSpace
                    ),
                    {
                      ...state.contracts[indexContractSelected].soldSpaces[
                        indexSoldSpace
                      ],
                      balance:
                        parseFloat(
                          state.contracts[indexContractSelected].soldSpaces[
                            indexSoldSpace
                          ].balance
                        ) - parseFloat(action.payload.quantity),
                    },
                    ...state.contracts[indexContractSelected].soldSpaces.slice(
                      indexSoldSpace + 1
                    ),
                  ],
                  publishingOrders: [
                    ...state.contracts[indexContractSelected].publishingOrders,
                    {
                      ...action.payload,
                      productAdvertisingSpace: state.spaceTypes.filter(
                        st => st.id === action.payload.productAdvertisingSpaceId
                      )[0],
                      advertisingSpaceLocationType: state.spaceLocations.filter(
                        sl =>
                          sl.id ===
                          action.payload.advertisingSpaceLocationTypeId
                      )[0],
                    },
                  ],
                },
                ...state.contracts.slice(indexContractSelected + 1),
              ],
      };
    default:
      return state;
  }
}

const getContractsReducer = state => state.contracts;

export const getContracts = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.contracts
);

export const getSalesmens = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.salesmens
);

export const getProducts = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.products
);

export const getSpaceTypes = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.spaceTypes
);

export const getSpaceLocations = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.spaceLocations
);

export const getCurrencies = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.currencies
);

export const getEuroParities = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.euroParities
);

export const getClients = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.clients
);

export const getCountries = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.countries
);

export const getErrors = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.errors
);

export const getSearchContractsLoading = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.searchContractsLoading
);

export const getShowAddModal = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.showAddModal
);

export const getShowEditModal = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.showEditModal
);

export const getShowDeleteModal = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.showDeleteModal
);

export const getLoading = createSelector(
  getContractsReducer,
  contractsReducer => contractsReducer.loading
);

export const gethasOrdersEditions = (state, contractId) =>
  state.contracts.ordersEditions[contractId] || false;
