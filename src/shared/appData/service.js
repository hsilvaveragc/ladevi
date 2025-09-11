import axios from 'axios';

import { getHeaders } from 'shared/services/utils';

export default {
  fetchOptionsAppRoles: () =>
    axios
      .get(`ApplicationRole/options`, { headers: getHeaders() })
      .then((response) => {
        return response.data;
      }),
  fetchCountries: () =>
    axios
      .post(`Country/search`, { take: 1000 }, { headers: getHeaders() })
      .then((response) => {
        return response.data.data;
      }),
  getAllStatesGroupedByCountry: () =>
    axios
      .get(`state/grouped-by-country`, { headers: getHeaders() })
      .then((response) => {
        return response.data;
      }),
  getAllDistrictsGroupedByState: () =>
    axios
      .get(`district/grouped-by-state`, { headers: getHeaders() })
      .then((response) => {
        return response.data;
      }),
  fetchAppRoles: () =>
    axios
      .post(
        `ApplicationRole/search`,
        {
          take: 1000,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => {
        return response.data.data;
      }),
  fetchStates: (countryId) =>
    axios
      .post(`State/search`, {
        take: 1000,
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'countryId',
              operator: 'eq',
              value: countryId,
            },
          ],
        },
      })
      .then((response) => {
        return response.data.data;
      }),
  fetchDistricts: (stateId) =>
    axios
      .post(`District/search`, {
        take: 1000,
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'stateId',
              operator: 'eq',
              value: stateId,
            },
          ],
        },
      })
      .then((response) => {
        return response.data.data;
      }),
  getAllCities: (districtId) =>
    axios
      .post(`City/search`, {
        take: 1000,
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'districtId',
              operator: 'eq',
              value: +districtId,
            },
          ],
        },
      })
      .then((response) => {
        return response.data.data;
      }),
};
