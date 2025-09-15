export const getHeaders = (extraStuff = {}) => {
  const TOKEN = localStorage.getItem("TOKEN");

  const headers = {
    Accept: "application/json; charset=utf-8",
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Bearer ${TOKEN}`,
  };

  return Object.assign({}, headers, extraStuff);
};

export const getAssignedRole = () => {
  if (localStorage.getItem("loggedUser")) {
    const userRole = localStorage.getItem("loggedUser").toString();
    return {
      isAdmin: userRole == "Administrador",
      isSupervisor: userRole == "Supervisor",
      isSeller:
        userRole == "Vendedor Nacional" || userRole == "Vendedor COMTUR",
      isNationalSeller: userRole == "Vendedor Nacional",
      isComturSeller: userRole == "Vendedor COMTUR",
    };
  }
  return "";
};
