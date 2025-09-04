import axios from "axios";
import { dissoc } from "ramda";
import {
  transformIntoClientTaxes,
  buildAddPayload,
  buildEditPayload,
} from "./utils";
import { getHeaders } from "shared/services/utils";
import { sortAlphabetically } from "shared/utils";

const getFilterForSearch = payload => {
  const filter = [];
  let result = null;

  if (payload.fullName) {
    filter.push({
      logic: "or",
      filters: [
        {
          field: "brandName",
          operator: "contains",
          value: payload.fullName,
        },
        {
          field: "legalName",
          operator: "contains",
          value: payload.fullName,
        },
      ],
    });
  }

  if (payload.stateId && payload.stateId !== -1) {
    filter.push({
      field: "stateId",
      operator: "eq",
      value: payload.stateId,
    });
  }

  if (payload.countryId && payload.countryId !== -1) {
    filter.push({
      field: "countryId",
      operator: "eq",
      value: payload.countryId,
    });
  }

  if (payload.districtId && payload.districtId !== -1) {
    filter.push({
      field: "districtId",
      operator: "eq",
      value: payload.districtId,
    });
  }

  if (payload.cityId && payload.cityId !== -1) {
    filter.push({
      field: "cityId",
      operator: "eq",
      value: payload.cityId,
    });
  }

  if (payload.status && payload.status !== "all") {
    filter.push({
      field: "isEnabled",
      operator: "eq",
      value: true,
    });
  }

  if (
    payload.applicationUserSellerId &&
    payload.applicationUserSellerId !== -1
  ) {
    filter.push({
      field: "applicationUserSellerId",
      operator: "eq",
      value: payload.applicationUserSellerId,
    });
  }

  if (filter.length > 0) {
    result = {
      logic: "and",
      filters: filter,
    };
  }

  return result;
};

export default {
  getAllClients: () =>
    axios
      .post(
        `Clients/Search`,
        { take: 10000 },
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortAlphabetically(response.data, "brandName")),
  getEnabledClients: () =>
    axios
      .post(
        `Clients/Search`,
        {
          take: 10000,
          filter: {
            logic: "and",
            filters: [
              {
                field: "isEnabled",
                operator: "eq",
                value: true,
              },
            ],
          },
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortAlphabetically(response.data.data, "brandName")),
  getAllTaxes: () =>
    axios
      .post(
        `TaxType/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
          filter: {
            logic: "and",
            filters: [
              {
                field: "isIdentificationField",
                operator: "eq",
                value: true,
              },
            ],
          },
        }
      )
      .then(response => response.data.data),
  getTaxes: countryId =>
    axios
      .post(
        `TaxType/Search`,
        {
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
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => transformIntoClientTaxes(response.data.data)),
  filterClients: payload =>
    axios
      .post(
        `Clients/Search`,
        {
          take: 10002,
          filter: getFilterForSearch(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  addClient: payload =>
    axios
      .post(
        `Clients/Post`,
        {
          ...buildAddPayload(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  editClient: payload =>
    axios
      .put(
        `Clients/Put/${payload.id}`,
        {
          ...buildEditPayload(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  deleteClient: payload =>
    axios
      .delete(`Clients/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
  fetchStates: countryId =>
    axios
      .post(
        `State/search`,
        {
          take: 1000,
          filter: {
            logic: "and",
            field: "countryId",
            operator: "eq",
            value: countryId,
          },
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => {
        return sortAlphabetically(response.data.data, "name");
      }),
  fetchDistricts: stateId =>
    axios
      .post(
        `District/search`,
        {
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
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => {
        return sortAlphabetically(response.data.data, "name");
      }),
  getAllCities: districtId =>
    axios
      .post(
        `City/search`,
        {
          take: 1000,
          filter: {
            logic: "and",
            filters: [
              {
                field: "districtId",
                operator: "eq",
                value: districtId,
              },
            ],
          },
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => {
        return sortAlphabetically(response.data.data, "name");
      }),
  getAllClientsOptions: () =>
    axios
      .get(`Clients/Options`, {
        headers: getHeaders(),
      })
      .then(response => sortAlphabetically(response.data, "brandName")),
  getAllClientsOptionsFull: payload =>
    axios
      .get(
        `Clients/OptionsFull?onlyArgentina=${payload?.onlyArgentina ??
          false}&onlyComtur=${payload?.onlyComtur ??
          false}&onlyEnabled=${payload?.onlyEnabled ?? false}`,
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortAlphabetically(response.data, "brandName")),
  getAllTaxCtegories: () =>
    axios
      .post(
        `TaxCategory/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortAlphabetically(response.data.data, "name")),

  createAndAssociate: (clientData, xubioId) =>
    axios
      .post(
        "/clients/CreateAndAssociate",
        {
          ClientData: dissoc("id", buildAddPayload(clientData)),
          XubioId: xubioId,
        },
        {
          headers: getHeaders(),
        }
      )
      .then(x => x.data),

  editAndAssociate: (clientData, xubioId) =>
    axios
      .put(
        `Clients/EditAndAssociate/${clientData.id}`,
        {
          ClientData: buildAddPayload(clientData),
          XubioId: xubioId,
        },
        {
          headers: getHeaders(),
        }
      )
      .then(x => x.data),
};
