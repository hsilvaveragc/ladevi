import axios from 'axios';
import { sortAlphabetically } from 'shared/utils';
import { dissoc } from 'ramda';

import { getHeaders } from 'shared/services/utils';

const getFilters = (payload) => {
  const filter = [];
  let result = null;

  if (payload.productId && payload.productId !== -1) {
    filter.push({
      field: 'productId',
      operator: 'eq',
      value: payload.productId,
    });
  }

  if (payload.clientId && payload.clientId !== -1) {
    filter.push({
      field: 'clientId',
      operator: 'eq',
      value: payload.clientId,
    });
  }

  if (payload.salesmenId && payload.salesmenId !== -1) {
    filter.push({
      field: 'sellerId',
      operator: 'eq',
      value: payload.salesmenId,
    });
  }

  if (payload.productEditionId && payload.productEditionId !== -1) {
    filter.push({
      field: 'productEditionId',
      operator: 'eq',
      value: payload.productEditionId,
    });
  }

  if (filter.length > 0) {
    result = {
      logic: 'and',
      filters: filter,
    };
  }

  return result;
};

export default {
  filterOrders: (payload) =>
    axios
      .post(
        `PublishingOrder/Search`,
        {
          take: 1000,
          filter: getFilters(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => {
        return response.data.data;
      }),
  getAllOrders: () =>
    axios
      .post(
        `PublishingOrder/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => {
        return response.data.data;
      }),
  getAvailableContracts: (payload) =>
    axios
      .get(
        `Contract/GetContractsForOP/${payload.clientId}/${payload.productId}/${payload.contractId}`,
        // { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => sortAlphabetically(response.data, 'name')),
  getClientsWithBalance: (payload) =>
    axios
      .get(
        `Contract/GetClientsWithBalance/${payload.clientId}/${payload.productId}`,
        {
          headers: getHeaders(),
        }
      )
      .then((response) => sortAlphabetically(response.data, 'brandName')),
  getAvailableSpaceTypes: (payload) =>
    axios
      .get(
        `Contract/GetSpaceTypesWithBalance/${payload.latent}/${payload.contractId}/${payload.productId}/${payload.soldSpaceId}`,
        {
          headers: getHeaders(),
        }
      )
      .then((response) => sortAlphabetically(response.data, 'name')),
  getAvailableSpaceLocations: (payload) =>
    axios
      .get(
        `Contract/GetAdversitingSpaceLocation/${payload.latent}/${payload.soldSpaceId}/${payload.productId}/${payload.opId}`,
        {
          headers: getHeaders(),
        }
      )
      .then((response) => sortAlphabetically(response.data, 'name')),
  getAllEditionsForReport: (productId) =>
    axios
      .post(
        `ProductEdition/Search`,
        {
          take: 1000,
          filter: {
            logic: 'and',
            filters: [
              {
                field: 'productId',
                operator: 'eq',
                value: productId,
              },
            ],
          },
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),
  getAllEditions: (payload) =>
    axios
      .get(`ProductEdition/Options?productId=${payload}`, {
        headers: getHeaders(),
      })
      .then((response) => response.data),
  getEditionsForOP: (payload) =>
    axios
      .get(
        `PublishingOrder/GetEditionsForOP/${payload.productId}/${payload.editionId}`,
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),
  addOrder: (payload) =>
    axios.post(
      `PublishingOrder/Post`,
      {
        ...dissoc('id', {
          ...payload,
        }),
      },
      {
        headers: getHeaders(),
      }
    ),
  editOrder: (payload) =>
    axios.put(`PublishingOrder/Put/${payload.id}`, payload, {
      headers: getHeaders(),
    }),
  deleteOrder: (payload) =>
    axios.delete(`PublishingOrder/Delete/${payload.id}`, {
      headers: getHeaders(),
    }),
};
