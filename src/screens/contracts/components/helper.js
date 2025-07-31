import "shared/utils/extensionsMethods.js";
import { CONSTANTS } from "shared/utils/constants";
import useUser from "shared/security/useUser";

export const getBillingConditions = () => [
  { id: 1, name: "Anticipada" },
  { id: 2, name: "Contra Publicacion" },
  { id: 3, name: "Canje" },
  { id: 4, name: "Sin Cargo" },
];

export const getPaymentMethod = () => [
  { id: 1, name: "Documentada" },
  { id: 2, name: "Un Pago" },
  { id: 3, name: "Otra" },
];

export const GetInitValuesInAddMode = () => {
  const { userRol, userId } = useUser();
  const actualDate = new Date();
  const endContract = new Date(
    actualDate.getFullYear() + 1,
    actualDate.getMonth(),
    actualDate.getDate()
  );

  return {
    activeTab: 1,
    id: "",
    number: "",
    clientId: "",
    clientIsAgency: false,
    clientCountryId: "",
    clientIsComtur: false,
    sellerId: userRol.isSeller ? parseFloat(userId) : "",
    billingCountryId: "",
    name: "",
    productId: "",
    productCountryId: "",
    noParity: false,
    currencyParity: "",
    contractDate: new Date(),
    start: actualDate,
    end: endContract,
    billingConditionId: "",
    iva: "",
    paymentMethodId: "",
    currencyId: CONSTANTS.USA_CURRENCY_ID,
    useEuro: false,
    paidOut: false,
    invoiceNumber: "",
    checkQuantity: "",
    daysToFirstPayment: "",
    daysBetweenChecks: "",
    quantitySP: 0,
    observations: "",
    publishingOrdersCounter: 0,
    productAdvertisingSpaceIdsPublished: [],
    soldSpaces: [
      {
        advertisingSpaceLocationTypeId: "",
        productAdvertisingSpaceId: "",
        typeSpecialDiscount: "",
        typeGerentialDiscount: "",
        quantity: "",
        specialDiscount: "",
        gerentialDiscount: "",
        descriptionSpecialDiscount: "",
        descriptionGerentialDiscount: "",
        total: "",
        balance: "",
        spacePrice: "",
        locationDiscount: "",
        unitPriceWithDiscounts: "",
        quantityOP: 0,
        discountForCheck: "",
        discountForLoyalty: "",
        discountForSameCountry: "",
        discountForOtherCountry: "",
        discountForAgency: "",
        applyDiscountForCheck: false,
        applyDiscountForLoyalty: false,
        applyDiscountForSameCountry: false,
        applyDiscountForOtherCountry: false,
        appyDiscountForAgency: false,
        applyDiscountForOtherCountry: false,
        applyDiscountForVolume: false,
        alicuotasAplicadas: [],
        ubicaciones: [],
      },
    ],
  };
};

