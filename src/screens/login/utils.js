function setAuthState(state) {
  localStorage.setItem("isAuthenticated", state);
}

function setAuthToken(loginPayload) {
  localStorage.setItem("TOKEN", loginPayload.token);
  localStorage.setItem("REFRESH_TOKEN", loginPayload.refreshToken);
  localStorage.setItem("userId", loginPayload.user.id);
  localStorage.setItem("userFullName", loginPayload.user.fullName);
  localStorage.setItem("loggedUser", loginPayload.user.applicationRole.name);
  localStorage.setItem("userCountryId", loginPayload.user.countryId);
  return loginPayload ? setAuthState(true) : setAuthState(false);
}

function setLocalStorage(loginPayload) {
  setAuthToken(loginPayload);
}

export default {
  setLocalStorage,
};
