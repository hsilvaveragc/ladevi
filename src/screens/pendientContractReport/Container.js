import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import Page from './Page';
import { filterReport, initialLoad, clearFilters } from './actionCreators';
import {
  getPendientContracts,
  getErrors,
  getLoading,
  getSellers,
  getClients,
  getLoadingAllClients,
  getLoadingSellers,
} from './reducer';

const mapStateToProps = (state) => ({
  data: getPendientContracts(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
  availableSellers: getSellers(state),
  availableClients: getClients(state),
  isLoadingAllClients: getLoadingAllClients(state),
  isLoadingSellers: getLoadingSellers(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      initialLoad,
      filterReport,
      clearFilters,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Page);
