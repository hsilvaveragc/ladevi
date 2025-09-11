import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import Page from './Page';
import {
  filterReport,
  initialLoad,
  getProductEditions,
  addReporteGeneration,
  clearFilters,
} from './actionCreators';
import {
  getOrdersFPR,
  getErrors,
  getLoading,
  getProducts,
  getEditions,
  getLoadingProducts,
  getLoadingProductEditions,
} from './reducer';

const mapStateToProps = (state) => ({
  data: getOrdersFPR(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
  availableProducts: getProducts(state),
  availableEditions: getEditions(state),
  isLoadingProducts: getLoadingProducts(state),
  isLoadingProductEditions: getLoadingProductEditions(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      initialLoad,
      getProductEditions,
      filterReport,
      addReporteGeneration,
      clearFilters,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Page);
