import {
  LOGIN_INIT,
  LOGOUT_INIT,
  FORGOT_PASSWORD_INIT,
  RESET_PASSWORD_INIT,
} from "./actionTypes";

export const loginInit = payload => ({
  type: LOGIN_INIT,
  payload: { ...payload },
});

export const logoutInit = () => ({
  type: LOGOUT_INIT,
});

export const forgotPasswordInit = payload => ({
  type: FORGOT_PASSWORD_INIT,
  payload,
});

export const resetPassword = payload => ({
  type: RESET_PASSWORD_INIT,
  payload,
});
