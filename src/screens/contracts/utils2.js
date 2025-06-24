import { values } from "ramda";

const parseNumberValue = value => {
  if (!value) return 0;
  if (typeof value === "string") {
    return parseFloat(value.replaceAll(".", "").replaceAll(",", "."));
  }
  return parseFloat(value);
};

export const getTotalSPChequeDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForCheck = checked;

  const total = getTotalSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return total;
};

export const getUnitarioSPChequeDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForCheck = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

export const getTotalSPNacDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForSameCountry = checked;

  const total = getTotalSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return total;
};
export const getUnitarioSPNacDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForSameCountry = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

export const getTotalSPInterDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForOtherCountry = checked;

  const total = getTotalSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return total;
};

export const getUnitarioSPInterDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForOtherCountry = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

export const getTotalSPFidelDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForLoyalty = checked;

  const total = getTotalSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return total;
};

export const getUnitarioSPFidelDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForLoyalty = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

export const getTotalSPAgencyDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].appyDiscountForAgency = checked;

  const total = getTotalSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return total;
};
export const getUnitarioSPAgencyDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].appyDiscountForAgency = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

export const getTotalSPVolumenDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForVolume = checked;

  const total = getTotalSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return total;
};

export const getUnitarioSPVolumenDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.soldSpaces[index].applyDiscountForVolume = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

//-----------------------------------------
export const getSubtotalContract = (values, availableProducts) => {
  let totalNeto = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { subTotal } = makeTotals(values, i);
    totalNeto += parseFloat(
      subTotal
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    );
  }

  return !totalNeto || isNaN(totalNeto) ? 0 : formatNumber(totalNeto);
};

const formatNumber = number => {
  return (Math.round(number * 100) / 100).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  });
};

export const getTotalsDiscounts = values => {
  let descuentos = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { totalDiscounts } = makeTotals(values, i);
    descuentos += parseFloat(
      totalDiscounts
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    );
  }
  return !descuentos || isNaN(descuentos) ? 0 : formatNumber(descuentos);
};

export const getTotalTaxes = (values, availableProducts) => {
  let taxes = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { subtotalWithIva } = makeTotals(values, i);
    taxes += parseFloat(
      subtotalWithIva
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    );
  }
  return !taxes || isNaN(taxes) ? 0 : formatNumber(taxes);
};

export const getTotalContract = values => {
  let total = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { subTotal, subtotalWithIva, totalDiscounts } = makeTotals(values, i);
    total +=
      parseFloat(
        subTotal
          .toString()
          .split(".")
          .join("")
          .replace(",", ".")
      ) -
      parseFloat(
        totalDiscounts
          .toString()
          .split(".")
          .join("")
          .replace(",", ".")
      ) +
      parseFloat(
        subtotalWithIva
          .toString()
          .split(".")
          .join("")
          .replace(",", ".")
      );
  }

  return !total || isNaN(total) ? 0 : formatNumber(total);
};

export const getUnitarioSoldSpace = (
  values,
  index,
  quantity,
  dollarParity,
  locationDiscount,
  spacePrice
) => {
  const { precioUnitario, descuentosUnitario } = makeTotals(
    values,
    index,
    quantity,
    dollarParity,
    spacePrice,
    locationDiscount
  );

  const unitario =
    parseFloat(
      precioUnitario
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    ) -
    parseFloat(
      descuentosUnitario
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    );

  return unitario;
};

