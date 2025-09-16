import axios from 'axios';
import { sortAlphabetically } from 'shared/utils';
import { format } from 'date-fns';

import { getHeaders } from 'shared/services/utils';

const getFiltersProductsByType = (payload) => {
  const filter = [];
  let result = null;

  const isNationalSeller =
    localStorage.getItem('loggedUser') == 'Vendedor Nacional';

  if (isNationalSeller) {
    const countryId = localStorage.getItem('userCountryId');
    filter.push({
      field: 'countryId',
      operator: 'eq',
      value: countryId,
    });
  }

  filter.push({
    field: 'productTypeId',
    operator: 'eq',
    value: payload,
  });

  if (filter.length > 0) {
    result = {
      logic: 'and',
      filters: filter,
    };
  }

  return result;
};

export default {
  filterOrdersBySeller: (payload) =>
    axios
      .post(`Report/GetOPBySeller`, payload, {
        headers: getHeaders(),
      })
      .then((response) => response.data),
  getProductsByType: (payload) =>
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
      .then((response) => sortAlphabetically(response.data.data, 'name')),
};
