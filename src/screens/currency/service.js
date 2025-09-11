import axios from 'axios';
import { dissoc } from 'ramda';
import { sortAlphabetically } from 'shared/utils';

import { getHeaders } from 'shared/services/utils';

const setEndDateToCurrencies = (currencies) => {
  const result = currencies
    .slice()
    .sort((a, b) => (new Date(a.start) < new Date(b.start) ? -1 : 1));

  for (let i = 1; i < result.length; i++) {
    result[i - 1].end = result[i].start;
  }

  if (result.length === 1) {
    const endYear = new Date(result[0].start).getFullYear() + 30;
    result[0].end = new Date(endYear, 11, 31);
  }

  return result;
};

export default {
  getAllCurrencies: () =>
    axios
      .post(
        `Currency/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => {
        return sortAlphabetically(sortAlphabetically(response.data.data), 'id');
      }),
  addCurrency: (payload) =>
    axios
      .post(
        `Currency/Post`,
        {
          ...dissoc('id', {
            ...payload,
            currencyParities: payload.useEuro
              ? []
              : setEndDateToCurrencies(payload.currencyParities),
          }),
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),
  editCurrency: (payload) =>
    axios
      .put(
        `Currency/Put/${payload.id}`,
        {
          ...payload,
          currencyParities: payload.useEuro
            ? []
            : setEndDateToCurrencies(payload.currencyParities),
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),
  deleteCurrency: (payload) =>
    axios
      .delete(`Currency/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then((response) => response.data.data),
};
