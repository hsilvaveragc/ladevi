import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import useUser from "shared/security/useUser";
import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import InputTextAreaField from "shared/components/InputTextAreaField";
import { SaveButton, DangerButton } from "shared/components/Buttons";

const NewOrderFormContainer = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  small {
    min-height: 1rem;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .check-container {
    display: flex;
    height: 100%;
  }
  .button-container {
    margin-top: 2rem;
    display: flex;
    justify-content: space-evenly;
    button {
      width: 25%;
    }
  }
`;

const Order = ({
  selectedItem,
  availableProducts,
  availableEditions,
  availableClients,
  availableSalesmens,
  availableContracts,
  availableSpaceTypes,
  availableSpaceLocations,
  saveHandler,
  addMode,
  editMode,
  deleteMode,
  errors,
  closeHandler,
  getProductEditionsHandler,
  getContractsAvailableHandler,
  getSpaceTypesAvailableHandler,
  getSpaceLocationsAvailableHandler,
  isFromContract,
  contract,
  updateOrdenesHandler,
  closeModalFromContract,
  getClientsWithBalanceHandler,
  params,
  updateHistorial,
  allClients,
  deleteOrderHandlerFromContract,
  isLoadingClients,
  isLoadingContracts,
  isLoadingSpaceTypes,
  isLoadingSpaceLocations,
}) => {
  const { userRol, userId } = useUser();

  const disabledByClosedEdition =
    editMode && !selectedItem.canDelete && selectedItem.productEdition.closed;

  const disabledByPageNumber =
    editMode && selectedItem.pageNumber !== "" && !userRol.isAdmin;

  const getSellerId = () => {
    if (isFromContract) {
      return userRol.isSeller ? parseFloat(userId) : contract.sellerId;
    } else {
      if (addMode) {
        return userRol.isSeller ? parseFloat(userId) : "";
      } else {
        return selectedItem.sellerId;
      }
    }
  };

  const [enableInvoice, setEnableInvoice] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (isFromContract) {
      getClientsWithBalanceHandler({
        clientId: contract.clientId,
        productId: contract.productId,
      });
      getProductEditionsHandler({
        productId: contract.productId,
        editionId: addMode ? -1 : selectedItem.productEditionId,
      });
      getSpaceTypesAvailableHandler({
        latent: false,
        contractId: contract.id,
        productId: contract.productId,
        soldSpaceId: addMode ? 0 : selectedItem.soldSpaceId,
      });

      if (editMode) {
        getSpaceLocationsAvailableHandler({
          latent: false,
          soldSpaceId: selectedItem.soldSpaceId,
          productId: selectedItem.productEdition.productId,
          opId: selectedItem.id,
        });
      } else {
        availableSpaceLocations = [];
      }

      setEnableInvoice(contract.billingConditionId === 2 && !userRol.isSeller);
      setShowInvoice(contract.billingConditionId !== 1);
    } else {
      if (!addMode) {
        getClientsWithBalanceHandler({
          clientId: selectedItem.clientId,
          productId: selectedItem.productEdition.productId,
        });
        getProductEditionsHandler({
          productId: selectedItem.productEdition.productId,
          editionId: selectedItem.productEditionId,
        });
        getContractsAvailableHandler({
          productId: selectedItem.productEdition.productId,
          clientId: selectedItem.clientId,
          contractId: selectedItem.latent ? 0 : selectedItem.contractId,
        });
        getSpaceTypesAvailableHandler({
          latent: selectedItem.latent,
          contractId: selectedItem.latent ? 0 : selectedItem.contractId,
          productId: selectedItem.productEdition.productId,
          soldSpaceId: selectedItem.latent ? 0 : selectedItem.soldSpaceId,
        });

        if (selectedItem.contractId) {
          getSpaceLocationsAvailableHandler({
            latent: selectedItem.latent,
            soldSpaceId: selectedItem.soldSpaceId,
            productId: selectedItem.productEdition.productId,
            opId: selectedItem.id,
          });
          setShowInvoice(selectedItem.contract.billingConditionId !== 1);
        } else {
          getSpaceLocationsAvailableHandler({
            latent: selectedItem.latent,
            soldSpaceId: 0,
            productId: selectedItem.productEdition.productId,
            opId: selectedItem.id || -1,
          });
        }

        if (editMode) {
          if (selectedItem.contractId) {
            setEnableInvoice(
              selectedItem.contract.billingConditionId === 2 &&
                !userRol.isSeller
            );
          } else {
            setEnableInvoice(false);
          }
        }
      }
      // setEnableInvoice(false);
    }
  }, []);

  const validate = values => {
    console.log(values);
    const errors = {};
    if (!values.productId) {
      errors.productId = "Requerido";
    }

    if (!values.latent && !values.contractId) {
      errors.contractId = "Requerido";
    }

    if (!values.clientId) {
      errors.clientId = "Requerido";
    }

    if (!values.productEditionId) {
      errors.productEditionId = "Requerido";
    }

    if (!values.productAdvertisingSpaceId) {
      errors.productAdvertisingSpaceId = "Requerido";
    }

    if (!values.advertisingSpaceLocationTypeId) {
      errors.advertisingSpaceLocationTypeId = "Requerido";
    }

    if (!values.quantity) {
      errors.quantity = "Requerido";
    } else if (values.quantity && Number(values.quantity) < 1) {
      errors.quantity = "Debe ser un valor mayor a 0 ";
    }

    if (isFromContract) {
      const soldSpace = contract.soldSpaces.filter(
        x => x.id === values.soldSpaceId
      )[0];

      if (soldSpace && soldSpace.balance < values.quantity && addMode) {
        errors.quantity = `No hay saldo. Saldo disponible: ${soldSpace.balance}`;
      }
    }

    if (Object.entries(errors).length === 0 && errors.constructor === Object) {
      const productEditionSel = availableEditions.filter(
        x => x.id === values.productEditionId
      )[0];

      if (!isFromContract) {
        saveHandler({
          ...values,
          productEditionSel,
          isFromContract,
          params: params,
          updateOrdenesHandler,
          newOP: {
            productEdition: productEditionSel,
            productAdvertisingSpace: availableSpaceTypes.filter(
              x =>
                x.productAdvertisingSpaceId === values.productAdvertisingSpaceId
            )[0],
            advertisingSpaceLocationType: availableSpaceLocations.filter(
              x => x.id === values.advertisingSpaceLocationTypeId
            )[0],
          },
          updateHistorial,
        });
      } else {
        if (deleteMode) {
          deleteOp({
            ...values,
            productEditionSel,
            isFromContract,
            params: params,
            updateOrdenesHandler,
            newOP: {
              productEdition: productEditionSel,
              productAdvertisingSpace: availableSpaceTypes.filter(
                x =>
                  x.productAdvertisingSpaceId ===
                  values.productAdvertisingSpaceId
              )[0],
              advertisingSpaceLocationType: availableSpaceLocations.filter(
                x => x.id === values.advertisingSpaceLocationTypeId
              )[0],
            },
            updateHistorial,
          });
        } else {
          saveHandler({
            ...values,
            productEditionSel,
            isFromContract,
            params: params,
            updateOrdenesHandler,
            newOP: {
              productEdition: productEditionSel,
              productAdvertisingSpace: availableSpaceTypes.filter(
                x =>
                  x.productAdvertisingSpaceId ===
                  values.productAdvertisingSpaceId
              )[0],
              advertisingSpaceLocationType: availableSpaceLocations.filter(
                x => x.id === values.advertisingSpaceLocationTypeId
              )[0],
            },
            updateHistorial,
          });
        }
        closeModalFromContract();
      }
    }

    return errors;
  };

  const deleteOp = values => {
    deleteOrderHandlerFromContract({
      ...values,
      updateOrdenesHandler,
      isFromContract,
    });
    closeModalFromContract();
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        id: addMode ? "" : selectedItem.id,
        latent: addMode ? false : selectedItem.latent,
        clientId: isFromContract
          ? contract.clientId
          : addMode
          ? ""
          : selectedItem.clientId,
        advertisingSpaceLocationTypeId: addMode
          ? ""
          : selectedItem.advertisingSpaceLocationTypeId,
        productAdvertisingSpaceId: addMode
          ? ""
          : selectedItem.productAdvertisingSpaceId,
        auxProductAdvertisingSpaceId: addMode
          ? ""
          : isFromContract
          ? selectedItem.soldSpaceId
          : selectedItem.soldSpaceId,
        productId: isFromContract
          ? contract.productId
          : addMode
          ? ""
          : selectedItem.productAdvertisingSpace.productId,
        productEditionId: addMode ? "" : selectedItem.productEditionId,
        contractId: isFromContract
          ? contract.id
          : addMode
          ? null
          : selectedItem.contractId,
        pageNumber: addMode ? "" : selectedItem.pageNumber,
        invoiceNumber: addMode ? "" : selectedItem.invoiceNumber,
        paidOut: addMode ? false : selectedItem.paidOut,
        quantity: addMode ? 1 : selectedItem.quantity,
        sellerId: getSellerId(),
        observations: addMode ? "" : selectedItem.observations,
        soldSpaceId: addMode ? "" : selectedItem.soldSpaceId,
        creationDate: addMode ? "" : selectedItem.creationDate,
        canDelete: addMode ? true : selectedItem.canDelete,
      }}
      onSubmit={values => {
        return saveHandler({ ...values, params: params });
      }}
      validate={values => validate(values)}
      enableReinitialize={true}
    >
      {formikProps => {
        if (
          availableSpaceLocations.length === 1 &&
          formikProps.values.advertisingSpaceLocationTypeId !==
            availableSpaceLocations[0].id
        ) {
          formikProps.setFieldValue(
            "advertisingSpaceLocationTypeId",
            availableSpaceLocations[0].id
          );
        }
        return (
          <NewOrderFormContainer>
            <h3>
              {addMode ? "Agregar Orden de Publicación" : null}
              {editMode ? "Editar Orden de Publicación:" : null}
              {deleteMode ? "Eliminar Orden de Publicación" : null}
            </h3>
            <Form autoComplete="off">
              <div className="form-row">
                <div className="col-md-9">
                  <InputSelectField
                    labelText="Producto *"
                    name="productId"
                    options={availableProducts}
                    disabled={
                      isFromContract ||
                      deleteMode ||
                      disabledByClosedEdition ||
                      (editMode && formikProps.values.latent) ||
                      disabledByPageNumber
                    }
                    error={errors.productId}
                    onChangeHandler={product => {
                      getProductEditionsHandler({
                        productId: product.id,
                        editionId: -1,
                      });

                      getClientsWithBalanceHandler({
                        clientId: formikProps.values.clientId || 0,
                        productId: product.id,
                      });

                      if (formikProps.values.clientId) {
                        getContractsAvailableHandler({
                          productId: product.id,
                          clientId: formikProps.values.clientId,
                          contractId: 0,
                        });
                      }

                      if (addMode && formikProps.values.latent === true) {
                        getSpaceTypesAvailableHandler({
                          latent: true,
                          contractId: 0,
                          productId: product.id,
                          soldSpaceId: 0,
                        });
                      }
                    }}
                  />
                </div>
                {!isFromContract && (
                  <div className="col-md-3">
                    <div className="check-container">
                      <InputCheckboxField
                        labelText="Latente"
                        name="latent"
                        disabled={
                          isFromContract ||
                          deleteMode ||
                          formikProps.values.contractId > 0 ||
                          disabledByClosedEdition ||
                          disabledByPageNumber
                        }
                        error={errors.latent}
                        inline
                        onChangeHandler={evt => {
                          console.log("Es latente: ", evt.target.value);
                          if (evt.target.value) {
                            if (formikProps.values.productId != "") {
                              getSpaceTypesAvailableHandler({
                                latent: true,
                                contractId: 0,
                                productId: formikProps.values.productId,
                                soldSpaceId: 0,
                              });
                            }
                          } else {
                            getClientsWithBalanceHandler({
                              clientId:
                                (addMode ? 0 : formikProps.values.clientId) ||
                                0,
                              productId: formikProps.values.productId || 0,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="col-md-12" style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <InputSelectField
                        labelText="Edición *"
                        name="productEditionId"
                        options={availableEditions}
                        disabled={
                          deleteMode ||
                          (editMode && formikProps.values.latent) ||
                          disabledByClosedEdition ||
                          disabledByPageNumber
                        }
                        error={errors.productEditionId}
                        onChangeHandler={edicion => {
                          if (formikProps.values.latent) {
                            getSpaceTypesAvailableHandler({
                              latent: true,
                              contractId: 0,
                              productId: formikProps.values.productId,
                              soldSpaceId: 0,
                            });
                          }
                        }}
                      />
                    </div>
                    {editMode && selectedItem.productEdition.closed && (
                      <div
                        style={{
                          position: "relative",
                          top: "0.5rem",
                          cursor: "pointer",
                        }}
                        title="No se puede modificar el aviso ya que la edición está cerrada"
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-info"
                          style={{
                            fontSize: "1.25rem",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-9">
                  <InputSelectField
                    labelText="Cliente *"
                    name="clientId"
                    options={
                      formikProps.values.latent
                        ? allClients
                        : availableClients.filter(
                            x =>
                              x.isEnabled ||
                              x.id === formikProps.values.clientId
                          )
                    }
                    getOptionLabel={option =>
                      `${option.brandName} - ${option.legalName}`
                    }
                    isLoading={isLoadingClients}
                    disabled={
                      isFromContract ||
                      deleteMode ||
                      disabledByClosedEdition ||
                      disabledByPageNumber ||
                      isLoadingClients
                    }
                    error={errors.clientId}
                    onChangeHandler={client => {
                      if (formikProps.values.productId) {
                        getContractsAvailableHandler({
                          productId: formikProps.values.productId,
                          clientId: client.id,
                          contractId: 0,
                        });
                      }

                      if (formikProps.values.latent) {
                        getSpaceTypesAvailableHandler({
                          latent: true,
                          contractId: 0,
                          productId: formikProps.values.productId,
                          soldSpaceId: 0,
                        });
                      }

                      formikProps.setFieldValue(
                        "sellerId",
                        client.applicationUserSellerId
                      );
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <InputSelectField
                    labelText="Vendedor"
                    name="sellerId"
                    options={availableSalesmens}
                    getOptionLabel={option => option.fullName}
                    disabled={true}
                    error={errors.sellerId}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-12">
                  <InputSelectField
                    labelText="Contrato"
                    name="contractId"
                    options={availableContracts}
                    isLoading={isLoadingContracts}
                    disabled={
                      isFromContract ||
                      deleteMode ||
                      disabledByClosedEdition ||
                      formikProps.values.latent ||
                      disabledByPageNumber ||
                      isLoadingContracts
                    }
                    error={errors.contractId}
                    onChangeHandler={contract => {
                      formikProps.setFieldValue("sellerId", contract.sellerId);
                      formikProps.setFieldValue(
                        "auxProductAdvertisingSpaceId",
                        -1
                      );
                      formikProps.setFieldValue(
                        "advertisingSpaceLocationTypeId",
                        -1
                      );
                      getSpaceTypesAvailableHandler({
                        latent: formikProps.values.latent,
                        contractId: contract.id,
                        productId: formikProps.values.productId,
                        soldSpaceId: 0,
                      });

                      setEnableInvoice(
                        contract.billingConditionId === 2 && !userRol.isSeller
                      );
                      setShowInvoice(contract.billingConditionId !== 1);
                      console.log(contract.billingConditionId);
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-9">
                  <InputSelectField
                    labelText="Tipo de Espacio *"
                    name="auxProductAdvertisingSpaceId"
                    options={availableSpaceTypes}
                    isLoading={isLoadingSpaceTypes}
                    disabled={
                      deleteMode ||
                      disabledByClosedEdition ||
                      (editMode && formikProps.values.latent) ||
                      disabledByPageNumber ||
                      isLoadingSpaceTypes
                    }
                    error={errors.productAdvertisingSpaceId}
                    onChangeHandler={pas => {
                      const productSel = formikProps.values.productId;
                      if (formikProps.values.contractId) {
                        formikProps.setFieldValue(
                          "productAdvertisingSpaceId",
                          pas.productAdvertisingSpaceId
                        );
                        formikProps.setFieldValue("soldSpaceId", pas.id);
                        getSpaceLocationsAvailableHandler({
                          latent: formikProps.values.latent,
                          soldSpaceId: pas.id,
                          productId: productSel,
                          opId: addMode ? -1 : formikProps.values.id,
                        });
                      } else {
                        formikProps.setFieldValue(
                          "productAdvertisingSpaceId",
                          pas.id
                        );
                        formikProps.setFieldValue("soldSpaceId", null);
                        getSpaceLocationsAvailableHandler({
                          latent: formikProps.values.latent,
                          soldSpaceId: 0,
                          productId: productSel,
                          opId: addMode ? -1 : formikProps.values.id,
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <InputTextField
                    labelText="Cantidad *"
                    name="quantity"
                    type="number"
                    disabled={
                      deleteMode ||
                      disabledByClosedEdition ||
                      (editMode && formikProps.values.latent) ||
                      disabledByPageNumber
                    }
                    error={errors.quantity}
                  />
                </div>
              </div>
              <div className="form-row">
                {showInvoice && (
                  <>
                    <div className="col-md-9">
                      <InputTextField
                        labelText="Factura"
                        name="invoiceNumber"
                        disabled={
                          deleteMode ||
                          userRol.isSeller ||
                          !enableInvoice ||
                          disabledByClosedEdition ||
                          disabledByPageNumber
                        }
                        error={errors.invoiceNumber}
                      />
                    </div>
                    <div className="col-md-3">
                      <div className="check-container">
                        <InputCheckboxField
                          labelText="Pagada"
                          name="paidOut"
                          disabled={
                            deleteMode ||
                            !formikProps.values.invoiceNumber ||
                            userRol.isSeller ||
                            !enableInvoice ||
                            disabledByPageNumber
                          }
                          error={errors.paidOut}
                          inline
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="form-row">
                <div className="col-md-3">
                  <InputTextField
                    labelText="Página"
                    name="pageNumber"
                    disabled={
                      deleteMode ||
                      disabledByClosedEdition ||
                      disabledByPageNumber
                    }
                    error={errors.pageNumber}
                    type="text"
                    maxlength="6"
                  />
                </div>
                <div className="col-md-6">
                  <InputSelectField
                    labelText="Ubicación *"
                    name="advertisingSpaceLocationTypeId"
                    options={availableSpaceLocations}
                    isLoading={isLoadingSpaceLocations}
                    disabled={
                      deleteMode ||
                      (editMode && formikProps.values.latent) ||
                      formikProps.values.auxProductAdvertisingSpaceId === -1 ||
                      disabledByClosedEdition ||
                      disabledByPageNumber ||
                      isLoadingSpaceLocations
                    }
                    error={errors.advertisingSpaceLocationTypeId}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-12">
                  <InputTextAreaField
                    labelText="Observaciones"
                    name="observations"
                    disabled={
                      deleteMode ||
                      (editMode && formikProps.values.latent) ||
                      disabledByClosedEdition ||
                      disabledByPageNumber
                    }
                  />
                </div>
              </div>
              <div className="button-container">
                {deleteMode ? (
                  <>
                    <SaveButton onClickHandler={closeHandler}>
                      Volver
                    </SaveButton>
                    <DangerButton
                      type="button"
                      children={"Eliminar"}
                      onClickHandler={evt => {
                        formikProps.validateForm();
                      }}
                    ></DangerButton>
                  </>
                ) : (
                  <>
                    <DangerButton onClickHandler={closeHandler}>
                      Volver
                    </DangerButton>
                    <SaveButton
                      type="button"
                      disabled={disabledByClosedEdition || disabledByPageNumber}
                      onClickHandler={evt => {
                        formikProps.validateForm();
                      }}
                    >
                      {addMode ? "Agregar" : null}
                      {editMode ? "Guardar" : null}
                    </SaveButton>
                  </>
                )}
              </div>
            </Form>
          </NewOrderFormContainer>
        );
      }}
    </Formik>
  );
};

export default Order;
