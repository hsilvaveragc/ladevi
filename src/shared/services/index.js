import axios from "axios";

import appDataService from "./appData";

/*axios.defaults.baseURL = process.env.NODE_ENV === "development"
    ? "https://localhost:44370/api/"
    : "http://api.ventas.ladevi.greencodesoftware.com/api/";*/
//axios.defaults.baseURL = "http://200.80.220.11:8097/api";

console.log(process.env.REACT_APP_API_URL);

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL ||
  "http://api.ventas.ladevi.greencodesoftware.com/api/";
// axios.defaults.baseURL = "http://api.ventas.ladevi.greencodesoftware.com/api/";

export { appDataService };
