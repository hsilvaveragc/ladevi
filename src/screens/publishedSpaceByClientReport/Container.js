import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import Page from './Page';
import {
  filterReport,
  initialLoad,
  getProductsByType,
  getProductEditionByProduct,
  clearFilters,
} from './actionCreators';
import {
  getOrdersByClient,
  getErrors,
  getLoading,
  getProductTypes,
  getProducts,
  getEditions,
  getSellers,
  getClients,
  getLoadingAllClients,
  getLoadingProductTypes,
  getLoadingSellers,
  getLoadingProducts,
  getLoadingProductEditions,
} from './reducer';

const mapStateToProps = (state) => ({
  data: getOrdersByClient(state),
  availableProducts: getProducts(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
  availableProductTypes: getProductTypes(state),
  availableEditions: getEditions(state),
  availableSellers: getSellers(state),
  availableClients: getClients(state),
  isLoadingAllClients: getLoadingAllClients(state),
  isLoadingProductTypes: getLoadingProductTypes(state),
  isLoadingSellers: getLoadingSellers(state),
  isLoadingProducts: getLoadingProducts(state),
  isLoadingProductEditions: getLoadingProductEditions(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      initialLoad,
      filterReport,
      getProductsByType,
      getProductEditionByProduct,
      clearFilters,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Page);
