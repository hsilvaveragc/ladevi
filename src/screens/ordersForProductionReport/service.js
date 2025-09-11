import axios from 'axios';

import { getHeaders } from 'shared/services/utils';

export default {
  filterOrdersFPR: (payload) =>
    axios
      .get(
        `Report/GetOrdersForProduction/${payload.productId}/${payload.productEditionId}/${payload.onlyNews}`,
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),
  addReportOPGeneration: (payload) =>
    axios.post(
      `Report/SaveReportGeneration/${payload}`,
      {},
      {
        headers: getHeaders(),
      }
    ),
};
