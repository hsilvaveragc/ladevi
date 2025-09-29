import axios from 'axios';
import { sortAlphabetically } from 'shared/utils';

import { getHeaders } from 'shared/services/utils';

export default {
  filterPendientContracts: (payload) =>
    axios
      .post(`Report/GetPendientContracts`, payload, {
        headers: getHeaders(),
      })
      .then((response) => response.data),
};
