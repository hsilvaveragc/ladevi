const STORAGE_KEYS = {
  isAuthenticated: 'isAuthenticated',
  token: 'TOKEN',
  refreshToken: 'REFRESH_TOKEN',
  userId: 'userId',
  userFullName: 'userFullName',
  userRole: 'loggedUser',
  userCountryId: 'userCountryId',
};

const ROL_KEYS = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  nationalSeller: 'Vendedor Nacional',
  comturSeller: 'Vendedor COMTUR',
};

export const setAuthFromStorage = (loginPayload) => {
  localStorage.setItem(STORAGE_KEYS.token, loginPayload.token);
  localStorage.setItem(STORAGE_KEYS.refreshToken, loginPayload.refreshToken);
  localStorage.setItem(STORAGE_KEYS.userId, loginPayload.user.id);
  localStorage.setItem(STORAGE_KEYS.userFullName, loginPayload.user.fullName);
  localStorage.setItem(
    STORAGE_KEYS.userRole,
    loginPayload.user.applicationRoleName
  );
  localStorage.setItem(STORAGE_KEYS.userCountryId, loginPayload.user.countryId);
  localStorage.setItem('isAuthenticated', loginPayload ? true : false);
};

export const getAuthFromStorage = () => ({
  isAuthenticated:
    localStorage.getItem(STORAGE_KEYS.isAuthenticated) === 'true',
  token: localStorage.getItem(STORAGE_KEYS.token),
  refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken),
  userId: parseInt(localStorage.getItem(STORAGE_KEYS.userId)),
  userFullName: localStorage.getItem(STORAGE_KEYS.userFullName),
  userRole: localStorage.getItem(STORAGE_KEYS.userRole),
  userCountryId: parseInt(localStorage.getItem(STORAGE_KEYS.userCountryId)),
  userRol: {
    isAdmin: localStorage.getItem(STORAGE_KEYS.userRole) === ROL_KEYS.admin,
    isSupervisor:
      localStorage.getItem(STORAGE_KEYS.userRole) === ROL_KEYS.supervisor,
    isNationalSeller:
      localStorage.getItem(STORAGE_KEYS.userRole) === ROL_KEYS.nationalSeller,
    isComturSeller:
      localStorage.getItem(STORAGE_KEYS.userRole) === ROL_KEYS.comturSeller,
    isSeller:
      localStorage.getItem(STORAGE_KEYS.userRole) === ROL_KEYS.nationalSeller ||
      localStorage.getItem(STORAGE_KEYS.userRole) === ROL_KEYS.comturSeller,
  },
});

export const removeAuthFromStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

export const getTokenFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.token);
};
