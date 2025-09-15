import axios from "axios";
import { getHeaders } from "shared/services/utils";

export default {
  getAllCountries: () =>
    axios
      .post(`Country/search`, { take: 1000 }, { headers: getHeaders() })
      .then(response => {
        return response.data.data;
      }),
  getAllStates: countryId =>
    axios
      .post(`State/search`, {
        take: 1000,
        filter: {
          logic: "and",
          filters: [
            {
              field: "countryId",
              operator: "eq",
              value: countryId,
            },
          ],
        },
      })
      .then(response => {
        return response.data.data;
      }),
  getAllDistricts: stateId =>
    axios
      .post(`District/search`, {
        take: 1000,
        filter: {
          logic: "and",
          filters: [
            {
              field: "stateId",
              operator: "eq",
              value: stateId,
            },
          ],
        },
      })
      .then(response => {
        return response.data.data;
      }),
  getAllCities: districtId =>
    axios
      .post(`City/search`, {
        take: 1000,
        filter: {
          logic: "and",
          filters: [
            {
              field: "districtId",
              operator: "eq",
              value: +districtId,
            },
          ],
        },
      })
      .then(response => {
        return response.data.data;
      }),
  getAllAppRoles: () =>
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
      .then(response => {
        return response.data.data;
      }),
};
