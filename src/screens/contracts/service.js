import axios from 'axios';
import { sortAlphabetically } from 'shared/utils';
import { dissoc } from 'ramda';

import { getHeaders } from 'shared/services/utils';
import { CONSTANTS } from 'shared/utils/constants';

const getFilters = (payload) => {
  const filter = [];
  let result = null;

  if (payload.number) {
    filter.push({
      field: 'number',
      operator: 'eq',
      value: payload.number,
    });
  }

  if (payload.name) {
    filter.push({
      field: 'name',
      operator: 'contains',
      value: payload.name,
    });
  }

  if (payload.client) {
    filter.push({
      logic: 'or',
      filters: [
        {
          field: 'brandName',
          operator: 'contains',
          value: payload.client,
        },
        {
          field: 'legalName',
          operator: 'contains',
          value: payload.client,
        },
      ],
    });
  }

  if (payload.countryId && payload.countryId !== -1) {
    filter.push({
      field: 'billingCountryId',
      operator: 'eq',
      value: payload.countryId,
    });
  }

  if (payload.productId && payload.productId !== -1) {
    filter.push({
      field: 'productId',
      operator: 'eq',
      value: payload.productId,
    });
  }

  if (payload.salesmenId && payload.salesmenId !== -1) {
    filter.push({
      field: 'sellerId',
      operator: 'eq',
      value: payload.salesmenId,
    });
  }

  if (payload.fromDate) {
    const start = new Date(payload.fromDate);
    const formatDate = `${start.getDate()}/${
      start.getMonth() + 1
    }/${start.getFullYear()}`;

    filter.push({
      field: 'end',
      operator: 'gte',
      value: formatDate,
    });
  }

  if (payload.toDate) {
    const end = new Date(payload.toDate);
    const formatDate = `${end.getDate()}/${
      end.getMonth() + 1
    }/${end.getFullYear()} 23:59:59`;

    filter.push({
      field: 'end',
      operator: 'lte',
      value: formatDate,
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

const getAddUpdatePayload = (payload) => {
  return {
    id: payload.id,
    productId: payload.productId,
    clientId: payload.clientId,
    sellerId: payload.sellerId,
    billingConditionId: payload.billingConditionId,
    paymentMethodId: payload.paymentMethodId,
    currencyId:
      payload.currencyId == CONSTANTS.EUR_CURRENCY_ID
        ? null
        : payload.currencyId,
    billingCountryId: payload.billingCountryId,
    start: payload.start,
    end: payload.end,
    applyDiscountForCheck: payload.applyDiscountForCheck,
    applyDiscountForLoyalty: payload.applyDiscountForLoyalty,
    applyDiscountForSameCountry: payload.applyDiscountForSameCountry,
    applyDiscountForOtherCountry: payload.applyDiscountForOtherCountry,
    appyDiscountForAgency: payload.appyDiscountForAgency,
    applyDiscountForVolume: payload.applyDiscountForVolume,
    paidOut: payload.paidOut,
    discountForCheck: payload.discountForCheck,
    discountForLoyalty: payload.discountForLoyalty,
    discountForAgency: payload.discountForAgency,
    discountForSameCountry: payload.discountForSameCountry,
    discountForOtherCountry: payload.discountForOtherCountry || 0,
    discountForVolume: payload.discountForVolume || 0,
    name: payload.name,
    invoiceNumber: payload.invoiceNumber,
    checkQuantity: payload.checkQuantity,
    daysToFirstPayment: payload.daysToFirstPayment,
    daysBetweenChecks: payload.daysBetweenChecks,
    soldSpaces: payload.soldSpaces,
    observations: payload.observations,
    iva: payload.iva,
    currencyParity: payload.currencyParity ? payload.currencyParity : 1,
    useEuro: payload.useEuro,
  };
};

export default {
  addContract: (payload) =>
    axios.post(
      `Contract/Post`,
      {
        ...dissoc('id', getAddUpdatePayload(payload)),
      },
      {
        headers: getHeaders(),
      }
    ),

  editContract: (payload) =>
    axios.put(`Contract/Put/${payload.id}`, getAddUpdatePayload(payload), {
      headers: getHeaders(),
    }),

  deleteContract: (payload) =>
    axios.delete(`Contract/Delete/${payload.id}`, {
      headers: getHeaders(),
    }),

  getAllContracts: () => {
    return axios
      .post(
        `Contract/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => {
        return sortAlphabetically(response.data.data, 'number');
      });
  },

  filterContracts: (payload) =>
    axios
      .post(
        `Contract/Search`,
        {
          take: 1000,
          filter: getFilters(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => {
        //Filtro acá porque no se como filtrar entidades relacionadas con el esquema actual de filtros
        if (payload.saldo === 2) {
          const allContracts = response.data.data;
          const withBalance = allContracts.filter(
            (c) => c.soldSpaces.findIndex((sp) => sp.balance > 0) !== -1
          );
          return sortAlphabetically(withBalance, 'number');
        }
        return sortAlphabetically(response.data.data, 'number');
      }),

  getCurrencies: () =>
    axios
      .post(
        'Currency/Search',
        {
          take: 1000,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),

  getEuroParities: () =>
    axios
      .post(
        'EuroParity/Search',
        {
          take: 1000,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data.data),

  // Ubicaciones
  getAllSpaceLocations: () =>
    axios
      .post(
        `AdvertisingSpaceLocationType/Search`,
        { take: 1000 },
        { headers: getHeaders() }
      )
      .then((response) => sortAlphabetically(response.data.data, 'name'))
      .catch((error) => {}),

  // Tipos de Espacio
  getAllSpaceTypes: (productId) =>
    axios
      .post(
        `ProductAdvertisingSpace/Search`,
        {
          take: 1000,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => sortAlphabetically(response.data.data, 'name'))
      .catch((error) => {}),

  getCountriesOptions: () =>
    axios
      .get(`Country/Options`, {
        headers: getHeaders(),
      })
      .then((response) => response.data),

  getContractHistorial: (contractId) =>
    axios
      .get(`Contract/GetContractHistorial/${contractId}`, {
        headers: getHeaders(),
      })
      .then((response) => response.data),
};
