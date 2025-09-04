import axios from "axios";

export default {
  login: credentials => {
    const password = window.encodeURIComponent(credentials.password);
    return axios
      .post(
        `ApplicationUsers/login?email=${credentials.username}&password=${password}`
      )
      .then(response => response.data);
  },
  forgotPassword: credentials =>
    axios
      .post(`ApplicationUsers/ForgotPassword?email=${credentials.username}`)
      .then(response => {
        return response.data;
      }),
  confirmUser: ({ userId, code }) =>
    axios
      .get(`ApplicationUsers/confirm`, {
        params: {
          userId,
          code: code.replace(/\s/g, "+"),
        },
      })
      .then(response => response.data),
  resetPassword: ({
    token,
    email,
    currentPassword,
    newPassword,
    newPassword2,
  }) =>
    axios
      .post(
        `ApplicationUsers/ResetPassword`,
        { email, currentPassword, newPassword, newPassword2 },
        {
          params: {
            token: token.replace(/\s/g, "+"),
          },
        }
      )
      .then(response => response.data),
};
