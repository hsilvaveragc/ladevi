import * as Yup from 'yup';
import {
  not,
  isEmpty,
  isNil,
  compose,
  map,
  filter,
  keys,
  equals,
  reduce,
  find,
  propEq,
  sort,
  ascend,
  prop,
} from 'ramda';

export const transformIntoClientTaxes = (res) => {
  const byOrder = ascend(prop('order'));

  const identificationOptions = res
    .filter((tax) => tax.isIdentificationField)
    .map((tax) => ({ id: tax.id, name: tax.name, countryId: tax.countryId }));

  const taxOptions = res
    .filter((tax) => not(tax.isIdentificationField))
    .map((tax) => ({
      ...tax,
      options: tax.options.map((option) => ({ id: option, name: option })),
    }));
  return {
    identificationOptions,
    taxOptions: sort(byOrder, taxOptions),
  };
};

export const buildFilterCriteria = (filterCriteria) => {
  const filters = compose(
    // handles brandName dropdown behaviour
    map((filter) =>
      equals('fullName', filter.field)
        ? { ...filter, operator: 'contains' }
        : filter
    ),
    filter((filter) => not(isNil(filter))),
    //handles status dropdown behaviour
    map((filter) =>
      equals('status', filter.field)
        ? equals('all', filter.value)
          ? null
          : {
              ...filter,
              field: 'isEnabled',
              value: true,
            }
        : filter
    ),
    filter((filter) => not(isNil(filter))),
    map((key) =>
      not(isEmpty(filterCriteria[key])) && not(equals(filterCriteria[key], -1))
        ? { field: key, operator: 'eq', value: filterCriteria[key] }
        : null
    ),
    keys
  )(filterCriteria);

  const filterQuery = {
    //take: 1000,
    filter: {
      logic: 'and',
      filters: [...filters],
    },
  };

  return isEmpty(filters) ? {} : filterQuery;
};

export const buildAddPayload = (payload) => {
  const clientTaxes = compose(
    (taxes) => [
      ...taxes,
      {
        taxTypeId: +payload.identificationTaxId,
        value: String(payload.identificationTaxValue),
      },
    ],
    reduce(
      (acc, item) => [
        ...acc,
        { taxTypeId: +item, value: String(payload.clientTaxes[item]) },
      ],
      []
    ),
    keys
  )(payload.clientTaxes);

  return { ...payload, clientTaxes };
};

export const parseClientTaxes = (client) => {
  if (client.clientTaxes) {
    const identificationOptions = client.clientTaxes
      .filter((tax) => tax.taxType.isIdentificationField)
      .map((tax) => ({
        id: tax.taxTypeId,
        name: tax.taxType.name,
        value: tax.value,
      }));

    const taxOptions = client.clientTaxes
      .filter((tax) => not(tax.taxType.isIdentificationField))
      .map((tax) => ({
        ...tax,
        options: tax.taxType.options.map((option) => ({
          id: option,
          name: option,
        })),
      }));

    return {
      ...client,
      identificationOptions,
      taxOptions,
    };
  }
  return {
    ...client,
  };
};

export const generateClientTaxesInitialValues = (options, client) => {
  return reduce(
    (acc, tax) => {
      const selectedTax = find(
        propEq('taxTypeId', tax.id),
        parseClientTaxes(client).taxOptions
      );
      acc[tax.id] = selectedTax.value;
      return acc;
    },
    {},
    options
  );
};

export const generateEditInitialValues = (options) => {
  return reduce(
    (acc, tax) => {
      acc[tax.taxTypeId] = {
        value: tax.value,
        id: tax.id,
      };
      return acc;
    },
    {},
    options
  );
};

export const generateValidationSchema = (options) =>
  compose(
    reduce((acc, tax) => {
      acc[tax] = Yup.string().required('Requerido');
      return acc;
    }, {}),
    keys
  )(options);

export const buildEditPayload = (payload) => {
  const clientTaxes = compose(
    (taxes) => [
      ...taxes,
      {
        taxTypeId: +payload.identificationTaxId,
        value: String(payload.identificationTaxValue),
      },
    ],
    reduce((acc, item) => {
      return [
        ...acc,
        {
          taxTypeId: +item,
          value: String(payload.clientTaxes[item].value),
          id: +payload.clientTaxes[item].id,
        },
      ];
    }, []),
    keys
  )(payload.clientTaxes);

  const ctFixed = clientTaxes.map((ct) => ({
    id: ct.id,
    taxTypeId: ct.taxTypeId,
    value: ct.value,
  }));

  return { ...payload, clientTaxes: ctFixed };
};
