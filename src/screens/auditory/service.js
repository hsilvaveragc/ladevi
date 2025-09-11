import axios from 'axios';

import { getHeaders } from 'shared/services/utils';

export default {
  getAuditoryEvents: () =>
    axios
      .get(`Auditory/GetAuditory`, {
        headers: getHeaders(),
      })
      .then((response) => response.data),
};
