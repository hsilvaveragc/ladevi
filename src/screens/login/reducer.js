import { createSelector } from 'reselect';

import {
  LOGIN_INIT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  FORGOT_PASSWORD_INIT,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_INIT,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  CONFIRM_USER_INIT,
  CONFIRM_USER_SUCCESS,
  CONFIRM_USER_FAILURE,
} from './actionTypes';

const initialState = {
  form: {
    username: '',
    password: '',
  },
  loginError: '',
  loginLoading: false,
  forgotPasswordError: '',
  forgotPasswordLoading: false,
  isResetSuccessful: false,
  isUserConfirmedLoading: true,
  isUserConfirmed: false,
  userLogueado: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_INIT:
      return {
        ...state,
        form: { ...action.payload },
        loginLoading: true,
        loginError: '',
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        userLogueado: action.payload,
      };
    case LOGIN_FAILURE:
      return { ...initialState, loginError: action.error };
    case FORGOT_PASSWORD_INIT:
      return {
        ...state,
        forgotPasswordLoading: true,
        forgotPasswordError: '',
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordLoading: false,
      };
    case FORGOT_PASSWORD_FAILURE:
      return { ...initialState, forgotPasswordError: action.error };
    case CONFIRM_USER_INIT:
      return {
        ...state,
        isUserConfirmedLoading: true,
      };
    case CONFIRM_USER_SUCCESS:
      return {
        ...state,
        isUserConfirmedLoading: false,
        isUserConfirmed: true,
        userData: { ...action.payload },
      };
    case CONFIRM_USER_FAILURE:
      return {
        ...state,
        isUserConfirmedLoading: false,
        isUserConfirmed: false,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isResetSuccessful: true,
      };
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isResetSuccessful: false,
      };
    case RESET_PASSWORD_INIT:
    default:
      return state;
  }
}

const getLogin = (state) => state.login;

export const getLoginLoading = createSelector(
  getLogin,
  (login) => login.loginLoading
);

export const getLoginError = createSelector(
  getLogin,
  (login) => login.loginError
);

export const getForgotPasswordLoading = createSelector(
  getLogin,
  (login) => login.forgotPasswordLoading
);

export const getForgotPasswordError = createSelector(
  getLogin,
  (login) => login.forgotPasswordError
);

export const getIsResetSuccessful = createSelector(
  getLogin,
  (login) => login.isResetSuccessful
);

export const getIsUserConfirmed = createSelector(
  getLogin,
  (login) => login.isUserConfirmed
);

export const getIsUserConfirmedLoading = createSelector(
  getLogin,
  (login) => login.isUserConfirmedLoading
);

export const getUserFullName = createSelector(
  getLogin,
  (login) => login.userLogueado.fullName
);
