import React, { Fragment, useEffect, useState } from 'react';
import { equals } from 'ramda';
import { FieldArray } from 'formik';

import 'shared/utils/extensionsMethods.js';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import InputCheckboxField from 'shared/components/InputCheckboxField';
import { RemoveButton } from 'shared/components/Buttons';

import {
  makeTotals,
  getTotalSPChequeDiscount,
  getTotalSoldSpace,
  getUnitarioSoldSpace,
  getUnitarioSPChequeDiscount,
  getTotalSPNacDiscount,
  getUnitarioSPNacDiscount,
  getTotalSPInterDiscount,
  getUnitarioSPInterDiscount,
  getTotalSPFidelDiscount,
  getUnitarioSPFidelDiscount,
  getTotalSPAgencyDiscount,
  getUnitarioSPAgencyDiscount,
  getTotalSPVolumenDiscount,
  getUnitarioSPVolumenDiscount,
  parseFloatRegionArg,
} from '../../utils2';

const SpacesSoldData = ({
  addMode,
  editMode,
  deleteMode,
  availableProducts,
  availableSpaceTypes,
  availableSpaceLocations,
  formikProps,
  isSeller,
  selectedItem,
  productSelected,
}) => {
  const countryAndClientSameCountry = () => {
    return equals(
      formikProps.values.clientCountryId,
      formikProps.values.productCountryId
    );
  };

  const isAnticipatedContract = formikProps.values.billingConditionId === 1;
  const invoiceNumberHasValue = formikProps.values.invoiceNumber !== '';
  const disabledByInvoiceNumber =
    isAnticipatedContract && invoiceNumberHasValue && editMode;

  return (
    <FieldArray
      name='soldSpaces'
      validateOnChange={false}
      render={({ remove, push }) => (
        <>
          {formikProps.values.soldSpaces.length > 0 &&
            formikProps.values.soldSpaces.map((item, index) => {
              const spaceType = availableSpaceTypes.find(
                (x) => x.id === item.productAdvertisingSpaceId
              );

              const dollarPrice =
                addMode || item.productAdvertisingSpaceId !== spaceType?.id
                  ? (spaceType?.dollarPrice ?? undefined)
                  : item.spacePrice;

              const spacePrice = editMode ? dollarPrice : undefined;

              const {
                subTotal,
                subtotalWithIva,
                totalDiscounts,
                precioUnitario,
                descuentosUnitario,
                totalSoldSpace,
                unitarioConIVA,
              } = makeTotals(
                formikProps.values,
                index,
                undefined,
                undefined,
                spacePrice
              );
              const isDisabled =
                formikProps.values.productAdvertisingSpaceIdsPublished.some(
                  (x) =>
                    x ==
                    formikProps.values.soldSpaces[index]
                      .productAdvertisingSpaceId
                );

              return (
                <Fragment key={index}>
                  <div className='space-container' key={index}>
                    <div className='form-row'>
                      <div className='col-3'>
                        <InputSelectField
                          labelText='Tipo de Espacio *'
                          name={`soldSpaces.${index}.productAdvertisingSpaceId`}
                          options={availableSpaceTypes.filter(
                            (x) => x.productId === formikProps.values.productId
                          )}
                          onChangeHandler={(st) => {
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.productAdvertisingSpaceId`,
                              st.id
                            );
                            const ubicaciones = availableSpaceLocations.filter(
                              (x) =>
                                st.productAdvertisingSpaceLocationDiscounts.find(
                                  (pald) =>
                                    pald.advertisingSpaceLocationTypeId === x.id
                                )
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.ubicaciones`,
                              ubicaciones
                            );

                            if (
                              formikProps.values.soldSpaces[index]
                                .advertisingSpaceLocationTypeId &&
                              !ubicaciones.find(
                                (u) =>
                                  u.id ==
                                  formikProps.values.soldSpaces[index]
                                    .advertisingSpaceLocationTypeId
                              )
                            ) {
                              formikProps.setFieldValue(
                                `soldSpaces.${index}.advertisingSpaceLocationTypeId`,
                                ubicaciones[0].id
                              );
                            }

                            let newPrice = 0;
                            let discountForCheck = 0;
                            let discountForLoyalty = 0;
                            let discountForSameCountry = 0;
                            let discountForOtherCountry = 0;
                            let discountForAgency = 0;
                            let discountForVolume = 0;
                            let discountForLocation = 0;

                            if (
                              addMode ||
                              !selectedItem.soldSpaces[index] ||
                              st.id !==
                                selectedItem.soldSpaces[index]
                                  .productAdvertisingSpaceId
                            ) {
                              newPrice = st.dollarPrice;
                              discountForCheck = st.discountForCheck;
                              discountForLoyalty = st.discountForLoyalty;
                              discountForSameCountry =
                                st.discountForSameCountry;
                              discountForOtherCountry =
                                st.discountForOtherCountry;
                              discountForAgency = st.discountForAgency;
                              discountForVolume =
                                st.productAdvertisingSpaceVolumeDiscounts.find(
                                  (pv) =>
                                    pv.rangeStart <=
                                      formikProps.values.soldSpaces[index]
                                        .quantity &&
                                    pv.rangeEnd >
                                      formikProps.values.soldSpaces[index]
                                        .quantity
                                )?.discount ?? 0;

                              if (
                                formikProps.values.soldSpaces[index]
                                  .advertisingSpaceLocationTypeId
                              ) {
                                discountForLocation =
                                  st.productAdvertisingSpaceLocationDiscounts.find(
                                    (pl) =>
                                      pl.advertisingSpaceLocationTypeId ===
                                      ubicaciones[0].id
                                  ).discount ?? 0;
                              }
                            } else {
                              newPrice =
                                selectedItem.soldSpaces[index].spacePrice;
                              discountForCheck =
                                selectedItem.soldSpaces[index].discountForCheck;
                              discountForLoyalty =
                                selectedItem.soldSpaces[index]
                                  .discountForLoyalty;
                              discountForSameCountry =
                                selectedItem.soldSpaces[index]
                                  .discountForSameCountry;
                              discountForOtherCountry =
                                selectedItem.soldSpaces[index]
                                  .discountForOtherCountry;
                              discountForAgency =
                                selectedItem.soldSpaces[index]
                                  .discountForAgency;
                              discountForVolume =
                                selectedItem.soldSpaces[index]
                                  .discountForVolume;
                              discountForLocation =
                                selectedItem.soldSpaces[index].locationDiscount;
                            }
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.spacePrice`,
                              newPrice
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.discountForCheck`,
                              discountForCheck
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.discountForLoyalty`,
                              discountForLoyalty
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.discountForSameCountry`,
                              discountForSameCountry
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.discountForOtherCountry`,
                              discountForOtherCountry
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.discountForAgency`,
                              discountForAgency
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.discountForVolume`,
                              discountForVolume
                            );

                            const alicuotasAplicadas = [];
                            if (
                              formikProps.values.soldSpaces[index]
                                .applyDiscountForCheck
                            )
                              alicuotasAplicadas.push({
                                id: 1,
                                alicuota: discountForCheck,
                              });
                            if (
                              formikProps.values.soldSpaces[index]
                                .applyDiscountForSameCountry
                            )
                              alicuotasAplicadas.push({
                                id: 2,
                                alicuota: discountForSameCountry,
                              });
                            if (
                              formikProps.values.soldSpaces[index]
                                .applyDiscountForOtherCountry
                            )
                              alicuotasAplicadas.push({
                                id: 3,
                                alicuota: discountForOtherCountry,
                              });
                            if (
                              formikProps.values.soldSpaces[index]
                                .applyDiscountForLoyalty
                            )
                              alicuotasAplicadas.push({
                                id: 4,
                                alicuota: discountForLoyalty,
                              });
                            if (
                              formikProps.values.soldSpaces[index]
                                .applyDiscountForAgency
                            )
                              alicuotasAplicadas.push({
                                id: 5,
                                alicuota: discountForAgency,
                              });
                            if (
                              formikProps.values.soldSpaces[index]
                                .applyDiscountForVolume
                            )
                              alicuotasAplicadas.push({
                                id: 6,
                                alicuota: discountForVolume,
                              });
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.alicuotasAplicadas`,
                              alicuotasAplicadas
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.locationDiscount`,
                              discountForLocation
                            );

                            const valuesLocal = {
                              ...formikProps.values,
                            };

                            if (formikProps.values.soldSpaces[index].quantity) {
                              valuesLocal.soldSpaces[index].discountForCheck =
                                discountForCheck ? discountForCheck : 0;
                              valuesLocal.soldSpaces[index].discountForLoyalty =
                                discountForLoyalty ? discountForLoyalty : 0;
                              valuesLocal.soldSpaces[
                                index
                              ].discountForSameCountry = discountForSameCountry
                                ? discountForSameCountry
                                : 0;
                              valuesLocal.soldSpaces[
                                index
                              ].discountForOtherCountry =
                                discountForOtherCountry
                                  ? discountForOtherCountry
                                  : 0;
                              valuesLocal.soldSpaces[index].discountForAgency =
                                discountForAgency ? discountForAgency : 0;
                              valuesLocal.soldSpaces[index].discountForVolume =
                                discountForVolume ? discountForVolume : 0;

                              const quantity =
                                formikProps.values.soldSpaces[index].quantity;

                              const parity = formikProps.values.currencyParity;

                              const unitarioSoldSpace = getUnitarioSoldSpace(
                                valuesLocal,
                                index,
                                quantity,
                                parity,
                                discountForLocation,
                                newPrice
                              );

                              formikProps.setFieldValue(
                                `soldSpaces.${index}.unitPriceWithDiscounts`,
                                unitarioSoldSpace.toLocaleString('pt-BR', {
                                  maximumFractionDigits: 2,
                                })
                              );
                            }

                            // Recalculamos el total del espacio
                            const totalSoldSpace = getTotalSoldSpace(
                              valuesLocal,
                              index,
                              undefined,
                              dollarPrice,
                              discountForLocation,
                              newPrice
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.total`,
                              totalSoldSpace.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );
                          }}
                          disabled={
                            deleteMode ||
                            (isSeller && editMode) ||
                            isDisabled ||
                            disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'productAdvertisingSpaceId'
                            ]
                          }
                        />
                      </div>
                      <div className='col-5'>
                        <InputSelectField
                          labelText='Ubicación *'
                          name={`soldSpaces.${index}.advertisingSpaceLocationTypeId`}
                          options={
                            formikProps.values.soldSpaces[index]?.ubicaciones ??
                            []
                          }
                          onChangeHandler={(ubicacion) => {
                            let discountForlocation = 0;
                            if (
                              addMode ||
                              !selectedItem.soldSpaces[index] ||
                              ubicacion.id !==
                                selectedItem.soldSpaces[index]
                                  .advertisingSpaceLocationTypeId
                            ) {
                              const spaceTypeSelected =
                                availableSpaceTypes.find(
                                  (x) =>
                                    x.id ===
                                    formikProps.values.soldSpaces[index]
                                      .productAdvertisingSpaceId
                                );
                              discountForlocation =
                                spaceTypeSelected.productAdvertisingSpaceLocationDiscounts.find(
                                  (pl) =>
                                    pl.advertisingSpaceLocationTypeId ===
                                    ubicacion.id
                                ).discount ?? 0;
                            } else {
                              discountForlocation =
                                selectedItem.soldSpaces[index].locationDiscount;
                            }
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.locationDiscount`,
                              discountForlocation
                            );
                            //Recalculamos el total del espacio
                            const totalSoldSpace = getTotalSoldSpace(
                              formikProps.values,
                              index,
                              undefined,
                              undefined,
                              availableProducts,
                              discountForlocation
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.total`,
                              totalSoldSpace.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );

                            const unitarioSoldSpace = getUnitarioSoldSpace(
                              formikProps.values,
                              index,
                              undefined,
                              undefined,
                              discountForlocation
                            );
                            formikProps.setFieldValue(
                              `soldSpaces.${index}.unitPriceWithDiscounts`,
                              unitarioSoldSpace.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );
                          }}
                          disabled={
                            deleteMode ||
                            (isSeller && editMode) ||
                            disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'advertisingSpaceLocationTypeId'
                            ]
                          }
                        />
                      </div>
                      <div className='col-2'>
                        <InputTextField
                          labelText='Cantidad *'
                          name={`soldSpaces.${index}.quantity`}
                          disabled={
                            deleteMode ||
                            (isSeller && editMode) ||
                            disabledByInvoiceNumber
                          }
                          onChangeHandler={(evt) => {
                            const spaceTypeSelected = availableSpaceTypes.find(
                              (x) =>
                                x.id ===
                                formikProps.values.soldSpaces[index]
                                  .productAdvertisingSpaceId
                            );

                            const quantityValue = !evt.target.value
                              ? 0
                              : Number(evt.target.value);

                            const quantitySPs =
                              parseFloat(
                                formikProps.values.soldSpaces
                                  .filter((item, i) => i !== index)
                                  .reduce((acc, item) => acc + item.quantity, 0)
                              ) + parseFloat(quantityValue);

                            formikProps.setFieldValue(
                              'quantitySP',
                              quantitySPs
                            );

                            const volumeDiscount =
                              spaceTypeSelected?.productAdvertisingSpaceVolumeDiscounts
                                ?.find(
                                  (pv) =>
                                    pv.rangeStart <= quantityValue &&
                                    pv.rangeEnd > quantityValue
                                )
                                ?.discount.toLocaleCurrency();

                            if (
                              formikProps.values.soldSpaces[index]
                                .applyDiscountForVolume
                            ) {
                              const indexAli = formikProps.values.soldSpaces[
                                index
                              ].alicuotasAplicadas.findIndex((x) => x.id === 6);

                              const updatedAlicuotas = [
                                ...formikProps.values.soldSpaces[
                                  index
                                ].alicuotasAplicadas.slice(0, indexAli),
                                {
                                  id: 6,
                                  alicuota: volumeDiscount || 0,
                                },
                                ...formikProps.values.soldSpaces[
                                  index
                                ].alicuotasAplicadas.slice(indexAli + 1),
                              ].sort(
                                (a, b) => parseFloat(a.id) - parseFloat(b.id)
                              );

                              formikProps.setFieldValue(
                                `soldSpaces.${index}.alicuotasAplicadas`,
                                updatedAlicuotas
                              );
                            }

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.discountForVolume`,
                              volumeDiscount || 0
                            );

                            const valuesLocal = {
                              ...formikProps.values,
                            };
                            valuesLocal.soldSpaces[index].discountForVolume =
                              volumeDiscount || 0;

                            let totalSoldSpace = 0;
                            let unitarioSoldSpace = 0;
                            const parity = formikProps.values.currencyParity;
                            totalSoldSpace =
                              quantityValue === 0
                                ? 0
                                : getTotalSoldSpace(
                                    valuesLocal,
                                    index,
                                    quantityValue,
                                    parity,
                                    availableProducts
                                  );
                            unitarioSoldSpace = getUnitarioSoldSpace(
                              valuesLocal,
                              index,
                              quantityValue,
                              parity,
                              availableProducts
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.total`,
                              totalSoldSpace.toLocaleCurrency()
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.unitPriceWithDiscounts`,
                              unitarioSoldSpace.toLocaleCurrency()
                            );

                            if (editMode) {
                              if (
                                quantityValue <
                                formikProps.values.soldSpaces[index].quantityOP
                              ) {
                                formikProps.setFieldError(
                                  `soldSpaces.${index}.quantity`,
                                  'La cantidad no puede ser menor a la cantidad de órdenes publicadas'
                                );
                              } else {
                                formikProps.setFieldError(
                                  `soldSpaces.${index}.quantity`,
                                  ''
                                );
                              }
                            }
                          }}
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index]['quantity']
                          }
                        />
                      </div>
                      <div className='col-2'>
                        <InputTextField
                          labelText='Saldo'
                          name={`soldSpaces.${index}.balance`}
                          disabled={true}
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index]['balance']
                          }
                        />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='col-12'>
                        <div className='discounts-container'>
                          <div className='discount'>
                            <InputTextField
                              labelText='Adelantado/cheque'
                              name={`soldSpaces.${index}.discountForCheck`}
                              disabled={true}
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'discountForCheck'
                                ]
                              }
                            />
                            <InputCheckboxField
                              labelText='Pagada'
                              showLabel={false}
                              name={`soldSpaces.${index}.applyDiscountForCheck`}
                              disabled={
                                deleteMode ||
                                formikProps.values.paymentMethodId === 3 ||
                                (isSeller && editMode) ||
                                disabledByInvoiceNumber
                              }
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'applyDiscountForCheck'
                                ]
                              }
                              inline
                              onChangeHandler={() => {
                                if (
                                  !formikProps.values.soldSpaces[index]
                                    .applyDiscountForCheck
                                ) {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    [
                                      ...formikProps.values.soldSpaces[index]
                                        .alicuotasAplicadas,
                                      {
                                        id: 1,
                                        alicuota:
                                          formikProps.values.soldSpaces[index]
                                            .discountForCheck,
                                      },
                                    ].sort(
                                      (a, b) =>
                                        parseFloat(a.id) - parseFloat(b.id)
                                    )
                                  );
                                } else {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    formikProps.values.soldSpaces[
                                      index
                                    ].alicuotasAplicadas.filter(
                                      (x) => x.id !== 1
                                    )
                                  );
                                }

                                const valueCheck =
                                  !formikProps.values.soldSpaces[index]
                                    .applyDiscountForCheck;
                                const total = getTotalSPChequeDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                const unitario = getUnitarioSPChequeDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                if (total < 0) {
                                  if (
                                    formikProps.errors.soldSpaces &&
                                    formikProps.errors.soldSpaces[index]
                                  ) {
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      `La cantidad máxima de descuentos no puede superar el 100%`;
                                  } else {
                                    formikProps.errors.soldSpaces = [{}];
                                    formikProps.errors.soldSpaces[index] = {};
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      'La cantidad máxima de descuentos no puede superar el 100%';
                                  }
                                }

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.total`,
                                  total.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.unitPriceWithDiscounts`,
                                  unitario.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );
                              }}
                            />
                          </div>
                          {countryAndClientSameCountry() ? (
                            <div className='discount'>
                              <InputTextField
                                labelText='Cliente Nacional'
                                name={`soldSpaces.${index}.discountForSameCountry`}
                                disabled={true}
                                error={
                                  formikProps.errors.soldSpaces &&
                                  formikProps.errors.soldSpaces[index] &&
                                  formikProps.errors.soldSpaces[index][
                                    'discountForSameCountry'
                                  ]
                                }
                              />
                              <InputCheckboxField
                                labelText='Pagada'
                                showLabel={false}
                                name={`soldSpaces.${index}.applyDiscountForSameCountry`}
                                disabled={
                                  deleteMode ||
                                  (isSeller && editMode) ||
                                  disabledByInvoiceNumber
                                }
                                error={
                                  formikProps.errors.soldSpaces &&
                                  formikProps.errors.soldSpaces[index] &&
                                  formikProps.errors.soldSpaces[index][
                                    'applyDiscountForSameCountry'
                                  ]
                                }
                                inline
                                onChangeHandler={(evt) => {
                                  if (
                                    !formikProps.values.soldSpaces[index]
                                      .applyDiscountForSameCountry
                                  ) {
                                    formikProps.setFieldValue(
                                      `soldSpaces.${index}.alicuotasAplicadas`,
                                      [
                                        ...formikProps.values.soldSpaces[index]
                                          .alicuotasAplicadas,
                                        {
                                          id: 2,
                                          alicuota:
                                            formikProps.values.soldSpaces[index]
                                              .discountForSameCountry,
                                        },
                                      ].sort(
                                        (a, b) =>
                                          parseFloat(a.id) - parseFloat(b.id)
                                      )
                                    );
                                  } else {
                                    formikProps.setFieldValue(
                                      `soldSpaces.${index}.alicuotasAplicadas`,
                                      formikProps.values.soldSpaces[
                                        index
                                      ].alicuotasAplicadas.filter(
                                        (x) => x.id !== 2
                                      )
                                    );
                                  }

                                  const valueCheck =
                                    !formikProps.values.soldSpaces[index]
                                      .applyDiscountForSameCountry;
                                  const total = getTotalSPNacDiscount(
                                    formikProps.values,
                                    index,
                                    valueCheck,
                                    availableProducts
                                  );

                                  const unitario = getUnitarioSPNacDiscount(
                                    formikProps.values,
                                    index,
                                    valueCheck,
                                    availableProducts
                                  );

                                  if (total < 0) {
                                    if (
                                      formikProps.errors.soldSpaces &&
                                      formikProps.errors.soldSpaces[index]
                                    ) {
                                      formikProps.errors.soldSpaces[index][
                                        'specialDiscount'
                                      ] =
                                        `La cantidad máxima de descuentos no puede superar el 100%`;
                                    } else {
                                      formikProps.errors.soldSpaces = [{}];
                                      formikProps.errors.soldSpaces[index] = {};
                                      formikProps.errors.soldSpaces[index][
                                        'specialDiscount'
                                      ] =
                                        'La cantidad máxima de descuentos no puede superar el 100%';
                                    }
                                  }

                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.total`,
                                    total.toLocaleString('pt-BR', {
                                      maximumFractionDigits: 2,
                                    })
                                  );

                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.unitPriceWithDiscounts`,
                                    unitario.toLocaleString('pt-BR', {
                                      maximumFractionDigits: 2,
                                    })
                                  );
                                }}
                              />
                            </div>
                          ) : (
                            <div className='discount'>
                              <InputTextField
                                labelText='Cliente Internacional'
                                name={`soldSpaces.${index}.discountForOtherCountry`}
                                disabled={true}
                                error={
                                  formikProps.errors.soldSpaces &&
                                  formikProps.errors.soldSpaces[index] &&
                                  formikProps.errors.soldSpaces[index][
                                    'discountForOtherCountry'
                                  ]
                                }
                              />
                              <InputCheckboxField
                                labelText='Pagada'
                                showLabel={false}
                                name={`soldSpaces.${index}.applyDiscountForOtherCountry`}
                                disabled={
                                  deleteMode ||
                                  (isSeller && editMode) ||
                                  disabledByInvoiceNumber
                                }
                                error={
                                  formikProps.errors.soldSpaces &&
                                  formikProps.errors.soldSpaces[index] &&
                                  formikProps.errors.soldSpaces[index][
                                    'applyDiscountForOtherCountry'
                                  ]
                                }
                                inline
                                onChangeHandler={() => {
                                  if (
                                    !formikProps.values.soldSpaces[index]
                                      .applyDiscountForOtherCountry
                                  ) {
                                    formikProps.setFieldValue(
                                      `soldSpaces.${index}.alicuotasAplicadas`,
                                      [
                                        ...formikProps.values.soldSpaces[index]
                                          .alicuotasAplicadas,
                                        {
                                          id: 3,
                                          alicuota:
                                            formikProps.values.soldSpaces[index]
                                              .discountForOtherCountry,
                                        },
                                      ].sort(
                                        (a, b) =>
                                          parseFloat(a.id) - parseFloat(b.id)
                                      )
                                    );
                                  } else {
                                    formikProps.setFieldValue(
                                      `soldSpaces.${index}.alicuotasAplicadas`,
                                      formikProps.values.soldSpaces[
                                        index
                                      ].alicuotasAplicadas.filter(
                                        (x) => x.id !== 3
                                      )
                                    );
                                  }

                                  const valueCheck =
                                    !formikProps.values.soldSpaces[index]
                                      .applyDiscountForOtherCountry;
                                  const total = getTotalSPInterDiscount(
                                    formikProps.values,
                                    index,
                                    valueCheck,
                                    availableProducts
                                  );

                                  const unitario = getUnitarioSPInterDiscount(
                                    formikProps.values,
                                    index,
                                    valueCheck,
                                    availableProducts
                                  );

                                  if (total < 0) {
                                    if (
                                      formikProps.errors.soldSpaces &&
                                      formikProps.errors.soldSpaces[index]
                                    ) {
                                      formikProps.errors.soldSpaces[index][
                                        'specialDiscount'
                                      ] =
                                        `La cantidad máxima de descuentos no puede superar el 100%`;
                                    } else {
                                      formikProps.errors.soldSpaces = [{}];
                                      formikProps.errors.soldSpaces[index] = {};
                                      formikProps.errors.soldSpaces[index][
                                        'specialDiscount'
                                      ] =
                                        'La cantidad máxima de descuentos no puede superar el 100%';
                                    }
                                  }

                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.total`,
                                    total.toLocaleString('pt-BR', {
                                      maximumFractionDigits: 2,
                                    })
                                  );

                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.unitPriceWithDiscounts`,
                                    unitario.toLocaleString('pt-BR', {
                                      maximumFractionDigits: 2,
                                    })
                                  );
                                }}
                              />
                            </div>
                          )}
                          <div className='discount'>
                            <InputTextField
                              labelText='Fidelización'
                              name={`soldSpaces.${index}.discountForLoyalty`}
                              disabled={true}
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'discountForLoyalty'
                                ]
                              }
                            />
                            <InputCheckboxField
                              labelText='Pagada'
                              showLabel={false}
                              name={`soldSpaces.${index}.applyDiscountForLoyalty`}
                              disabled={
                                deleteMode ||
                                (isSeller && editMode) ||
                                disabledByInvoiceNumber
                              }
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'applyDiscountForLoyalty'
                                ]
                              }
                              inline
                              onChangeHandler={() => {
                                if (
                                  !formikProps.values.soldSpaces[index]
                                    .applyDiscountForLoyalty
                                ) {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    [
                                      ...formikProps.values.soldSpaces[index]
                                        .alicuotasAplicadas,
                                      {
                                        id: 4,
                                        alicuota:
                                          formikProps.values.soldSpaces[index]
                                            .discountForLoyalty,
                                      },
                                    ].sort(
                                      (a, b) =>
                                        parseFloat(a.id) - parseFloat(b.id)
                                    )
                                  );
                                } else {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    formikProps.values.soldSpaces[
                                      index
                                    ].alicuotasAplicadas.filter(
                                      (x) => x.id !== 4
                                    )
                                  );
                                }

                                const valueCheck =
                                  !formikProps.values.soldSpaces[index]
                                    .applyDiscountForLoyalty;
                                const total = getTotalSPFidelDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                const unitario = getUnitarioSPFidelDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                if (total < 0) {
                                  if (
                                    formikProps.errors.soldSpaces &&
                                    formikProps.errors.soldSpaces[index]
                                  ) {
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      `La cantidad máxima de descuentos no puede superar el 100%`;
                                  } else {
                                    formikProps.errors.soldSpaces = [{}];
                                    formikProps.errors.soldSpaces[index] = {};
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      'La cantidad máxima de descuentos no puede superar el 100%';
                                  }
                                }

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.total`,
                                  total.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.unitPriceWithDiscounts`,
                                  unitario.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );
                              }}
                            />
                          </div>
                          <div className='discount'>
                            <InputTextField
                              labelText='Agencia'
                              name={`soldSpaces.${index}.discountForAgency`}
                              disabled={true}
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'discountForAgency'
                                ]
                              }
                            />
                            <InputCheckboxField
                              labelText=''
                              showLabel={false}
                              name={`soldSpaces.${index}.appyDiscountForAgency`}
                              disabled={
                                !formikProps.values.clientIsAgency ||
                                (isSeller && editMode) ||
                                disabledByInvoiceNumber
                              }
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'appyDiscountForAgency'
                                ]
                              }
                              inline
                              onChangeHandler={() => {
                                if (
                                  !formikProps.values.soldSpaces[index]
                                    .appyDiscountForAgency
                                ) {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    [
                                      ...formikProps.values.soldSpaces[index]
                                        .alicuotasAplicadas,
                                      {
                                        id: 5,
                                        alicuota:
                                          formikProps.values.soldSpaces[index]
                                            .discountForAgency,
                                      },
                                    ].sort(
                                      (a, b) =>
                                        parseFloat(a.id) - parseFloat(b.id)
                                    )
                                  );
                                } else {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    formikProps.values.soldSpaces[
                                      index
                                    ].alicuotasAplicadas.filter(
                                      (x) => x.id !== 5
                                    )
                                  );
                                }

                                const valueCheck =
                                  !formikProps.values.soldSpaces[index]
                                    .appyDiscountForAgency;
                                const total = getTotalSPAgencyDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                const unitario = getUnitarioSPAgencyDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                if (total < 0) {
                                  if (
                                    formikProps.errors.soldSpaces &&
                                    formikProps.errors.soldSpaces[index]
                                  ) {
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      `La cantidad máxima de descuentos no puede superar el 100%`;
                                  } else {
                                    formikProps.errors.soldSpaces = [{}];
                                    formikProps.errors.soldSpaces[index] = {};
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      'La cantidad máxima de descuentos no puede superar el 100%';
                                  }
                                }

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.total`,
                                  total.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.unitPriceWithDiscounts`,
                                  unitario.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );
                              }}
                            />
                          </div>
                          <div className='discount'>
                            <InputTextField
                              labelText='Volumen'
                              name={`soldSpaces.${index}.discountForVolume`}
                              disabled={true}
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'discountForVolume'
                                ]
                              }
                            />
                            <InputCheckboxField
                              labelText='Pagada'
                              showLabel={false}
                              name={`soldSpaces.${index}.applyDiscountForVolume`}
                              disabled={
                                deleteMode ||
                                (isSeller && editMode) ||
                                disabledByInvoiceNumber
                              }
                              error={
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index] &&
                                formikProps.errors.soldSpaces[index][
                                  'applyDiscountForVolume'
                                ]
                              }
                              inline
                              onChangeHandler={() => {
                                if (
                                  !formikProps.values.soldSpaces[index]
                                    .applyDiscountForVolume
                                ) {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    [
                                      ...formikProps.values.soldSpaces[index]
                                        .alicuotasAplicadas,
                                      {
                                        id: 6,
                                        alicuota:
                                          formikProps.values.soldSpaces[index]
                                            .discountForVolume,
                                      },
                                    ].sort(
                                      (a, b) =>
                                        parseFloat(a.id) - parseFloat(b.id)
                                    )
                                  );
                                } else {
                                  formikProps.setFieldValue(
                                    `soldSpaces.${index}.alicuotasAplicadas`,
                                    formikProps.values.soldSpaces[
                                      index
                                    ].alicuotasAplicadas.filter(
                                      (x) => x.id !== 6
                                    )
                                  );
                                }
                                const valueCheck =
                                  !formikProps.values.soldSpaces[index]
                                    .applyDiscountForVolume;
                                const total = getTotalSPVolumenDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                const unitario = getUnitarioSPVolumenDiscount(
                                  formikProps.values,
                                  index,
                                  valueCheck,
                                  availableProducts
                                );

                                if (total < 0) {
                                  if (
                                    formikProps.errors.soldSpaces &&
                                    formikProps.errors.soldSpaces[index]
                                  ) {
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      `La cantidad máxima de descuentos no puede superar el 100%`;
                                  } else {
                                    formikProps.errors.soldSpaces = [{}];
                                    formikProps.errors.soldSpaces[index] = {};
                                    formikProps.errors.soldSpaces[index][
                                      'specialDiscount'
                                    ] =
                                      'La cantidad máxima de descuentos no puede superar el 100%';
                                  }
                                }

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.total`,
                                  total.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );

                                formikProps.setFieldValue(
                                  `soldSpaces.${index}.unitPriceWithDiscounts`,
                                  unitario.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                  })
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='col-3'>
                        <InputSelectField
                          labelText='Especial'
                          name={`soldSpaces.${index}.typeSpecialDiscount`}
                          options={[
                            { id: 1, name: 'Descuento' },
                            { id: 2, name: 'Recargo' },
                          ]}
                          disabled={
                            deleteMode ||
                            (isSeller && editMode) ||
                            disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'typeSpecialDiscount'
                            ]
                          }
                          onChangeHandler={(tipoDescuento) => {
                            const aux = {
                              ...formikProps.values,
                              soldSpaces: [
                                ...formikProps.values.soldSpaces.slice(
                                  0,
                                  index
                                ),
                                {
                                  ...formikProps.values.soldSpaces[index],
                                  typeSpecialDiscount: tipoDescuento.id,
                                },
                                ...formikProps.values.soldSpaces.slice(
                                  index + 1
                                ),
                              ],
                            };
                            const unitario = getUnitarioSoldSpace(
                              aux,
                              index,
                              undefined,
                              undefined,
                              availableProducts
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.unitPriceWithDiscounts`,
                              unitario.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );

                            if (
                              formikProps.errors &&
                              formikProps.errors.soldSpaces &&
                              formikProps.errors.soldSpaces[index] &&
                              formikProps.errors.soldSpaces[index][
                                'specialDiscount'
                              ]
                            ) {
                              const gerencialDiscountError =
                                formikProps.errors.soldSpaces[index][
                                  'specialDiscount'
                                ];

                              if (gerencialDiscountError) {
                                delete formikProps.errors.soldSpaces[index][
                                  'specialDiscount'
                                ];
                                const keysObject = Object.keys(
                                  formikProps.errors.soldSpaces[index]
                                );
                                if (keysObject.length == 0) {
                                  delete formikProps.errors.soldSpaces[index];
                                }
                              }
                            }
                          }}
                        />
                      </div>
                      <div className='col-7'>
                        <InputTextField
                          labelText='Descripción'
                          name={`soldSpaces.${index}.descriptionSpecialDiscount`}
                          disabled={
                            deleteMode ||
                            (isSeller && editMode) ||
                            disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'descriptionSpecialDiscount'
                            ]
                          }
                        />
                      </div>
                      <div className='col-2'>
                        <InputTextField
                          labelText='%'
                          name={`soldSpaces.${index}.specialDiscount`}
                          disabled={
                            deleteMode ||
                            (isSeller && editMode) ||
                            disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'specialDiscount'
                            ]
                          }
                          onChangeHandler={(evt) => {
                            const aux = { ...formikProps.values };

                            if (!aux.soldSpaces[index].typeSpecialDiscount) {
                              formikProps.setFieldValue(
                                `soldSpaces.${index}.typeSpecialDiscount`,
                                1
                              );
                            }

                            aux.soldSpaces[index].specialDiscount =
                              evt.target.value;
                            const totalSoldSpace = getTotalSoldSpace(
                              aux,
                              // formikProps.values,
                              index,
                              undefined,
                              undefined,
                              availableProducts
                            );

                            const unitario = getUnitarioSoldSpace(
                              aux,
                              // formikProps.values,
                              index,
                              undefined,
                              undefined,
                              availableProducts
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.unitPriceWithDiscounts`,
                              unitario.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );

                            if (
                              aux.soldSpaces[index].typeSpecialDiscount === 1 &&
                              parseFloat(evt.target.value) >
                                productSelected.maxAplicableDiscount
                            ) {
                              if (formikProps.errors.soldSpaces) {
                                formikProps.errors.soldSpaces[index][
                                  'specialDiscount'
                                ] =
                                  `El descuento especial máximo es de ${productSelected.maxAplicableDiscount}`;
                              } else {
                                formikProps.errors.soldSpaces = [{}];
                                formikProps.errors.soldSpaces[index][
                                  'specialDiscount'
                                ] =
                                  `El descuento especial máximo es de ${productSelected.maxAplicableDiscount}`;
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='col-3'>
                        <InputSelectField
                          labelText='Gerencial'
                          name={`soldSpaces.${index}.typeGerentialDiscount`}
                          options={[
                            { id: 1, name: 'Descuento' },
                            { id: 2, name: 'Recargo' },
                          ]}
                          disabled={
                            deleteMode || isSeller || disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'typeGerentialDiscount'
                            ]
                          }
                          onChangeHandler={(tipoDescuento) => {
                            const aux = {
                              ...formikProps.values,
                              soldSpaces: [
                                ...formikProps.values.soldSpaces.slice(
                                  0,
                                  index
                                ),
                                {
                                  ...formikProps.values.soldSpaces[index],
                                  typeGerentialDiscount: tipoDescuento.id,
                                },
                                ...formikProps.values.soldSpaces.slice(
                                  index + 1
                                ),
                              ],
                            };
                            const unitario = getUnitarioSoldSpace(
                              aux,
                              index,
                              undefined,
                              undefined,
                              availableProducts
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.unitPriceWithDiscounts`,
                              unitario.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );
                          }}
                        />
                      </div>
                      <div className='col-7'>
                        <InputTextField
                          labelText='Descripción'
                          name={`soldSpaces.${index}.descriptionGerentialDiscount`}
                          disabled={
                            deleteMode || isSeller || disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'descriptionGerentialDiscount'
                            ]
                          }
                        />
                      </div>
                      <div className='col-2'>
                        <InputTextField
                          labelText='%'
                          name={`soldSpaces.${index}.gerentialDiscount`}
                          disabled={
                            deleteMode || isSeller || disabledByInvoiceNumber
                          }
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'gerentialDiscount'
                            ]
                          }
                          onChangeHandler={(evt) => {
                            const aux = { ...formikProps.values };

                            if (!aux.soldSpaces[index].typeGerentialDiscount) {
                              formikProps.setFieldValue(
                                `soldSpaces.${index}.typeGerentialDiscount`,
                                1
                              );
                            }

                            aux.soldSpaces[index].gerentialDiscount =
                              evt.target.value;
                            const totalSoldSpace = getTotalSoldSpace(
                              aux,
                              index,
                              undefined,
                              undefined,
                              availableProducts
                            );

                            const unitario = getUnitarioSoldSpace(
                              aux,
                              index,
                              undefined,
                              undefined,
                              availableProducts
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.total`,
                              totalSoldSpace.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.unitPriceWithDiscounts`,
                              unitario.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className='form-row'
                      style={{ fontSize: '0.8rem', fontWeight: 500 }}
                    >
                      <div
                        className='price col-3'
                        style={{ paddingTop: '8px' }}
                      >
                        <span className='title'>Precio unitario: </span>
                        <span className='text'>{`$ ${precioUnitario}`}</span>
                      </div>
                      <div
                        className='discount col-3'
                        style={{ paddingTop: '8px' }}
                      >
                        <span className='title'>
                          {`Desc. unitarios ( ${
                            formikProps.values.soldSpaces.length > 0 &&
                            formikProps.values.soldSpaces[index]
                              .alicuotasAplicadas
                              ? formikProps.values.soldSpaces[
                                  index
                                ].alicuotasAplicadas
                                  .map((a) => a.alicuota)
                                  .join('+')
                              : 0
                          }`}

                          {formikProps.values.soldSpaces[index]
                            .typeSpecialDiscount &&
                          formikProps.values.soldSpaces[index].specialDiscount
                            ? `${
                                formikProps.values.soldSpaces[index]
                                  .typeSpecialDiscount === 1
                                  ? '+'
                                  : '-'
                              }${
                                formikProps.values.soldSpaces[index]
                                  .specialDiscount
                              }`
                            : ''}

                          {formikProps.values.soldSpaces[index]
                            .typeGerentialDiscount &&
                          formikProps.values.soldSpaces[index].gerentialDiscount
                            ? `${
                                formikProps.values.soldSpaces[index]
                                  .typeGerentialDiscount === 1
                                  ? '+'
                                  : '-'
                              }${
                                formikProps.values.soldSpaces[index]
                                  .gerentialDiscount
                              }`
                            : ''}

                          {!formikProps.values.soldSpaces[index]
                            .locationDiscount ||
                          formikProps.values.soldSpaces[index]
                            .locationDiscount === 0
                            ? ''
                            : `${
                                formikProps.values.soldSpaces[index]
                                  .alicuotasAplicadas.length > 0 ||
                                formikProps.values.soldSpaces[index]
                                  .typeSpecialDiscount ||
                                formikProps.values.soldSpaces[index]
                                  .typeGerentialDiscount
                                  ? '+'
                                  : ''
                              }${formikProps.values.soldSpaces[
                                index
                              ].locationDiscount.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })}`}
                          {'): $ '}
                        </span>
                        <span className='text' style={{ paddingTop: '8px' }}>
                          {descuentosUnitario}
                        </span>
                      </div>
                      <div className='col-2' style={{ paddingTop: '8px' }}>
                        <span className='title'>{`IVA(${(
                          formikProps.values.iva * 100
                        ).toLocaleString('pt-BR', {
                          maximumFractionDigits: 2,
                        })}%): `}</span>
                        <span className='text'>{`$ ${unitarioConIVA}`}</span>
                      </div>
                      <div className='col-2'>
                        <span
                          className='text'
                          style={{
                            float: 'right',
                            paddingTop: '8px',
                            width: '70%',
                          }}
                        >
                          Precio unitario sin IVA
                        </span>
                      </div>
                      <div className='col-2'>
                        <InputTextField
                          showLabel={false}
                          disabled={
                            deleteMode ||
                            (isSeller && editMode) ||
                            disabledByInvoiceNumber
                          }
                          name={`soldSpaces.${index}.unitPriceWithDiscounts`}
                          onBlurHandler={() => {
                            // Recalculamos el precio unitario sin IVA ya que por temas de redondeo al aplicar el descuento
                            // puede quedar ligeramente diferente
                            const unitPriceLocal =
                              parseFloatRegionArg(precioUnitario);

                            const unitDiscountsLocal =
                              parseFloatRegionArg(descuentosUnitario);

                            const realUnitPrice =
                              unitPriceLocal - unitDiscountsLocal;

                            formikProps.setFieldValue(
                              `soldSpaces.${index}.unitPriceWithDiscounts`,
                              realUnitPrice.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })
                            );
                          }}
                          onChangeHandler={(evt) => {
                            const newUnitario = !evt.target.value
                              ? 0
                              : parseFloatRegionArg(evt.target.value);

                            const unitarioSD =
                              parseFloatRegionArg(precioUnitario);

                            const currentSoldSpace =
                              formikProps.values.soldSpaces[index];

                            const discountForCheckLocal =
                              currentSoldSpace.applyDiscountForCheck
                                ? parseFloatRegionArg(
                                    currentSoldSpace.discountForCheck
                                  )
                                : 0;

                            const discountForSameCountryLocal =
                              currentSoldSpace.applyDiscountForSameCountry
                                ? parseFloatRegionArg(
                                    currentSoldSpace.discountForSameCountry
                                  )
                                : 0;

                            const discountForOtherCountryLocal =
                              currentSoldSpace.applyDiscountForOtherCountry
                                ? parseFloatRegionArg(
                                    currentSoldSpace.discountForOtherCountry
                                  )
                                : 0;

                            const discountForLoyaltyLocal =
                              currentSoldSpace.applyDiscountForLoyalty
                                ? parseFloatRegionArg(
                                    currentSoldSpace.discountForLoyalty
                                  )
                                : 0;

                            const discountForAgencyLocal =
                              currentSoldSpace.applyDiscountForAgency
                                ? parseFloatRegionArg(
                                    currentSoldSpace.discountForAgency
                                  )
                                : 0;

                            const discountForVolumeLocal =
                              currentSoldSpace.applyDiscountForVolume
                                ? parseFloatRegionArg(
                                    currentSoldSpace.discountForVolume
                                  )
                                : 0;

                            let gerentialDiscountLocal = parseFloatRegionArg(
                              currentSoldSpace.gerentialDiscount
                            );

                            gerentialDiscountLocal = isNaN(
                              gerentialDiscountLocal
                            )
                              ? 0
                              : gerentialDiscountLocal / 100;

                            const typeGerentialDiscount =
                              currentSoldSpace.typeGerentialDiscount;

                            const locationDiscountLocal =
                              currentSoldSpace.locationDiscount || 0;

                            let unitPriceWD =
                              unitarioSD -
                              (unitarioSD * discountForCheckLocal) / 100;

                            unitPriceWD =
                              unitPriceWD -
                              (unitPriceWD * discountForSameCountryLocal) / 100;

                            unitPriceWD =
                              unitPriceWD -
                              (unitPriceWD * discountForOtherCountryLocal) /
                                100;

                            unitPriceWD =
                              unitPriceWD -
                              (unitPriceWD * discountForLoyaltyLocal) / 100;

                            unitPriceWD =
                              unitPriceWD -
                              (unitPriceWD * discountForAgencyLocal) / 100;

                            unitPriceWD =
                              unitPriceWD -
                              (unitPriceWD * discountForVolumeLocal) / 100;

                            unitPriceWD =
                              unitPriceWD -
                              (unitPriceWD * locationDiscountLocal) / 100;

                            unitPriceWD =
                              unitPriceWD -
                              unitPriceWD *
                                gerentialDiscountLocal *
                                (typeGerentialDiscount === 2 ? -1 : 1);

                            const anotherUnitDiscounts =
                              unitarioSD - unitPriceWD;
                            const discount =
                              unitarioSD - newUnitario - anotherUnitDiscounts;
                            const percentaje = Math.abs(
                              parseFloat(
                                ((discount * 100) / unitPriceWD).toFixed(3)
                              )
                            );

                            const discountTotal =
                              ((unitarioSD - newUnitario) * 100) / unitarioSD;

                            if (
                              discountTotal >
                              productSelected.maxAplicableDiscount
                            ) {
                              if (
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index]
                              ) {
                                formikProps.errors.soldSpaces[index][
                                  'specialDiscount'
                                ] =
                                  `La cantidad máxima de descuentos es de ${productSelected.maxAplicableDiscount}`;
                              } else {
                                formikProps.errors.soldSpaces = [{}];
                                formikProps.errors.soldSpaces[index] = {};
                                formikProps.errors.soldSpaces[index][
                                  'specialDiscount'
                                ] =
                                  `La cantidad máxima de descuentos es de ${productSelected.maxAplicableDiscount}`;
                              }
                            } else {
                              if (
                                formikProps.errors.soldSpaces &&
                                formikProps.errors.soldSpaces[index]
                              ) {
                                formikProps.errors.soldSpaces[index][
                                  'specialDiscount'
                                ] = '';
                              }
                            }

                            if (discount > 0) {
                              formikProps.setFieldValue(
                                `soldSpaces.${index}.typeSpecialDiscount`,
                                1
                              );

                              formikProps.setFieldValue(
                                `soldSpaces.${index}.descriptionSpecialDiscount`,
                                'Descuento generado por diferencia de total'
                              );

                              formikProps.setFieldValue(
                                `soldSpaces.${index}.specialDiscount`,
                                percentaje.toLocaleString('pt-BR', {
                                  maximumFractionDigits: 2,
                                })
                              );
                            } else if (discount < 0) {
                              formikProps.setFieldValue(
                                `soldSpaces.${index}.typeSpecialDiscount`,
                                2
                              );

                              formikProps.setFieldValue(
                                `soldSpaces.${index}.descriptionSpecialDiscount`,
                                'Recargo generado por diferencia de total'
                              );

                              formikProps.setFieldValue(
                                `soldSpaces.${index}.specialDiscount`,
                                percentaje.toLocaleString('pt-BR', {
                                  maximumFractionDigits: 2,
                                })
                              );
                            }
                          }}
                          error={
                            formikProps.errors.soldSpaces &&
                            formikProps.errors.soldSpaces[index] &&
                            formikProps.errors.soldSpaces[index][
                              'unitPriceWithDiscounts'
                            ]
                          }
                        />
                      </div>
                    </div>
                    <div
                      className='form-row'
                      style={{ fontSize: '0.8rem', fontWeight: 500 }}
                    >
                      <div className='price col-3'>
                        <span className='title'>Precio: </span>
                        <span className='text'>{`$ ${subTotal}`}</span>
                      </div>
                      <div className='discount col-3'>
                        <span className='title'>
                          {`Descuentos ( ${
                            formikProps.values.soldSpaces.length > 0 &&
                            formikProps.values.soldSpaces[index]
                              .alicuotasAplicadas
                              ? formikProps.values.soldSpaces[
                                  index
                                ].alicuotasAplicadas
                                  .map((a) => a.alicuota)
                                  .join('+')
                              : 0
                          }`}
                          {formikProps.values.soldSpaces[index]
                            .typeSpecialDiscount &&
                          formikProps.values.soldSpaces[index].specialDiscount
                            ? `${
                                formikProps.values.soldSpaces[index]
                                  .typeSpecialDiscount === 1
                                  ? '+'
                                  : '-'
                              }${
                                formikProps.values.soldSpaces[index]
                                  .specialDiscount
                              }`
                            : ''}
                          {formikProps.values.soldSpaces[index]
                            .typeGerentialDiscount &&
                          formikProps.values.soldSpaces[index].gerentialDiscount
                            ? `${
                                formikProps.values.soldSpaces[index]
                                  .typeGerentialDiscount === 1
                                  ? '+'
                                  : '-'
                              }${
                                formikProps.values.soldSpaces[index]
                                  .gerentialDiscount
                              }`
                            : ''}
                          {!formikProps.values.soldSpaces[index]
                            .locationDiscount ||
                          formikProps.values.soldSpaces[index]
                            .locationDiscount === 0
                            ? ''
                            : `${
                                formikProps.values.soldSpaces[index]
                                  .alicuotasAplicadas.length > 0 ||
                                formikProps.values.soldSpaces[index]
                                  .typeSpecialDiscount ||
                                formikProps.values.soldSpaces[index]
                                  .typeGerentialDiscount
                                  ? '+'
                                  : ''
                              }${formikProps.values.soldSpaces[
                                index
                              ].locationDiscount.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })}`}
                          {'): $ '}
                        </span>
                        <span className='text'>{totalDiscounts}</span>
                      </div>
                      <div
                        className='taxes'
                        style={{ width: '21%', paddingLeft: '4px' }}
                      >
                        <span className='title'>{`IVA(${(
                          formikProps.values.iva * 100
                        ).toLocaleString('pt-BR', {
                          maximumFractionDigits: 2,
                        })}%): `}</span>
                        <span className='text'>{`$ ${subtotalWithIva}`}</span>
                      </div>
                      <div className='col-3' style={{ paddingLeft: '7px' }}>
                        <span className='title'>Total con IVA: </span>
                        <span className='text'>{`$ ${totalSoldSpace}`}</span>
                      </div>
                    </div>

                    <div className='form-row' style={{ marginTop: '15px' }}>
                      <div className='col-2'>
                        <RemoveButton
                          disabled={
                            formikProps.values.soldSpaces.length === 1 ||
                            (!addMode &&
                              formikProps.values.soldSpaces[index].balance <
                                formikProps.values.soldSpaces[index]
                                  .quantity) ||
                            disabledByInvoiceNumber
                          }
                          onClickHandler={() => {
                            const qtyDeleted =
                              formikProps.values.soldSpaces[index].quantity;
                            const newQtySP =
                              parseFloat(formikProps.values.quantitySP) -
                              parseFloat(qtyDeleted);
                            formikProps.setFieldValue('quantitySP', newQtySP);
                            remove(index);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          <div className='form-row'>
            <div className='col-12'>
              <div className='add-space-button'>
                <button
                  className='btn btn-primary '
                  disabled={
                    deleteMode ||
                    (isSeller && editMode) ||
                    disabledByInvoiceNumber
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    push({
                      advertisingSpaceLocationTypeId: '',
                      productAdvertisingSpaceId: '',
                      typeSpecialDiscount: '',
                      typeGerentialDiscount: '',
                      quantity: '',
                      specialDiscount: '',
                      gerentialDiscount: '',
                      descriptionSpecialDiscount: '',
                      descriptionGerentialDiscount: '',
                      total: '',
                      balance: '',
                      spacePrice: '',
                      discountForCheck: '',
                      discountForLoyalty: '',
                      discountForSameCountry: '',
                      discountForOtherCountry: '',
                      discountForAgency: '',
                      applyDiscountForCheck: false,
                      applyDiscountForLoyalty: false,
                      applyDiscountForSameCountry: false,
                      applyDiscountForOtherCountry: false,
                      applyDiscountForVolume: true,
                      appyDiscountForAgency: false,
                      alicuotasAplicadas: [],
                      ubicaciones: [],
                    });
                  }}
                >
                  Agregar Otro Espacio
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    />
  );
};

export default SpacesSoldData;
