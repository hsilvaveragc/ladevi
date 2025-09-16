import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import ReportsPage from './ReportsPage';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ReportsPage
);
