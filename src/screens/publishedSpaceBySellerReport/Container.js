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
  getOrdersBySeller,
  getErrors,
  getLoading,
  getProductTypes,
  getProducts,
  getEditions,
  getSellers,
  getLoadingSellers,
  getLoadingProductTypes,
  getLoadingProducts,
  getLoadingProductEditions,
} from './reducer';

const mapStateToProps = (state) => ({
  data: getOrdersBySeller(state),
  availableProducts: getProducts(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
  availableProductTypes: getProductTypes(state),
  availableEditions: getEditions(state),
  availableSellers: getSellers(state),
  isLoadingSellers: getLoadingSellers(state),
  isLoadingProductTypes: getLoadingProductTypes(state),
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
