import React from "react";
import styled from "styled-components";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import { SaveButton, DangerButton } from "shared/components/Buttons";

const ProductFormContainer = styled.div`
  width: 50vw;
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1.8rem;
  }
  .col-md-3 {
  }
  .volume-discount-container {
    .form-row {
      margin: 0;
      margin-bottom: 0.5rem;
    }
    .form-group {
      margin: 0;
    }
    .button-container {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      align-items: flex-start;
      height: 100%;
      .btn {
        padding: 10px;
        font-size: 0.5rem;
        margin: 0 5px;
      }
    }
    h5 {
      font-size: 1rem;
      margin: 0;
      margin-bottom: 0.8rem;
    }
    label {
      font-size: 0.8rem;
      font-weight: 500;
    }
  }
`;
const NewProductForm = ({
  selectedItem,
  productTypes,
  availableCountries,
  availableAdsSpaceLocationType,
  xubioProducts,
  xubioProductsComtur,
  deleteMode,
  editMode,
  addMode,
  saveHandler,
  closeHandler,
  errors,
  params,
}) => {
  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        id: addMode ? "" : selectedItem.id,
        productTypeId: addMode ? "" : selectedItem.productTypeId,
        countryId: addMode ? "" : selectedItem.countryId,
        name: addMode ? "" : selectedItem.name,
        discountForCheck: addMode
          ? ""
          : selectedItem.discountForCheck.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        discountForLoyalty: addMode
          ? ""
          : selectedItem.discountForLoyalty.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        discountForAgency: addMode
          ? ""
          : selectedItem.discountForAgency.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        iva: addMode
          ? ""
          : selectedItem.iva.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        xubioProductCode: addMode ? "" : selectedItem.xubioProductCode,
        comturXubioProductCode: addMode
          ? ""
          : selectedItem.comturXubioProductCode,
        discountForSameCountry: addMode
          ? ""
          : selectedItem.discountForSameCountry.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        discountForOtherCountry: addMode
          ? ""
          : selectedItem.discountForOtherCountry,
        discountSpecialBySeller: addMode
          ? ""
          : selectedItem.discountSpecialBySeller.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        maxAplicableDiscount: addMode
          ? 100
          : selectedItem.maxAplicableDiscount.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        aliquotForSalesCommission: addMode
          ? ""
          : selectedItem.aliquotForSalesCommission.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        productLocationDiscounts:
          addMode ||
          (editMode && selectedItem.productLocationDiscounts.length === 0)
            ? [
                {
                  id: 0,
                  discount: "",
                  advertisingSpaceLocationTypeId: "",
                },
              ]
            : selectedItem.productLocationDiscounts.map(pld => ({
                ...pld,
                discount: pld.discount.toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                }),
                advertisingSpaceLocationTypeId:
                  pld.advertisingSpaceLocationTypeId,
              })),
        productVolumeDiscounts: addMode
          ? [
              {
                id: 0,
                rangeStart: "",
                rangeEnd: 999999,
                discount: "",
              },
            ]
          : selectedItem.productVolumeDiscounts.length > 0
          ? selectedItem.productVolumeDiscounts
              .map(pvd => ({
                ...pvd,
                rangeStart: pvd.rangeStart,
                rangeEnd: pvd.rangeEnd,
                discount: pvd.discount.toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                }),
              }))
              .slice()
              .sort((a, b) => a.rangeStart - b.rangeStart)
          : [
              {
                id: 0,
                rangeStart: "",
                rangeEnd: 999999,
                discount: "",
              },
            ],
      }}
      onSubmit={values => {
        return saveHandler({ ...values, params: params });
      }}
      validationSchema={Yup.object().shape({
        productTypeId: Yup.string().required("Requerido"),
        countryId: Yup.string().required("Requerido"),
        name: Yup.string().required("Requerido"),
        iva: Yup.string().required("Requerido"),
        aliquotForSalesCommission: Yup.string().required("Requerido"),
        maxAplicableDiscount: Yup.string().required("Requerido"),
        discountForCheck: Yup.string().required("Requerido"),
        discountForLoyalty: Yup.string().required("Requerido"),
        discountForAgency: Yup.string().required("Requerido"),
        discountForSameCountry: Yup.string().required("Requerido"),
        discountForOtherCountry: Yup.string().required("Requerido"),
      })}
    >
      {formikProps => {
        return (
          <ProductFormContainer className="container">
            <h3>
              {addMode ? "Agregar Producto" : null}
              {editMode ? "Editar Producto" : null}
              {deleteMode ? "Eliminar Producto" : null}
            </h3>
            <Form autoComplete="off">
              <div className="form-row">
                <div className="col-md-6">
                  <InputSelectField
                    labelText="Tipo de Producto"
                    name="productTypeId"
                    options={productTypes}
                    disabled={deleteMode}
                    error={errors.productTypeId}
                  />
                </div>
                <div className="col-md-6">
                  <InputSelectField
                    labelText="País"
                    name="countryId"
                    options={availableCountries}
                    disabled={deleteMode}
                    error={errors.countryId}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-12">
                  <InputTextField
                    labelText="Nombre"
                    name="name"
                    disabled={deleteMode}
                    error={errors.name}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-6">
                  <InputTextField
                    labelText="Descuento especial máximo por contrato (%)"
                    name="maxAplicableDiscount"
                    disabled={deleteMode}
                    error={errors.maxAplicableDiscount}
                  />
                </div>
                <div className="col-md-6">
                  <InputTextField
                    labelText="Alicuota para comisión (%)"
                    name="aliquotForSalesCommission"
                    disabled={deleteMode}
                    error={errors.aliquotForSalesCommission}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-6">
                  <InputTextField
                    labelText="IVA (%)"
                    name="iva"
                    disabled={deleteMode}
                    error={errors.iva}
                    parseNumber
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-6">
                  <InputSelectField
                    labelText="Producto Xubio Argentina"
                    name="xubioProductCode"
                    options={xubioProducts}
                    disabled={deleteMode}
                    error={errors.countryId}
                    getOptionValue={option => option.code}
                  />
                </div>
                <div className="col-md-6">
                  <InputSelectField
                    labelText="Producto Xubio Comtur"
                    name="comturXubioProductCode"
                    options={xubioProductsComtur}
                    disabled={deleteMode}
                    error={errors.comturXubioProductCode}
                    getOptionValue={option => option.code}
                  />
                </div>
              </div>
              <fieldset
                style={{
                  width: "100%",
                  border: "1px solid black",
                  padding: "0 1.4em 1.4em 1.4em",
                  margin: "0 0 1.5em 0",
                }}
              >
                <legend
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    textAlign: "left",
                    width: "auto",
                    padding: "0 10px",
                    borderBottom: "none",
                  }}
                >
                  Ubicaciones
                </legend>
                <FieldArray
                  name="productLocationDiscounts"
                  validateOnChange={false}
                  render={({ insert, remove, push, form }) => {
                    return (
                      <>
                        {formikProps.values.productLocationDiscounts.length >
                          0 &&
                          formikProps.values.productLocationDiscounts
                            // .filter(x => !x.shouldDelete)
                            .map((item, index) => {
                              return (
                                <div
                                  className="form-row"
                                  style={{
                                    display: item.shouldDelete
                                      ? "none"
                                      : "flex",
                                  }}
                                >
                                  <div className="col-md-5">
                                    <InputSelectField
                                      labelText="Ubicación"
                                      name={`productLocationDiscounts.${index}.advertisingSpaceLocationTypeId`}
                                      options={availableAdsSpaceLocationType}
                                      disabled={true}
                                      error={errors.productLocationDiscounts}
                                    />
                                  </div>
                                  <div className="col-md-5">
                                    <InputTextField
                                      labelText="Descuento por Ubicación"
                                      name={`productLocationDiscounts.${index}.discount`}
                                      disabled={true}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                      </>
                    );
                  }}
                />
              </fieldset>
              <div className="form-row">
                <div className="col-md-4">
                  <InputTextField
                    labelText="Dto. Cheque (%)"
                    name="discountForCheck"
                    disabled={true}
                    error={errors.discountForCheck}
                  />
                </div>
                <div className="col-md-4">
                  <InputTextField
                    labelText="Dto. Fidelización (%)"
                    name="discountForLoyalty"
                    disabled={true}
                    error={errors.discountForLoyalty}
                  />
                </div>
                <div className="col-md-4">
                  <InputTextField
                    labelText="Dto. Nacional (%)"
                    name="discountForSameCountry"
                    disabled={true}
                    error={errors.discountForSameCountry}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-4">
                  <InputTextField
                    labelText="Dto. Internacional (%)"
                    name="discountForOtherCountry"
                    disabled={true}
                    error={errors.discountForOtherCountry}
                  />
                </div>
                <div className="col-md-4">
                  <InputTextField
                    labelText="Dto. Agencia (%)"
                    name="discountForAgency"
                    disabled={true}
                    error={errors.discountForAgency}
                  />
                </div>
              </div>
              <div className="volume-discount-container">
                <fieldset
                  style={{
                    width: "100%",
                    border: "1px solid black",
                    padding: "0 1.4em 1.4em 1.4em",
                    margin: "0 0 1.5em 0",
                  }}
                >
                  <legend
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      textAlign: "left",
                      width: "auto",
                      padding: "0 10px",
                      borderBottom: "none",
                    }}
                  >
                    Descuentos por Volumen
                  </legend>
                  <div className="form-row">
                    <FieldArray
                      name="productVolumeDiscounts"
                      validateOnChange={false}
                      render={({ insert, remove, push, form }) => (
                        <>
                          {formikProps.values.productVolumeDiscounts.length >
                            0 &&
                            formikProps.values.productVolumeDiscounts.map(
                              (item, index) => {
                                return (
                                  <div
                                    className="form-row"
                                    key={index}
                                    style={{
                                      display: item.shouldDelete
                                        ? "none"
                                        : "flex",
                                    }}
                                  >
                                    <div className="col-md-3">
                                      <InputTextField
                                        labelText="Volumen Min"
                                        name={`productVolumeDiscounts.${index}.rangeStart`}
                                        disabled={true}
                                      />
                                    </div>
                                    <div className="col-md-3">
                                      <InputTextField
                                        labelText="Descuento"
                                        name={`productVolumeDiscounts.${index}.discount`}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )}
                        </>
                      )}
                    />
                  </div>
                </fieldset>
              </div>
              <div className="button-container">
                {deleteMode ? (
                  <>
                    <SaveButton onClickHandler={closeHandler}>
                      Cancelar
                    </SaveButton>
                    <DangerButton type="submit">Eliminar</DangerButton>
                  </>
                ) : (
                  <>
                    <DangerButton onClickHandler={closeHandler}>
                      Cancelar
                    </DangerButton>
                    <SaveButton type="submit">
                      {addMode ? "Agregar" : null}
                      {editMode ? "Guardar" : null}
                    </SaveButton>
                  </>
                )}
              </div>
            </Form>
          </ProductFormContainer>
        );
      }}
    </Formik>
  );
};

export default NewProductForm;
