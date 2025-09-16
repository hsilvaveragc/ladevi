export const getSubtotalContract = (values, availableProducts) => {
  let totalNeto = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { subTotal } = makeTotals(
      values,
      i,
      undefined,
      undefined,
      undefined,
      availableProducts,
      1
    );
    totalNeto += parseFloat(
      subTotal.toString().split('.').join('').replace(',', '.')
    );
  }

  return !totalNeto || isNaN(totalNeto) ? 0 : formatNumber(totalNeto);
};

const formatNumber = (number) => {
  return (Math.round(number * 100) / 100).toLocaleString('pt-BR', {
    maximumFractionDigits: 2,
  });
};

export const getTotalsDiscounts = (values, availableProducts) => {
  let descuentos = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { totalDiscounts } = makeTotals(
      values,
      i,
      undefined,
      undefined,
      undefined,
      availableProducts,
      2
    );
    descuentos += parseFloat(
      totalDiscounts.toString().split('.').join('').replace(',', '.')
    );
  }
  return !descuentos || isNaN(descuentos) ? 0 : formatNumber(descuentos);
};

export const getTotalTaxes = (values, availableProducts) => {
  let taxes = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { subtotalWithIva } = makeTotals(
      values,
      i,
      undefined,
      undefined,
      undefined,
      availableProducts,
      3
    );
    taxes += parseFloat(
      subtotalWithIva.toString().split('.').join('').replace(',', '.')
    );
  }
  return !taxes || isNaN(taxes) ? 0 : formatNumber(taxes);
};

export const getTotalContract = (values, availableProducts) => {
  let total = 0;
  for (let i = 0; i < values.soldSpaces.length; i++) {
    const { subTotal, subtotalWithIva, totalDiscounts } = makeTotals(
      values,
      i,
      undefined,
      undefined,
      undefined,
      availableProducts,
      4
    );
    total +=
      parseFloat(subTotal.toString().split('.').join('').replace(',', '.')) -
      parseFloat(
        totalDiscounts.toString().split('.').join('').replace(',', '.')
      ) +
      parseFloat(
        subtotalWithIva.toString().split('.').join('').replace(',', '.')
      );
  }

  return !total || isNaN(total) ? 0 : formatNumber(total);
};

export const getTotalSPNacDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.applyDiscountForSameCountry = checked;

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
  valuesAux.applyDiscountForSameCountry = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

export const getTotalSPChequeDiscount = (
  values,
  index,
  checked,
  availableProducts
) => {
  const valuesAux = { ...values };
  valuesAux.applyDiscountForCheck = checked;

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
  valuesAux.applyDiscountForCheck = checked;

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
  valuesAux.applyDiscountForOtherCountry = checked;

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
  valuesAux.applyDiscountForOtherCountry = checked;

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
  valuesAux.applyDiscountForLoyalty = checked;

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
  valuesAux.applyDiscountForLoyalty = checked;

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
  valuesAux.appyDiscountForAgency = checked;

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
  valuesAux.appyDiscountForAgency = checked;

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
  valuesAux.applyDiscountForVolume = checked;

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
  valuesAux.applyDiscountForVolume = checked;

  const unitario = getUnitarioSoldSpace(
    valuesAux,
    index,
    undefined,
    undefined,
    availableProducts
  );
  return unitario;
};

export const getUnitarioSoldSpace = (
  values,
  index,
  quantity,
  dollarParity,
  availableProducts,
  locationDiscount,
  spacePrice
) => {
  const { precioUnitario, descuentosUnitario } = makeTotals(
    values,
    index,
    quantity,
    dollarParity,
    //undefined
    spacePrice,
    availableProducts,
    5,
    locationDiscount
  );

  const unitario =
    parseFloat(
      precioUnitario.toString().split('.').join('').replace(',', '.')
    ) -
    parseFloat(
      descuentosUnitario.toString().split('.').join('').replace(',', '.')
    );

  return unitario;
};

export const getTotalSoldSpace = (
  values,
  index,
  quantity,
  dollarParity,
  availableProducts,
  locationDiscount,
  spacePrice
) => {
  const { subTotal, subtotalWithIva, totalDiscounts } = makeTotals(
    values,
    index,
    quantity,
    dollarParity,
    //undefined
    spacePrice,
    availableProducts,
    5,
    locationDiscount
  );

  const total =
    parseFloat(subTotal.toString().split('.').join('').replace(',', '.')) -
    parseFloat(
      totalDiscounts.toString().split('.').join('').replace(',', '.')
    ) +
    parseFloat(
      subtotalWithIva.toString().split('.').join('').replace(',', '.')
    );

  return total;
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

  const checkDiscount = values.applyDiscountForCheck
    ? (values.discountForCheck * subTotal) / 100
    : 0;

  const forSameCountryDiscount = values.applyDiscountForSameCountry
    ? (values.discountForSameCountry * subTotal) / 100
    : 0;

  const forSameOtherCountryDiscount = values.applyDiscountForOtherCountry
    ? (values.discountForOtherCountry * subTotal) / 100
    : 0;

  const forLoyaltyAppliedDiscount = values.applyDiscountForLoyalty
    ? (values.discountForLoyalty * subTotal) / 100
    : 0;

  const forAgencyAppliedDiscount = values.appyDiscountForAgency
    ? (values.discountForAgency * subTotal) / 100
    : 0;

  const forVolumeAppliedDiscount = values.applyDiscountForVolume
    ? (values.discountForVolume * subTotal) / 100
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

export const makeTotals = (
  values,
  index,
  quantity,
  dollarParity,
  spacePrice,
  availableProducts,
  type,
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

  const specialDiscountLocal = !values.soldSpaces[index].specialDiscount
    ? 0
    : parseFloat(
        values.soldSpaces[index].specialDiscount
          .replaceAll('.', '')
          .replaceAll(',', '.')
      );

  const dollarParityLocal =
    dollarParity ||
    parseFloat(
      values.currencyParity.toString().replaceAll('.', '').replaceAll(',', '.')
    );

  const gerentialDiscountLocal = !values.soldSpaces[index].gerentialDiscount
    ? 0
    : parseFloat(
        values.soldSpaces[index].gerentialDiscount
          .replaceAll('.', '')
          .replaceAll(',', '.')
      );

  const subTotal =
    qtyLocal *
    spacePriceLocal *
    (values.currencyId === 2 ? 1 : dollarParityLocal);

  const precioUnitario =
    spacePriceLocal * (values.currencyId === 2 ? 1 : dollarParityLocal);

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

  const checkDiscount = values.applyDiscountForCheck
    ? parseFloat(values.discountForCheck)
    : 0;

  const sameCountryDiscount = values.applyDiscountForSameCountry
    ? parseFloat(values.discountForSameCountry)
    : 0;

  const sameOtherCountryDiscount = values.applyDiscountForOtherCountry
    ? parseFloat(values.discountForOtherCountry)
    : 0;

  const loyaltyAppliedDiscount = values.applyDiscountForLoyalty
    ? parseFloat(values.discountForLoyalty)
    : 0;

  const agencyAppliedDiscount = values.appyDiscountForAgency
    ? parseFloat(values.discountForAgency)
    : 0;

  const volumeAppliedDiscount = values.applyDiscountForVolume
    ? parseFloat(values.discountForVolume)
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
