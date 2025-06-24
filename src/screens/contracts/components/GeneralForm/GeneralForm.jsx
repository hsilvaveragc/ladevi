import React, { useState, useEffect } from "react";
import { Form } from "formik";
import { addYears } from "date-fns";
import { toast } from "react-toastify";

import { CONSTANTS } from "shared/utils/constants";
import { findById } from "shared/utils";
import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import InputDatePickerField from "shared/components/InputDatePickerField";
import InputTextAreaField from "shared/components/InputTextAreaField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import {
  makeTotals,
  getTotalsDiscounts,
  getTotalTaxes,
  getTotalContract,
  getTotalSoldSpace,
  getSubtotalContract,
  getTotalSPChequeDiscount,
  getUnitarioSoldSpace,
  getUnitarioSPChequeDiscount,
} from "../../utils2";
import SpacesSold from "./SpacesSold";
import { NewClientFormContainer } from "./style";
import {
  getBillingConditions,
  getPaymentMethod,
  getCountriesForBilling,
  getCurrenciesForClient,
  getModifiedEuroCurrency,
} from "../helper";

const ContractData = ({
  addMode,
  editMode,
  deleteMode,
  availableSalesmens,
  availableProducts,
  availableSpaceTypes,
  availableSpaceLocations,
  availableClients,
  availableCountries,
  errors,
  saveHandler,
  closeHandler,
  formikProps,
  isSeller,
  availableCurrencies,
  availableEuroParities,
  selectedItem,
  loading,
  duplicateContractHandler,
  formikPropsDuplicateHandler,
  formikPropsDuplicate,
  filters,
}) => {
  const formikPropsValues =
    addMode && formikPropsDuplicate
      ? formikPropsDuplicate.values
      : formikProps.values;

  const [clients, setClients] = useState(() =>
    availableClients.filter(
      x => x.isEnabled || x.id === formikProps.values.clientId
    )
  );
  const [currencies, setCurrencies] = useState(() => [
    availableCurrencies.find(x => x.countryId == CONSTANTS.USA_COUNTRY_ID),
  ]);
  const [countriesForBilling, setCountriesForBilling] = useState([]);
  // const [noParity, setNoParity] = useState(false);

  useEffect(() => {
    if (editMode || formikPropsDuplicate) {
      const initialClient = clients.find(
        x => x.id === formikProps.values.clientId
      );
      const initialProduct = availableProducts.find(
        x => x.id === formikProps.values.productId
      );

      handleClientChange(initialClient);

      if (formikPropsDuplicate) {
        let qtySoldSpaces = 0;
        const spArray = formikPropsDuplicate.values.soldSpaces;
        for (let i = 0; i < spArray.length; i++) {
          qtySoldSpaces += parseFloat(spArray[i].quantity);
        }

        const iva = initialProduct.iva / 100;

        // setNoParity(formikProps.values.currencyParity == "");

        // const currencySel = currencies.filter(
        //   x => x.id === formikPropsValues.currencyId
        // )[0];

        // if (noParity && currencySel && currencySel.name !== "U$S") {
        //   formikProps.setFieldError(
        //     "currencyId",
        //     "No hay cotización disponible para el producto seleccionado"
        //   );
        //   formikProps.setFieldValue("noParity", true);
        // } else {
        //   formikProps.errors.currencyId = "";
        //   formikProps.setFieldValue("noParity", false);
        // }

        formikProps.setFieldValue("iva", iva);

        for (let i = 0; i < formikPropsValues.soldSpaces.length; i++) {
          let newPrice = availableSpaceTypes.filter(
            x =>
              x.id == formikPropsValues.soldSpaces[i].productAdvertisingSpaceId
          )[0].dollarPrice;

          let locDto = 0;
          const productLocationDiscount =
            initialProduct.productLocationDiscounts;
          if (productLocationDiscount.length > 0) {
            const pld = productLocationDiscount.filter(
              x =>
                x.advertisingSpaceLocationTypeId ===
                formikPropsValues.soldSpaces[i].advertisingSpaceLocationTypeId
            )[0];
            if (pld) {
              locDto = pld.discount;
            }
          }

          formikProps.setFieldValue(`soldSpaces.${i}.spacePrice`, newPrice);
          formikProps.setFieldValue(`soldSpaces.${i}.total`, locDto);
          //Recalculamos el total del espacio
          const totalSoldSpace = getTotalSoldSpace(
            formikProps.values,
            i,
            undefined,
            undefined,
            availableProducts,
            undefined,
            newPrice
          );

          const { precioUnitario, descuentosUnitario } = makeTotals(
            formikProps.values,
            i,
            undefined,
            undefined,
            newPrice,
            availableProducts,
            6
          );

          const unitPriceLocal = parseFloat(
            precioUnitario
              .toString()
              .split(".")
              .join("")
              .replace(",", ".")
          );

          const unitDiscountsLocal = parseFloat(
            descuentosUnitario
              .toString()
              .split(".")
              .join("")
              .replace(",", ".")
          );

          const realUnitPrice = unitPriceLocal - unitDiscountsLocal;
          formikProps.setFieldValue(
            `soldSpaces.${i}.total`,
            totalSoldSpace.toLocaleString("pt-BR", { maximumFractionDigits: 2 })
          );
          formikProps.setFieldValue(
            `soldSpaces.${i}.unitPriceWithDiscounts`,
            realUnitPrice.toLocaleString("pt-BR", { maximumFractionDigits: 2 })
          );
        }

        formikPropsDuplicateHandler(undefined);
      }
    }
  }, []);

  const handleClientChange = client => {
    // Primero actualizamos los valores base del cliente
    formikProps.setValues({
      ...formikProps.values,
      clientId: client.id,
      sellerId: client.applicationUserSellerId,
      clientIsAgency: client.isAgency,
      clientCountryId: client.countryId,
      clientIsComtur: client.isComtur,
      billingCountryId: client.countryId,
    });

    // Luego manejamos la lógica de países de facturación
    let updatedCountriesForBilling = client?.isComtur
      ? [availableCountries.find(x => x.id === CONSTANTS.PANAMA_COUNTRY_ID)] //Si es comtur solo se factura por Panama
      : getCountriesForBilling(
          countriesForBilling.filter(x => x.id !== CONSTANTS.PANAMA_COUNTRY_ID),
          clients,
          client.id
        );

    setCountriesForBilling(updatedCountriesForBilling);
    if (client?.isComtur) {
      formikProps.setFieldValue(
        "billingCountryId",
        updatedCountriesForBilling[0].id
      );
    }

    // Finalmente manejamos la lógica de monedas
    const { usdCurrency, localCurrency } = getCurrenciesForClient(
      client?.countryId,
      availableCurrencies
    );

    const finalLocalCurrency =
      client?.isComtur || localCurrency?.useEuro
        ? getModifiedEuroCurrency(availableEuroParities)
        : localCurrency;

    setCurrencies(
      !finalLocalCurrency ? [usdCurrency] : [usdCurrency, finalLocalCurrency]
    );
  };

  const handleProductChange = product => {
    const currencyParityEntity = availableCurrencies
      .find(x => x.countryId == product.countryId)
      ?.currencyParities.filter(
        x =>
          formikProps.values.contractDate >= new Date(x.start) &&
          formikProps.values.contractDate <= new Date(x.end)
      )[0];

    // setNoParity(!currencyParityEntity);

    // if (
    //   // noParity &&
    //   formikProps.values.currencyId !== CONSTANTS.USA_CURRENCY_ID &&
    //   formikProps.values.currencyId !== CONSTANTS.EUR_CURRENCY_ID
    // ) {
    //   formikProps.setFieldError(
    //     "currencyId",
    //     "No hay cotización disponible para el producto seleccionado"
    //   );
    //   formikProps.setFieldValue("noParity", true);
    // } else {
    //   delete formikProps.errors.currencyId;
    //   formikProps.setFieldValue("noParity", false);
    // }

    const parityValue =
      addMode || selectedItem.productId !== product.id
        ? currencyParityEntity?.localCurrencyToDollarExchangeRate ?? 1
        : selectedItem.currencyParity;

    let initValues = {
      ...formikProps.values,
      currencyParity:
        formikProps.values.currencyId == CONSTANTS.USA_CURRENCY_ID
          ? 1
          : parityValue,
      iva:
        addMode || selectedItem.productId !== product.id
          ? product.iva / 100
          : selectedItem.iva,
      productId: product.id,
      productCountryId: product.countryId,
      soldSpaces:
        addMode || selectedItem.productId !== product.id
          ? [
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
                discountForCheck: "",
                discountForLoyalty: "",
                discountForSameCountry: "",
                discountForOtherCountry: "",
                discountForAgency: "",
                applyDiscountForCheck: false,
                applyDiscountForLoyalty: false,
                applyDiscountForSameCountry: false,
                applyDiscountForOtherCountry: false,
                applyDiscountForVolume: true,
                appyDiscountForAgency: false,
                alicuotasAplicadas: [],
                ubicaciones: [],
              },
            ]
          : formikProps.values.soldSpaces.map((item, index) => {
              return {
                ...item,
                ...selectedItem.soldSpaces[index],
              };
            }),
    };

    formikProps.setValues(initValues);
  };

  const handlePaymentMethodChange = paymentMethod => {
    if (paymentMethod.id != 1) {
      formikProps.setFieldValue("checkQuantity", "");
      formikProps.setFieldValue("daysToFirstPayment", "");
      formikProps.setFieldValue("daysBetweenChecks", "");

      for (let i = 0; i < formikProps.values.soldSpaces.length; i++) {
        formikProps.setFieldValue(
          `soldSpaces.${i}.applyDiscountForCheck`,
          false
        );
        const total = getTotalSPChequeDiscount(
          formikProps.values,
          i,
          !formikProps.values.soldSpaces[i].applyDiscountForCheck,
          availableProducts
        );

        const unitario = getUnitarioSPChequeDiscount(
          formikProps.values,
          i,
          !formikProps.values.soldSpaces[i].applyDiscountForCheck,
          availableProducts
        );

        formikProps.setFieldValue(`soldSpaces.${i}.total`, total);
        formikProps.setFieldValue(
          `soldSpaces.${i}.unitPriceWithDiscounts`,
          unitario
        );
      }
    }
  };

  const handleCurrencyChange = currency => {
    formikProps.setFieldValue("currencyId", currency.id);
    formikProps.setFieldValue("useEuro", currency.id === -1);

    let parity =
      currency?.currencyParities?.find(
        x =>
          new Date(formikProps.values.contractDate) >= new Date(x.start) &&
          new Date(formikProps.values.contractDate) <= new Date(x.end)
      )?.localCurrencyToDollarExchangeRate ?? 1;

    formikProps.setFieldValue("currencyParity", parity);

    const productSelected = availableProducts.filter(
      x => x.id === formikProps.values.productId
    )[0];

    const values = {
      billingCountryId: formikProps.values.billingCountryId,
      iva: formikProps.values.iva,
      currencyId: currency.id,
      currencyParity: parity,
      soldSpaces: [...formikProps.values.soldSpaces],
    };

    for (let i = 0; i < formikProps.values.soldSpaces.length; i++) {
      const total = getTotalSoldSpace(
        values,
        i,
        undefined,
        parity,
        availableProducts
      );

      const unitario = getUnitarioSoldSpace(
        values,
        i,
        undefined,
        parity,
        availableProducts
      );

      formikProps.setFieldValue(
        `soldSpaces.${i}.total`,
        total.toLocaleString("pt-BR", {
          maximumFractionDigits: 2,
        })
      );

      formikProps.setFieldValue(
        `soldSpaces.${i}.unitPriceWithDiscounts`,
        unitario.toLocaleString("pt-BR", {
          maximumFractionDigits: 2,
        })
      );
    }

    // if (
    //   noParity &&
    //   currency.id !== CONSTANTS.USA_CURRENCY_ID &&
    //   currency.id !== CONSTANTS.EUR_CURRENCY_ID &&
    //   productSelected
    // ) {
    //   formikProps.setFieldError(
    //     "currencyId",
    //     "No hay cotización disponible para el producto seleccionado"
    //   );
    //   formikProps.setFieldValue("noParity", true);
    // } else {
    //   delete formikProps.errors.currencyId;
    //   formikProps.setFieldValue("noParity", false);
    // }
  };

  const isDisabledCondFact = () => {
    return (
      deleteMode ||
      (editMode &&
        (isSeller ||
          formikProps.values.publishingOrdersCounter > 0 ||
          formikProps.values.invoiceNumber != ""))
    );
  };

  const isDisabledContractName = () => {
    return (
      deleteMode ||
      (editMode &&
        (formikProps.values.publishingOrdersCounter > 0 ||
          formikProps.values.invoiceNumber != ""))
    );
  };

  return (
    <NewClientFormContainer>
      <h3>
        {addMode ? "Agregar Contrato" : null}
        {editMode ? "Editar Contrato" : null}
        {deleteMode ? "Eliminar Contrato" : null}
      </h3>
      <Form>
        <div className="form-row">
          <div className="col-1">
            <InputTextField
              labelText="Numero"
              name="number"
              disabled={true}
              error={errors.number}
            />
          </div>
          <div className="col-7">
            <InputSelectField
              labelText="Cliente *"
              options={clients}
              getOptionLabel={option =>
                `${option.brandName} - ${option.legalName}`
              }
              onChangeHandler={handleClientChange}
              name="clientId"
              disabled={!addMode}
              error={errors.clientId}
            />
          </div>
          <div className="col-4">
            <InputSelectField
              labelText="Vendedor"
              options={availableSalesmens}
              getOptionLabel={option => option.fullName}
              name="sellerId"
              disabled={true}
              error={errors.sellerId}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col-12">
            <InputTextField
              labelText="Nombre *"
              name="name"
              disabled={isDisabledContractName()}
              error={errors.name}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col-3">
            <InputSelectField
              labelText="Producto *"
              name="productId"
              options={availableProducts}
              onChangeHandler={handleProductChange}
              disabled={deleteMode || editMode}
              error={errors.productId}
            ></InputSelectField>
          </div>
          <div className=" col-3">
            <InputDatePickerField
              labelText="Fecha Contrato"
              name="contractDate"
              disabled={true}
            />
          </div>
          <div className=" col-3">
            <InputDatePickerField
              labelText="Fecha Inicio *"
              name="start"
              onChangeHandler={startDate => {
                formikProps.setFieldValue("end", addYears(startDate, 1));
              }}
              error={errors.start}
              disabled={deleteMode || (isSeller && editMode)}
            />
          </div>
          <div className=" col-3">
            <InputDatePickerField
              labelText="Fecha Vencimiento *"
              name="end"
              error={errors.end}
              maxDate={
                isSeller
                  ? new Date(
                      new Date(formikProps.values.start).getFullYear() + 1,
                      new Date(formikProps.values.start).getMonth(),
                      new Date(formikProps.values.start).getDate()
                    )
                  : null
              }
              disabled={deleteMode || (isSeller && editMode)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col-4">
            <InputSelectField
              labelText="Condición de Facturación *"
              name="billingConditionId"
              options={getBillingConditions()}
              disabled={isDisabledCondFact()}
              error={errors.billingConditionId}
              onChangeHandler={option => {
                formikProps.setFieldValue("invoiceNumber", "");
              }}
            ></InputSelectField>
          </div>
          <div className="col-4">
            <InputSelectField
              labelText="Forma de Pago *"
              name="paymentMethodId"
              options={getPaymentMethod()}
              disabled={deleteMode || (isSeller && editMode)}
              error={errors.paymentMethodId}
              onChangeHandler={handlePaymentMethodChange}
            ></InputSelectField>
          </div>
          <div className="col-4">
            <InputSelectField
              labelText="Moneda *"
              name="currencyId"
              options={currencies}
              disabled={deleteMode || (isSeller && editMode)}
              error={errors.currencyId}
              onChangeHandler={handleCurrencyChange}
            ></InputSelectField>
          </div>
        </div>
        <div className="form-row">
          <div className="col-3">
            <InputSelectField
              labelText="En que país facturar?"
              name="billingCountryId"
              options={countriesForBilling}
              disabled={deleteMode || (isSeller && editMode)}
              error={errors.billingCountryId}
            ></InputSelectField>
          </div>

          {formikProps.values.billingConditionId === 1 ? (
            <div className="col-3">
              <InputTextField
                labelText="Nro. Factura"
                name="invoiceNumber"
                disabled={deleteMode || isSeller}
                error={errors.invoiceNumber}
              />
            </div>
          ) : null}
          {formikProps.values.billingConditionId === 1 ? (
            <div className="col-1">
              <div className="check-container">
                <InputCheckboxField
                  labelText="Pagada"
                  name="paidOut"
                  disabled={
                    deleteMode ||
                    formikProps.values.invoiceNumber.length === 0 ||
                    isSeller
                  }
                  error={errors.paidOut}
                  inline
                />
              </div>
            </div>
          ) : null}
        </div>
        <h5>Espacios Vendidos</h5>
        <SpacesSold
          addMode={addMode}
          editMode={editMode}
          deleteMode={deleteMode}
          availableProducts={availableProducts}
          availableSpaceTypes={availableSpaceTypes}
          availableSpaceLocations={availableSpaceLocations}
          formikProps={formikProps}
          isSeller={isSeller}
          selectedItem={selectedItem}
          productSelected={
            availableProducts.filter(
              x => x.id === formikProps.values.productId
            )[0]
          }
        />
        <div className="form-row">
          <div className="col-8" style={{ marginTop: "-80px" }}>
            <InputTextAreaField
              labelText="Observaciones"
              name="observations"
              disabled={deleteMode || (isSeller && editMode)}
              rows={6}
            />
          </div>
          <div className="col-4">
            <div className="form-totals-container">
              <div className="price">
                <span className="title">
                  {`Espacios vendidos (${formikProps.values.quantitySP}):`}
                </span>
                <span className="text">
                  $ {getSubtotalContract(formikProps.values, availableProducts)}
                </span>
              </div>
              <div className="discount">
                <span className="title">Descuentos:</span>
                <span className="text">
                  $ {getTotalsDiscounts(formikProps.values, availableProducts)}
                </span>
                <small
                  style={{
                    display: errors.totalDiscounts ? "block" : "none",
                    color: "red",
                  }}
                >
                  {errors.totalDiscounts}
                </small>
              </div>
              <div className="taxes">
                <span className="title">{`IVA (${formikProps.values.iva *
                  100}%):`}</span>
                <span className="text">
                  $ {getTotalTaxes(formikProps.values, availableProducts)}
                </span>
              </div>
              <div className="total">
                <span className="title">Total contrato:</span>
                <span className="text">
                  $ {getTotalContract(formikProps.values, availableProducts)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className={`button-container ${loading && "disabledDiv"}`}>
          {editMode ? (
            <>
              <button
                className="btn btn-primary"
                style={{ float: "left" }}
                type="button"
                // type={type}
                onClick={values => {
                  if (
                    !Object.values(errors).some(value => value !== "") ||
                    (formikProps.errors.hasOwnProperty("soldSpaces") &&
                      formikProps.errors.soldSpaces.length != 0 &&
                      formikProps.errors.soldSpaces[0].specialDiscount == "")
                  ) {
                    formikProps.validateForm().then(result => {
                      if (
                        Object.keys(result).length === 0 &&
                        !Object.values(errors).some(value => value !== "")
                      ) {
                        formikPropsDuplicateHandler(formikProps);
                        duplicateContractHandler();
                      }
                    });
                  }
                }}
              >
                Duplicar
              </button>
            </>
          ) : (
            <></>
          )}
          {deleteMode ? (
            <>
              <SaveButton onClickHandler={closeHandler} disabled={loading}>
                Volver
              </SaveButton>
              <DangerButton type="submit">Eliminar</DangerButton>
            </>
          ) : editMode ? (
            <>
              <DangerButton onClickHandler={closeHandler}>Volver</DangerButton>
              <SaveButton
                disabled={loading}
                onClickHandler={values => {
                  if (loading) {
                    return;
                  }
                  if (
                    Object.keys(formikProps.errors).length === 0 ||
                    (formikProps.errors.hasOwnProperty("soldSpaces") &&
                      (formikProps.errors.soldSpaces.length === 0 ||
                        (formikProps.errors.soldSpaces.length != 0 &&
                          (!formikProps.errors.soldSpaces[0] ||
                            formikProps.errors.soldSpaces[0].specialDiscount ==
                              "" ||
                            formikProps.errors.soldSpaces[0].quantity == ""))))
                  ) {
                    for (
                      let i = 0;
                      i < formikProps.values.soldSpaces.length;
                      i++
                    ) {
                      const totalSP = isNaN(
                        formikProps.values.soldSpaces[i].total
                      )
                        ? parseFloat(
                            formikProps.values.soldSpaces[i].total
                              .split(".")
                              .join("")
                              .replace(",", ".")
                          )
                        : formikProps.values.soldSpaces[i].total;
                      if (totalSP < 0) {
                        toast.error(
                          "La cantidad de descuentos no puede ser mayor al 100%"
                        );
                        return;
                      }
                      if (editMode) {
                        if (
                          formikProps.values.soldSpaces[i].quantity <
                          formikProps.values.quantityOP
                        ) {
                          toast.error(
                            "La cantidad no puede ser menor a la cantidad de órdenes publicadas"
                          );
                          return;
                        }
                      }
                    }

                    // if (formikProps.values.noParity) {
                    //   toast.error(
                    //     "No hay paridad disponible para el producto seleccionado"
                    //   );
                    // } else {
                    saveHandler({
                      ...formikProps.values,
                      searchFilters: filters,
                    });
                    // }
                  }
                }}
              >
                {addMode ? "Agregar" : null}
                {editMode ? "Guardar" : null}
              </SaveButton>
            </>
          ) : (
            <>
              <DangerButton onClickHandler={closeHandler}>Volver</DangerButton>
              <SaveButton isabled={loading} type="submit">
                Agregar
              </SaveButton>
            </>
          )}
        </div>
      </Form>
    </NewClientFormContainer>
  );
};

export default ContractData;