export const GetInitValuesIsDuplicate = (
  availableClients,
  availableSpaceLocations,
  availableSpaceTypes,
  availableCurrencies,
  availableEuroParities,
  selectedItem,
  { values }
) => {
  const actualDate = new Date();
  const endContract = new Date(
    actualDate.getFullYear() + 1,
    actualDate.getMonth(),
    actualDate.getDate()
  );
  const client = availableClients.find(x => x.id === values.clientId);
  const { localCurrency } = getCurrenciesForClient(
    client.countryId,
    availableCurrencies
  );
  const finalCurrency =
    client.isComtur || localCurrency?.useEuro
      ? getModifiedEuroCurrency(availableEuroParities)
      : localCurrency;

  const discounts = [
    ["Check", 1],
    ["SameCountry", 2],
    ["OtherCountry", 3],
    ["Loyalty", 4],
    ["Agency", 5],
    ["Volume", 6],
  ];

  const processSpace = sp => ({
    ...sp,
    id: 0,
    typeSpecialDiscount: sp.typeSpecialDiscount,
    descriptionSpecialDiscount: sp.descriptionSpecialDiscount,
    specialDiscount: !isNaN(sp.specialDiscount)
      ? Number(sp.specialDiscount).toLocaleCurrency()
      : 0,
    typeGerentialDiscount: sp.typeGerentialDiscount,
    descriptionGerentialDiscount: sp.descriptionGerentialDiscount,
    gerentialDiscount: !isNaN(sp.gerentialDiscount)
      ? Number(sp.gerentialDiscount).toLocaleCurrency()
      : 0,
    balance: "",
    quantityOP: 0,
    alicuotasAplicadas: discounts
      .filter(([type]) => sp[`applyDiscountFor${type}`])
      .map(([type, id]) => ({
        id,
        alicuota: sp[`discountFor${type}`],
      })),
    ubicaciones: values.productId
      ? availableSpaceLocations.filter(x =>
          availableSpaceTypes
            .find(t => t.id === sp.productAdvertisingSpaceId)
            ?.productAdvertisingSpaceLocationDiscounts.some(
              pald => pald.advertisingSpaceLocationTypeId === x.id
            )
        )
      : [],
  });

  return {
    ...GetInitValuesInAddMode(),
    ...values,
    id: "",
    number: "",
    sellerId: client.applicationUserSellerId,
    clientIsAgency: client.isAgency,
    clientCountryId: client.countryId,
    clientIsComtur: client.isComtur,
    contractDate: new Date(),
    start: actualDate,
    end: endContract,
    invoiceNumber: "",
    paidOut: false,
    checkQuantity: "",
    daysToFirstPayment: "",
    daysBetweenChecks: "",

    currencyParity:
      values.currencyId == CONSTANTS.USA_CURRENCY_ID
        ? 1
        : finalCurrency?.currencyParities?.find(
            x =>
              new Date(x.start) <= new Date() && new Date(x.end) >= new Date()
          )?.localCurrencyToDollarExchangeRate ?? 1,
    publishingOrdersCounter: 0,
    quantitySP: 0,
    productAdvertisingSpaceIdsPublished: [],
    soldSpaces: values.soldSpaces.map(processSpace),
  };
};

