import axios from "axios";

import appDataService from "../appData/service";

/*axios.defaults.baseURL = import.meta.env.NODE_ENV === "development"
    ? "https://localhost:44370/api/"
    : "http://api.ventas.ladevi.greencodesoftware.com/api/";*/
//axios.defaults.baseURL = "http://200.80.220.11:8097/api";

console.log("NODE_ENV:", import.meta.env.NODE_ENV);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL ||
  "http://api.ventas.ladevi.greencodesoftware.com/api/";

console.log("Final axios baseURL:", axios.defaults.baseURL);

// Agregar interceptor para debug
axios.interceptors.request.use(config => {
  console.log("Axios request URL:", config.baseURL + config.url);
  console.log("Full config:", config);
  return config;
});

export { appDataService };
