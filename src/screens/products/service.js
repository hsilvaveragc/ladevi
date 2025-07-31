import axios from "axios";
import { dissoc } from "ramda";
import { sortAlphabetically, sortCaseInsensitive } from "shared/utils";
import { getHeaders } from "shared/services/utils";

const getFilters = payload => {
  console.log(payload);
  const filter = [];
  let result = null;

  if (payload.name) {
    filter.push({
      field: "name",
      operator: "contains",
      value: payload.name,
    });
  }

  if (payload.countryId && payload.countryId !== -1) {
    filter.push({
      field: "countryId",
      operator: "eq",
      value: payload.countryId,
    });
  }

  if (payload.productTypeId && payload.productTypeId !== -1) {
    filter.push({
      field: "productTypeId",
      operator: "eq",
      value: payload.productTypeId,
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

const getFiltersProducts = () => {
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

  if (filter.length > 0) {
    result = {
      logic: "and",
      filters: filter,
    };
  }

  return result;
};

const setRangeEnd = volumeDiscounts => {
  console.log(volumeDiscounts);
  var result = volumeDiscounts
    .slice()
    .filter(x => x.rangeStart && x.discount)
    .sort((a, b) => parseFloat(a.rangeStart) - parseFloat(b.rangeStart));
  for (let i = 1; i < volumeDiscounts.length; i++) {
    result[i - 1].rangeEnd = result[i].rangeStart;
  }

  return result;
};

const setDiscount0 = locationDiscounts => {
  var result = locationDiscounts.slice();

  if (result.length === 1 && !result[0].advertisingSpaceLocationTypeId) {
    return null;
  }

  for (let i = 0; i < locationDiscounts.length; i++) {
    result[i].discount = result[i].discount || 0;
  }

  return result;
};

export default {
  filterProducts: payload =>
    axios
      .post(
        `Products/Search`,
        {
          take: 1000,
          filter: getFilters(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortAlphabetically(response.data.data, "name")),
  getAllProducts: () =>
    axios
      .post(
        `Products/Search`,
        {
          take: 1000,
          filter: getFiltersProducts(),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => {
        const products = sortCaseInsensitive(response.data.data, "name");
        return products;
      }),
  getAllAdvertisingSpaceLocationType: () =>
    axios
      .post(
        `AdvertisingSpaceLocationType/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  getAllProductTypes: () =>
    axios
      .post(
        `ProductType/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  addProduct: payload =>
    axios
      .post(
        `Products/Post`,
        {
          ...dissoc("id", {
            ...payload,
            discountSpecialBySeller: "10",
            productVolumeDiscounts: setRangeEnd(
              payload.productVolumeDiscounts.filter(
                x => x.rangeStart && x.discount
              )
            ),
            productLocationDiscounts: setDiscount0(
              payload.productLocationDiscounts
            ),
          }),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),

  editProduct: payload =>
    axios
      .put(
        `Products/Put/${payload.id}`,
        {
          ...payload,
          productVolumeDiscounts: setRangeEnd(
            payload.productVolumeDiscounts.filter(
              x => x.rangeStart && x.discount
            )
          ),
          productLocationDiscounts: setDiscount0(
            payload.productLocationDiscounts
          ),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  deleteProduct: payload =>
    axios
      .delete(`Products/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
  getAllProductsOptions: () =>
    axios
      .get(`Products/Options`, {
        headers: getHeaders(),
      })
      .then(response => sortAlphabetically(response.data, "name")),
  getProductsByProductTypeOptions: payload =>
    axios
      .get(`Products/Options?productTypeId=${payload}`, {
        headers: getHeaders(),
      })
      .then(response => sortAlphabetically(response.data, "name")),
  getAllProductsOptionsFull: () =>
    axios
      .get(`Products/OptionsFull`, {
        headers: getHeaders(),
      })
      .then(response => sortAlphabetically(response.data, "name")),

  getXubioProducts: () =>
    axios
      .get(`Products/GetXubioProducts`, {
        headers: getHeaders(),
      })
      .then(response => sortAlphabetically(response.data, "name")),

  getXubioComturProducts: () =>
    axios
      .get(`Products/GetXubioProducts?isComtur=true`, {
        headers: getHeaders(),
      })
      .then(response => sortAlphabetically(response.data, "name")),
};
