import axios from "axios";
import { dissoc } from "ramda";
import { getHeaders } from "shared/services/utils";

const getFilters = payload => {
  let result = null;
  const filters = [];

  if (payload.name) {
    filters.push({
      field: "name",
      operator: "contains",
      value: payload.name,
    });
  }

  if (payload.countryId && payload.countryId !== -1) {
    filters.push({
      field: "countryId",
      operator: "eq",
      value: payload.countryId,
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
  filterAccountingFields: payload =>
    axios
      .post(
        `TaxType/Search`,
        {
          take: 1000,
          filter: getFilters(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  getAllAccountingFields: () =>
    axios
      .post(
        `TaxType/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  addAccountingField: payload =>
    axios
      .post(
        `TaxType/Post`,
        { ...dissoc("id", payload) },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  editAccountingField: payload =>
    axios
      .put(`TaxType/Put/${payload.id}`, payload, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
  deleteAccountingField: payload =>
    axios
      .delete(`TaxType/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
};
