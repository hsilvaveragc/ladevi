import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import { loginInit, forgotPasswordInit } from './actionCreators';
import {
  getLoginLoading,
  getLoginError,
  getForgotPasswordError,
  getForgotPasswordLoading,
} from './reducer';
import LoginPage from './LoginPage';

const mapStateToProps = (state) => ({
  loginLoading: getLoginLoading(state),
  loginError: getLoginError(state),
  forgotPasswordError: getForgotPasswordError(state),
  forgotPasswordLoading: getForgotPasswordLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ loginInit, forgotPasswordInit }, dispatch),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(LoginPage);