export const getTotalWithoutSPDiscount = (values, index) => {
  const subTotal =
    values.soldSpaces[index].quantity *
    values.soldSpaces[index].spacePrice *
    values.currencyParity;

  const soldSpaceGerencialDiscounts =
    values.soldSpaces[index].managerDiscountAmount ||
    values.soldSpaces[index].gerentialDiscount
      ? (subTotal *
          values.soldSpaces[index].gerentialDiscount *
          (values.soldSpaces[index].typeGerentialDiscount === 1 ? 1 : -1)) /
        100
      : 0;

  const soldSpacesTotalDiscounts = soldSpaceGerencialDiscounts;

  const checkDiscount = values.soldSpaces[index].applyDiscountForCheck
    ? (values.soldSpaces[index].discountForCheck * subTotal) / 100
    : 0;

  const forSameCountryDiscount = values.soldSpaces[index]
    .applyDiscountForSameCountry
    ? (values.soldSpaces[index].discountForSameCountry * subTotal) / 100
    : 0;

  const forSameOtherCountryDiscount = values.soldSpaces[index]
    .applyDiscountForOtherCountry
    ? (values.soldSpaces[index].discountForOtherCountry * subTotal) / 100
    : 0;

  const forLoyaltyAppliedDiscount = values.soldSpaces[index]
    .applyDiscountForLoyalty
    ? (values.soldSpaces[index].discountForLoyalty * subTotal) / 100
    : 0;

  const forAgencyAppliedDiscount = values.soldSpaces[index]
    .appyDiscountForAgency
    ? (values.soldSpaces[index].discountForAgency * subTotal) / 100
    : 0;

  const forVolumeAppliedDiscount = values.soldSpaces[index]
    .applyDiscountForVolume
    ? (values.soldSpaces[index].discountForVolume * subTotal) / 100
    : 0;

  const discountsTotal =
    checkDiscount +
    forSameCountryDiscount +
    forSameOtherCountryDiscount +
    forLoyaltyAppliedDiscount +
    forAgencyAppliedDiscount +
    forVolumeAppliedDiscount; // +
  //soldSpacesTotalDiscounts;

  const totalDiscounts = discountsTotal + soldSpacesTotalDiscounts;
  const subtotalWithIva = (subTotal - totalDiscounts) * values.iva;

  return subTotal - totalDiscounts + subtotalWithIva;
};

export const getTotalSoldSpace = (
  values,
  index,
  quantity,
  dollarParity,
  locationDiscount,
  spacePrice
) => {
  const { subTotal, subtotalWithIva, totalDiscounts } = makeTotals(
    values,
    index,
    quantity,
    dollarParity,
    spacePrice,
    locationDiscount
  );

  const total =
    parseFloat(
      subTotal
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    ) -
    parseFloat(
      totalDiscounts
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    ) +
    parseFloat(
      subtotalWithIva
        .toString()
        .split(".")
        .join("")
        .replace(",", ".")
    );

  return total;
};

