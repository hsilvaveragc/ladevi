import axios from 'axios';
import { dissoc } from 'ramda';
import { sortAlphabetically } from 'shared/utils';

import { getHeaders } from 'shared/services/utils';

const getFiltersPayload = (payload) => {
  let result = null;
  const filters = [];

  if (payload.name) {
    filters.push({
      field: 'name',
      operator: 'contains',
      value: payload.name,
    });
  }

  if (payload.productId && payload.productId !== -1) {
    filters.push({
      field: 'productId',
      operator: 'eq',
      value: payload.productId,
    });
  }

  if (filters.length > 0) {
    result = {
      logic: 'and',
      filters,
    };
  }
  return result;
};

export default {
  filterProductAdvertisingSpace: (payload) =>
    axios
      .post(
        `ProductAdvertisingSpace/Search`,
        {
          take: 1000,
          filter: getFiltersPayload(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),
  getAllProductAdvertisingSpaces: () =>
    axios
      .post(
        `ProductAdvertisingSpace/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),
  addProductAdvertisingSpace: (payload) =>
    axios
      .post(
        `ProductAdvertisingSpace/Post`,
        { ...dissoc('id', payload) },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),
  editProductAdvertisingSpace: (payload) =>
    axios
      .put(`ProductAdvertisingSpace/Put/${payload.id}`, payload, {
        headers: getHeaders(),
      })
      .then((response) => response.data.data),
  deleteProductAdvertisingSpace: (payload) =>
    axios
      .delete(`ProductAdvertisingSpace/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then((response) => response.data.data),
  getProductAdvertisingSpaceOptions: () =>
    axios
      .get(`ProductAdvertisingSpace/Options`, {
        headers: getHeaders(),
      })
      .then((response) => sortAlphabetically(response.data, 'name')),
  getProductAdvertisingSpaceOptionsFull: () =>
    axios
      .get(`ProductAdvertisingSpace/OptionsFull`, {
        headers: getHeaders(),
      })
      .then((response) => sortAlphabetically(response.data, 'name')),
};
