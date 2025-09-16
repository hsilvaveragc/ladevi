import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import {
  getEuroParitiesInit,
  addEuroParity,
  deleteEuroParity,
  initialLoad as initialLoadEuroParity,
  showAddModal as showAddModalEuroParity,
  showDeleteModal as showDeleteModalEuroParity,
} from '../euro-parity/actionCreator';
import {
  getEuroParities,
  getLoading as getLoadingEuroParity,
  getErrors as getErrorsEuroParity,
  getShowAddModal as getShowAddModalEuroParity,
  getShowDeleteModal as getShowDeleteModalEuroParity,
} from '../euro-parity/reducer';

import {
  getCurrenciesInit,
  addCurrency,
  editCurrency,
  deleteCurrency,
  initialLoad,
  showAddModal,
  showEditModal,
  showDeleteModal,
} from './actionCreator';
import {
  getCountries,
  getCurrencies,
  getLoading,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
} from './reducer';
import Page from './Page';

const mapStateToProps = (state) => ({
  data: getCurrencies(state),
  isLoading: getLoading(state),
  errors: getErrors(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  availableCountries: getCountries(state),
  dataEuroParity: getEuroParities(state),
  isLoadingEuroParity: getLoadingEuroParity(state),
  errorsEuroParity: getErrorsEuroParity(state),
  showAddModalEuroParity: getShowAddModalEuroParity(state),
  showDeleteModalEuroParity: getShowDeleteModalEuroParity(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getCurrenciesInit,
      addCurrency,
      editCurrency,
      deleteCurrency,
      initialLoad,
      showAddModal,
      showEditModal,
      showDeleteModal,
      getEuroParitiesInit,
      addEuroParity,
      deleteEuroParity,
      initialLoadEuroParity,
      showAddModalEuroParity,
      showDeleteModalEuroParity,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Page);
