import axios from "axios";
import { getHeaders } from "shared/services/utils";
import { sortAlphabetically, sortCaseInsensitive } from "shared/utils";
import Moment from "moment";

const getFiltersProductsByType = payload => {
  const filter = [];
  let result = null;

  const isNationalSeller =
    localStorage.getItem("loggedUser") == "Vendedor Nacional";

  if (isNationalSeller) {
    const countryId = localStorage.getItem("userCountryId");
    filter.push({
      field: "countryId",
      operator: "eq",
      value: countryId,
    });
  }

  filter.push({
    field: "productTypeId",
    operator: "eq",
    value: payload,
  });

  if (filter.length > 0) {
    result = {
      logic: "and",
      filters: filter,
    };
  }

  return result;
};

export default {
  filterOrdersByClient: payload =>
    axios
      .post(`Report/GetOPByClient`, payload, {
        headers: getHeaders(),
      })
      .then(response => response.data),
  getProductsByType: payload =>
    axios
      .post(
        `Products/Search`,
        {
          take: 1000,
          filter: getFiltersProductsByType(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortCaseInsensitive(response.data.data, "name")),
};
