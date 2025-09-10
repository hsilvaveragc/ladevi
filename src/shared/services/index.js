import axios from "axios";

import appDataService from "../appData/service";

console.log("MODE:", import.meta.env.MODE);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Agregar interceptor para debug
axios.interceptors.request.use(config => {
  console.log("Axios request URL:", config.baseURL + config.url);
  console.log("Full config:", config);
  return config;
});

export { appDataService };