export const GetInitValuesIsEditMode = (
  availableClients,
  availableProducts,
  availableSpaceLocations,
  availableSpaceTypes,
  selectedItem
) => {
  const selectedClient = availableClients.find(
    c => c.id === selectedItem?.clientId ?? 0
  );

  const selectedProduct = availableProducts.find(
    c => c.id === selectedItem?.productId ?? 0
  );

  let quantitySP = 0;
  if (selectedItem.soldSpaces) {
    selectedItem.soldSpaces.forEach(function(sp) {
      quantitySP += parseFloat(sp.quantity);
    });
  }

  let initValues = {
    activeTab: 1,
    id: selectedItem.id,
    number: selectedItem.number,
    clientId: selectedItem.clientId,
    clientIsAgency: selectedClient.isAgency,
    clientCountryId: selectedClient.countryId,
    clientIsComtur: selectedClient.isComtur,
    sellerId: selectedItem.sellerId,
    billingCountryId: selectedItem.billingCountryId,
    name: selectedItem.name,
    productId: selectedItem.productId,
    productCountryId: selectedProduct.countryId,
    noParity: false,
    currencyParity:
      selectedItem.currencyParity?.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      }) ?? 1,
    contractDate: selectedItem.contractDate,
    iva: selectedItem.iva,
    billingConditionId: selectedItem.billingConditionId,
    paymentMethodId: selectedItem.paymentMethodId,
    currencyId: !selectedItem.useEuro ? selectedItem.currencyId : -1,
    useEuro: selectedItem.useEuro,
    start: selectedItem.start,
    end: selectedItem.end,
    paidOut: selectedItem.paidOut,
    invoiceNumber: selectedItem.invoiceNumber,
    checkQuantity: selectedItem.checkQuantity ?? "",
    daysToFirstPayment: selectedItem.daysToFirstPayment ?? "",
    daysBetweenChecks: selectedItem.daysBetweenChecks ?? "",
    quantitySP: quantitySP,
    observations: selectedItem.observations,
    soldSpaces: selectedItem.soldSpaces.map(sp => ({
      ...sp,
      specialDiscount: sp.specialDiscount.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      }),
      gerentialDiscount: sp.gerentialDiscount.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      }),
      total: sp.total.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      }),
      unitPriceWithDiscounts: sp.unitPriceWithDiscounts.toLocaleString(
        "pt-BR",
        {
          maximumFractionDigits: 2,
        }
      ),
      quantityOP: selectedItem.publishingOrders.filter(
        po => po.soldSpaceId === sp.id
      ).length,
    })),
    publishingOrdersCounter: selectedItem.publishingOrders.length,
    productAdvertisingSpaceIdsPublished: Array.from(
      new Set(
        selectedItem.publishingOrders?.map(x => x.productAdvertisingSpaceId)
      )
    ),
  };

  initValues.soldSpaces.forEach(ss => {
    ss.alicuotasAplicadas = [];
    if (ss.applyDiscountForCheck) {
      ss.alicuotasAplicadas.push({
        id: 1,
        alicuota: ss.discountForCheck,
      });
    }

    if (ss.applyDiscountForSameCountry) {
      ss.alicuotasAplicadas.push({
        id: 2,
        alicuota: ss.discountForSameCountry,
      });
    }

    if (ss.applyDiscountForOtherCountry) {
      ss.alicuotasAplicadas.push({
        id: 3,
        alicuota: ss.discountForOtherCountry,
      });
    }

    if (ss.applyDiscountForLoyalty) {
      ss.alicuotasAplicadas.push({
        id: 4,
        alicuota: ss.discountForLoyalty,
      });
    }

    if (ss.applyDiscountForAgency) {
      ss.alicuotasAplicadas.push({
        id: 5,
        alicuota: ss.discountForAgency,
      });
    }

    if (ss.applyDiscountForVolume) {
      ss.alicuotasAplicadas.push({
        id: 6,
        alicuota: ss.discountForVolume,
      });
    }

    ss.ubicaciones = [];
    if (selectedItem.productId) {
      let spaceTypeSelected = availableSpaceTypes.find(
        x => x.id === ss.productAdvertisingSpaceId
      );
      //setear ubicaciones de cada spacesold
      ss.ubicaciones = availableSpaceLocations.filter(x =>
        spaceTypeSelected.productAdvertisingSpaceLocationDiscounts.find(
          pald => pald.advertisingSpaceLocationTypeId === x.id
        )
      );
    }

    return ss;
  });

  return initValues;
};

export const getCountriesForBilling = (
  originalCountriesForBilling,
  entitiesWithCountry,
  idToFinded
) => {
  const entitySelected = entitiesWithCountry.find(x => x.id === idToFinded);

  if (entitySelected) {
    let result = [
      ...originalCountriesForBilling,
      {
        id: entitySelected.countryId,
        name: entitySelected.countryName,
      },
    ];
    if (result && result.length > 0) {
      const idsUnicos = new Set();
      result = result.filter(item =>
        idsUnicos.has(item.id) ? false : idsUnicos.add(item.id)
      );
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  } else return originalCountriesForBilling;
};

export const getCurrenciesForClient = (
  clientCountryId,
  availableCurrencies
) => {
  const usdCurrency = availableCurrencies.find(
    currency => currency.countryId === CONSTANTS.USA_COUNTRY_ID
  );

  const localCurrency =
    clientCountryId && clientCountryId !== CONSTANTS.USA_COUNTRY_ID
      ? availableCurrencies.find(
          currency => currency.countryId === clientCountryId
        )
      : undefined;

  return { usdCurrency, localCurrency };
};

export const getModifiedEuroCurrency = availableEuroParities => {
  return {
    id: -1,
    name: "EUR",
    currencyParities: availableEuroParities.map(
      ({ id, euroToDollarExchangeRate, start, end }) => ({
        id,
        localCurrencyToDollarExchangeRate: euroToDollarExchangeRate,
        start,
        end,
      })
    ),
  };
};
