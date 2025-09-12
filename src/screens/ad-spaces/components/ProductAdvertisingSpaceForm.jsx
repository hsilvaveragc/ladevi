import React from "react";
import styled from "styled-components";
import { Formik, Form, FieldArray } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";

import InputSelectField from "shared/components/InputSelectField";
import InputTextField from "shared/components/InputTextField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import { SaveButton, DangerButton } from "shared/components/Buttons";

const ProductAdvertisingSpaceFormContainer = styled.div`
  width: 50vw;
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1.8rem;
  }
  .col-md-3 {
  }
  .volume-group-container {
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
const ProductAdvertisingSpaceForm = ({
  selectedItem,
  availableAdsSpaceLocationType,
  deleteMode,
  editMode,
  addMode,
  saveHandler,
  closeHandler,
  productsAvailable,
  errors,
  params,
}) => (
  <Formik
    validateOnChange={false}
    validateOnBlur={false}
    initialValues={{
      id: addMode ? "" : selectedItem.id,
      name: addMode ? "" : selectedItem.name,
      productId: addMode ? "" : selectedItem.productId,
      dollarPrice: addMode
        ? ""
        : selectedItem.dollarPrice.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
          }),
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
      discountForSameCountry: addMode
        ? ""
        : selectedItem.discountForSameCountry.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
          }),
      discountForOtherCountry: addMode
        ? ""
        : selectedItem.discountForOtherCountry,
      discountForAgency: addMode
        ? ""
        : selectedItem.discountForAgency.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
          }),
      height: addMode
        ? ""
        : selectedItem.height.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
          }),
      width: addMode
        ? ""
        : selectedItem.width.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
          }),
      show: addMode ? true : selectedItem.show,
      productAdvertisingSpaceLocationDiscounts:
        addMode ||
        (editMode &&
          selectedItem.productAdvertisingSpaceLocationDiscounts.length === 0)
          ? [
              {
                id: 0,
                discount: "",
                advertisingSpaceLocationTypeId: "",
              },
            ]
          : selectedItem.productAdvertisingSpaceLocationDiscounts.map(pld => ({
              ...pld,
              discount: pld.discount.toLocaleString("pt-BR", {
                maximumFractionDigits: 2,
              }),
              advertisingSpaceLocationTypeId:
                pld.advertisingSpaceLocationTypeId,
            })),
      productAdvertisingSpaceVolumeDiscounts:
        addMode ||
        (editMode &&
          selectedItem.productAdvertisingSpaceVolumeDiscounts.length === 0)
          ? [
              {
                id: 0,
                rangeStart: "",
                rangeEnd: 999999,
                discount: "",
              },
            ]
          : selectedItem.productAdvertisingSpaceVolumeDiscounts
              .map(pvd => ({
                ...pvd,
                rangeStart: pvd.rangeStart,
                rangeEnd: pvd.rangeEnd,
                discount: pvd.discount.toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                }),
              }))
              .slice()
              .sort((a, b) => a.rangeStart - b.rangeStart),
    }}
    onSubmit={values => {
      let data = { ...values, countryId: +values.countryId, params: params };
      // data.productAdvertisingSpaceVolumeDiscounts = data.productAdvertisingSpaceVolumeDiscounts.filter(
      //   x => x.id !== 0 && !x.rangeStart && x.discount
      // );
      saveHandler(data);
    }}
    validationSchema={Yup.object().shape({
      name: Yup.string().required("Requerido"),
      productId: Yup.string().required("Requerido"),
      dollarPrice: Yup.string().required("Requerido"),
      height: Yup.string().required("Requerido"),
      width: Yup.string().required("Requerido"),
      discountForCheck: Yup.string().required("Requerido"),
      discountForLoyalty: Yup.string().required("Requerido"),
      discountForAgency: Yup.string().required("Requerido"),
      discountForSameCountry: Yup.string().required("Requerido"),
      discountForOtherCountry: Yup.string().required("Requerido"),
    })}
  >
    {formikProps => (
      <ProductAdvertisingSpaceFormContainer className="container">
        <h3>
          {addMode ? "Agregar Tipo de Espacio" : null}
          {editMode ? "Editar Tipo de Espacio" : null}
          {deleteMode ? "Eliminar Tipo de Espacio" : null}
        </h3>
        <Form autoComplete="off">
          <div className="form-row">
            <div className="col-md-10">
              <InputTextField
                labelText="Nombre"
                name="name"
                readOnly={deleteMode}
                error={errors.name}
              />
            </div>
            <div className="col-md-2">
              {" "}
              <InputTextField
                labelText="Precio (U$S):"
                name="dollarPrice"
                readOnly={deleteMode}
                error={errors.dollarPrice}
              />
            </div>
          </div>
          <div className="form-row"></div>
          <div className="form-group">
            <InputSelectField
              labelText="Producto"
              name="productId"
              readOnly={deleteMode}
              options={productsAvailable}
              error={errors.productId}
            />
          </div>
          <div className="form-row">
            <div className="col-md-6">
              <InputTextField
                labelText="Ancho (cm)"
                name="width"
                readOnly={deleteMode}
                error={errors.width}
              />
            </div>
            <div className="col-md-6">
              <InputTextField
                labelText="Alto (cm)"
                name="height"
                readOnly={deleteMode}
                error={errors.height}
              />
            </div>
          </div>
          <div className="form-row">
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                columnGap: "5px",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <InputTextField
                labelText="Dto. Cheque (%)"
                name="discountForCheck"
                disabled={deleteMode}
                error={errors.discountForCheck}
              />{" "}
              <InputTextField
                labelText="Dto. Fidelización (%)"
                name="discountForLoyalty"
                disabled={deleteMode}
                error={errors.discountForLoyalty}
              />{" "}
              <InputTextField
                labelText="Dto. Nacional (%)"
                name="discountForSameCountry"
                disabled={deleteMode}
                error={errors.discountForSameCountry}
              />{" "}
              <InputTextField
                labelText="Dto. Internacional (%)"
                name="discountForOtherCountry"
                disabled={deleteMode}
                error={errors.discountForOtherCountry}
              />{" "}
              <InputTextField
                labelText="Dto. Agencia (%)"
                name="discountForAgency"
                disabled={deleteMode}
                error={errors.discountForAgency}
              />
            </div>
          </div>{" "}
          <div className="volume-group-container">
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
                Descuentos por Ubicación
              </legend>
              <FieldArray
                name="productAdvertisingSpaceLocationDiscounts"
                validateOnChange={false}
                render={({ insert, remove, push, form }) => {
                  return (
                    <>
                      {formikProps.values
                        .productAdvertisingSpaceLocationDiscounts.length > 0 &&
                        formikProps.values.productAdvertisingSpaceLocationDiscounts.map(
                          (item, index) => {
                            return (
                              <div
                                className="form-row"
                                key={index}
                                style={{
                                  display: item.shouldDelete ? "none" : "flex",
                                }}
                              >
                                <div className="col-md-5">
                                  <InputSelectField
                                    labelText="Ubicación"
                                    name={`productAdvertisingSpaceLocationDiscounts.${index}.advertisingSpaceLocationTypeId`}
                                    options={availableAdsSpaceLocationType}
                                    disabled={deleteMode}
                                    error={
                                      errors.productAdvertisingSpaceLocationDiscounts
                                    }
                                  />
                                </div>
                                <div className="col-md-5">
                                  <InputTextField
                                    labelText="Descuento por Ubicación"
                                    name={`productAdvertisingSpaceLocationDiscounts.${index}.discount`}
                                    disabled={deleteMode}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <div className="button-container">
                                    <button
                                      className="btn btn-outline-secondary"
                                      onClick={e => {
                                        e.preventDefault();
                                        if (deleteMode) {
                                          return;
                                        }
                                        if (
                                          formikProps.values
                                            .productAdvertisingSpaceLocationDiscounts
                                            .length !== 1
                                        ) {
                                          //remove(index);
                                          formikProps.setFieldValue(
                                            `productAdvertisingSpaceLocationDiscounts.${index}.shouldDelete`,
                                            true
                                          );
                                        }
                                        return;
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faMinus}
                                        size="xs"
                                      ></FontAwesomeIcon>
                                    </button>
                                    <button
                                      className="btn btn-outline-secondary"
                                      onClick={e => {
                                        e.preventDefault();
                                        if (deleteMode) {
                                          return;
                                        }
                                        push({
                                          productId: editMode
                                            ? selectedItem.id
                                            : 0,
                                          advertisingSpaceLocationTypeId: "",
                                          discount: "",
                                        });
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        size="xs"
                                      ></FontAwesomeIcon>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </>
                  );
                }}
              />
            </fieldset>{" "}
          </div>
          <div className="volume-group-container">
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
              <FieldArray
                name="productAdvertisingSpaceVolumeDiscounts"
                validateOnChange={false}
                render={({ insert, remove, push, form }) => (
                  <>
                    {formikProps.values.productAdvertisingSpaceVolumeDiscounts
                      .length > 0 &&
                      formikProps.values.productAdvertisingSpaceVolumeDiscounts.map(
                        (item, index) => {
                          return (
                            <div
                              className="form-row"
                              key={index}
                              style={{
                                display: item.shouldDelete ? "none" : "flex",
                              }}
                            >
                              <div className="col-md-5">
                                <InputTextField
                                  labelText="Volumen Min"
                                  name={`productAdvertisingSpaceVolumeDiscounts.${index}.rangeStart`}
                                  disabled={deleteMode}
                                />
                              </div>
                              <div className="col-md-5">
                                <InputTextField
                                  labelText="Descuento"
                                  name={`productAdvertisingSpaceVolumeDiscounts.${index}.discount`}
                                  disabled={deleteMode}
                                />
                              </div>
                              <div className="col-md-2">
                                <div className="button-container">
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={e => {
                                      e.preventDefault();
                                      if (deleteMode) {
                                        return;
                                      }
                                      if (
                                        formikProps.values
                                          .productAdvertisingSpaceVolumeDiscounts
                                          .length !== 1
                                      ) {
                                        // remove(index);
                                        formikProps.setFieldValue(
                                          `productAdvertisingSpaceVolumeDiscounts.${index}.shouldDelete`,
                                          true
                                        );
                                      }
                                      return;
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faMinus}
                                    ></FontAwesomeIcon>
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={e => {
                                      e.preventDefault();
                                      if (
                                        deleteMode
                                        // ||
                                        // !formikProps.values
                                        //   .productAdvertisingSpaceVolumeDiscounts[
                                        //   index
                                        // ].rangeStart ||
                                        // !formikProps.values
                                        //   .productAdvertisingSpaceVolumeDiscounts[
                                        //   index
                                        // ].discount
                                      ) {
                                        return;
                                      }
                                      push({
                                        productAdvertisingSpaceId: editMode
                                          ? selectedItem.id
                                          : 0,
                                        rangeStart: "",
                                        rangeEnd: 999999,
                                        discount: "",
                                      });
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faPlus}
                                    ></FontAwesomeIcon>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </>
                )}
              />
            </fieldset>
          </div>
          <div className="form-group form-row">
            <div className="col-6">
              <InputCheckboxField
                labelText="Mostrar en nuevos contratos"
                name="show"
                readOnly={deleteMode}
                showLabel={true}
                inline
              />
            </div>
          </div>
          <div className="button-container">
            {deleteMode ? (
              <>
                <SaveButton onClickHandler={closeHandler}>Cancelar</SaveButton>
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
      </ProductAdvertisingSpaceFormContainer>
    )}
  </Formik>
);

export default ProductAdvertisingSpaceForm;
