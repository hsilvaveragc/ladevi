import axios from "axios";
import { getHeaders } from "shared/services/utils";

const getFilters = payload => {
  console.log(payload);
  let result = null;
  const filters = [];

  if (payload.name) {
    filters.push({
      field: "name",
      operator: "contains",
      value: payload.name,
    });
  }

  if (payload.productId && payload.productId !== -1) {
    filters.push({
      field: "productId",
      operator: "eq",
      value: payload.productId,
    });
  }

  if (payload.code) {
    filters.push({
      field: "code",
      operator: "contains",
      value: payload.code,
    });
  }

  if (filters.length > 0) {
    result = {
      logic: "and",
      filters,
    };
  }

  return result;
};

export default {
  getAllEditions: () =>
    axios
      .post(
        `ProductEdition/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  addEdition: payload => {
    const { name, productId, code, closed, end } = payload;

    return axios
      .post(
        `ProductEdition/Post`,
        {
          name,
          productId,
          code,
          closed,
          end: end.toDateString(),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data);
  },
  editEdition: payload =>
    axios
      .put(`ProductEdition/Put/${payload.id}`, payload, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
  deleteEdition: payload =>
    axios
      .delete(`ProductEdition/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
  filterEditions: payload =>
    axios
      .post(
        `ProductEdition/Search`,
        {
          take: 1000,
          filter: getFilters(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  importEditions: payload => {
    return axios
      .post(`ProductEdition/Import`, payload, {
        headers: getHeaders(),
      })
      .then(response => {
        return response.data;
      });
  },
};