export const makeTotals = (
  values,
  index,
  quantity,
  dollarParity,
  spacePrice,
  locationDiscount
) => {
  if (values.billingCountryId == 54) {
    values.iva = 0;
  }

  const qtyLocal =
    quantity ||
    (!values.soldSpaces[index].quantity
      ? 0
      : values.soldSpaces[index].quantity);

  const spacePriceLocal =
    !spacePrice && !values.soldSpaces[index].spacePrice
      ? 0
      : spacePrice || values.soldSpaces[index].spacePrice;

  const specialDiscountLocal = parseNumberValue(
    values.soldSpaces[index].specialDiscount
  );

  const dollarParityLocal =
    dollarParity ||
    parseFloat(
      values.currencyParity
        .toString()
        .replaceAll(".", "")
        .replaceAll(",", ".")
    );

  const gerentialDiscountLocal = parseNumberValue(
    values.soldSpaces[index].gerentialDiscount
  );

  const subTotal =
    qtyLocal *
    spacePriceLocal *
    (!values.currencyId || values.currencyId === 2 ? 1 : dollarParityLocal);

  const precioUnitario =
    spacePriceLocal *
    (!values.currencyId || values.currencyId === 2 ? 1 : dollarParityLocal);

  const soldSpaceSpecialDiscounts =
    specialDiscountLocal || values.soldSpaces[index].typeSpecialDiscount
      ? (specialDiscountLocal *
          (values.soldSpaces[index].typeSpecialDiscount === 1 ? 1 : -1)) /
        100
      : 0;

  const soldSpaceGerencialDiscounts =
    gerentialDiscountLocal || values.soldSpaces[index].typeGerentialDiscount
      ? (gerentialDiscountLocal *
          (values.soldSpaces[index].typeGerentialDiscount === 1 ? 1 : -1)) /
        100
      : 0;

  const checkDiscount = values.soldSpaces[index].applyDiscountForCheck
    ? parseFloat(values.soldSpaces[index].discountForCheck)
    : 0;

  const sameCountryDiscount = values.soldSpaces[index]
    .applyDiscountForSameCountry
    ? parseFloat(values.soldSpaces[index].discountForSameCountry)
    : 0;

  const sameOtherCountryDiscount = values.soldSpaces[index]
    .applyDiscountForOtherCountry
    ? parseFloat(values.soldSpaces[index].discountForOtherCountry)
    : 0;

  const loyaltyAppliedDiscount = values.soldSpaces[index]
    .applyDiscountForLoyalty
    ? parseFloat(values.soldSpaces[index].discountForLoyalty)
    : 0;

  const agencyAppliedDiscount = values.soldSpaces[index].appyDiscountForAgency
    ? parseFloat(values.soldSpaces[index].discountForAgency)
    : 0;

  const volumeAppliedDiscount = values.soldSpaces[index].applyDiscountForVolume
    ? parseFloat(values.soldSpaces[index].discountForVolume)
    : 0;

  const locationDiscountAux = isNaN(locationDiscount)
    ? values.soldSpaces[index].locationDiscount
    : locationDiscount;
  const locationDiscountLocal = !isNaN(locationDiscountAux)
    ? locationDiscountAux
    : 0;

  let newSubTotal = subTotal - (subTotal * checkDiscount) / 100;
  newSubTotal = newSubTotal - (newSubTotal * sameCountryDiscount) / 100;
  newSubTotal = newSubTotal - (newSubTotal * sameOtherCountryDiscount) / 100;
  newSubTotal = newSubTotal - (newSubTotal * loyaltyAppliedDiscount) / 100;
  newSubTotal = newSubTotal - (newSubTotal * agencyAppliedDiscount) / 100;
  newSubTotal = newSubTotal - (newSubTotal * volumeAppliedDiscount) / 100;
  newSubTotal = newSubTotal - (newSubTotal * locationDiscountLocal) / 100;
  newSubTotal = newSubTotal - newSubTotal * (soldSpaceSpecialDiscounts || 0);
  newSubTotal = newSubTotal - newSubTotal * (soldSpaceGerencialDiscounts || 0);

  let newUnitario = precioUnitario - (precioUnitario * checkDiscount) / 100;
  newUnitario = newUnitario - (newUnitario * sameCountryDiscount) / 100;
  newUnitario = newUnitario - (newUnitario * sameOtherCountryDiscount) / 100;
  newUnitario = newUnitario - (newUnitario * loyaltyAppliedDiscount) / 100;
  newUnitario = newUnitario - (newUnitario * agencyAppliedDiscount) / 100;
  newUnitario = newUnitario - (newUnitario * volumeAppliedDiscount) / 100;
  newUnitario = newUnitario - (newUnitario * locationDiscountLocal) / 100;
  newUnitario = newUnitario - newUnitario * (soldSpaceSpecialDiscounts || 0);
  newUnitario = newUnitario - newUnitario * (soldSpaceGerencialDiscounts || 0);

  const totalDiscounts = subTotal - newSubTotal;

  const discountsUni = precioUnitario - newUnitario;

  const subtotalWithIva = (subTotal - totalDiscounts) * values.iva;

  const formattedSubtotal =
    !subTotal || isNaN(subTotal) ? 0 : formatNumber(subTotal);

  const formattedUnitario =
    !precioUnitario || isNaN(precioUnitario) ? 0 : formatNumber(precioUnitario);

  const formattedTaxes =
    !subtotalWithIva || isNaN(subtotalWithIva)
      ? 0
      : formatNumber(subtotalWithIva);
  const formattedDiscounts =
    !totalDiscounts || isNaN(totalDiscounts) ? 0 : formatNumber(totalDiscounts);

  const formattedDiscountsUni =
    !discountsUni || isNaN(discountsUni) ? 0 : formatNumber(discountsUni);

  const totalSP = subTotal - totalDiscounts + subtotalWithIva;
  const formattedTotal = !totalSP || isNaN(totalSP) ? 0 : formatNumber(totalSP);
  const unitarioConIVA = (precioUnitario - discountsUni) * values.iva;

  const formattedIVAUnitario =
    !unitarioConIVA || isNaN(unitarioConIVA) ? 0 : formatNumber(unitarioConIVA);

  return {
    subTotal: formattedSubtotal,
    subtotalWithIva: formattedTaxes,
    totalDiscounts: formattedDiscounts,
    precioUnitario: formattedUnitario,
    descuentosUnitario: formattedDiscountsUni,
    totalSoldSpace: formattedTotal,
    unitarioConIVA: formattedIVAUnitario,
  };
};

export const parseFloatRegionArg = value =>
  parseFloat(
    value
      .toString()
      .split(".")
      .join("")
      .replace(",", ".")
  );
