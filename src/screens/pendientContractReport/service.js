import axios from "axios";
import { getHeaders } from "shared/services/utils";
import { sortAlphabetically } from "shared/utils";

export default {
  filterPendientContracts: payload =>
    axios
      .post(`Report/GetPendientContracts`, payload, {
        headers: getHeaders(),
      })
      .then(response => response.data),
};
