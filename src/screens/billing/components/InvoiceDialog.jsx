import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  hideInvoiceDialog,
  sendToXubioInit,
  sendMultipleToXubioInit,
} from "../actionCreators";
import {
  getShowInvoiceDialog,
  getCartItems,
  getCurrentXubioProducts,
  getLoading,
  getSelectedClient,
  getCartTotal,
  getClientType,
  getEntityType,
} from "../reducer";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import InputTextAreaFieldSimple from "shared/components/InputTextAreaFieldSimple";

// Función para formatear números con punto como separador de miles y coma decimal
const formatCurrency = (amount, currencySymbol) => {
  return (
    currencySymbol +
    " " +
    new Intl.NumberFormat("es-AR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  );
};

const InvoiceDialog = () => {
  const dispatch = useDispatch();
  const showDialog = useSelector(getShowInvoiceDialog);
  const cartItems = useSelector(getCartItems);
  const xubioProducts = useSelector(getCurrentXubioProducts);
  const loading = useSelector(getLoading);
  const selectedClient = useSelector(getSelectedClient);
  const cartTotal = useSelector(getCartTotal);
  const clientType = useSelector(getClientType);
  const entityType = useSelector(getEntityType);

  const [invoiceMode, setInvoiceMode] = useState("separate");
  const [
    consolidatedXubioProductCode,
    setConsolidatedXubioProductCode,
  ] = useState("");
  const [globalObservations, setGlobalObservations] = useState("");
  const [groupedByClient, setGroupedByClient] = useState({});

  const isEditionFlow = entityType === "EDITIONS";

  // Agrupar items por cliente cuando es flujo de ediciones
  useEffect(() => {
    if (isEditionFlow && cartItems && cartItems.length > 0) {
      const grouped = {};

      cartItems.forEach(item => {
        const clientKey = `${item.clientId}_${item.clientName}`;

        if (!grouped[clientKey]) {
          grouped[clientKey] = {
            clientId: item.clientId,
            clientName: item.clientName,
            items: [],
            totals: {
              quantity: 0,
              amount: 0,
              taxes: 0,
            },
          };
        }

        grouped[clientKey].items.push(item);
        grouped[clientKey].totals.quantity += item.quantity || 1;
        grouped[clientKey].totals.amount += item.total || item.amount || 0;
        grouped[clientKey].totals.taxes += item.totalTaxes || 0;
      });

      setGroupedByClient(grouped);
    } else {
      setGroupedByClient({});
    }
  }, [cartItems, isEditionFlow]);

  // Determinar el tipo de entidad de la factura (CONTRACT o ORDER)
  const determineEntityType = () => {
    const hasContractItems = cartItems.some(item => item.type === "CONTRACT");
    if (hasContractItems) return "CONTRACT";
    return "ORDER";
  };

  // Obtener la moneda del carrito
  const getCartCurrency = () => {
    return cartItems.length > 0 ? cartItems[0].currencyName : null;
  };

  const cartCurrency = getCartCurrency();

  // Contar la cantidad total de items individuales
  const getTotalItemsCount = () => {
    let count = 0;
    cartItems.forEach(cartItem => {
      if (cartItem.type === "CONTRACT" && cartItem.entityItems) {
        count += cartItem.entityItems.length;
      } else if (cartItem.type === "ORDER") {
        count += 1;
      }
    });
    return count;
  };

  const totalItemsCount = getTotalItemsCount();

  // Reset form when dialog opens
  useEffect(() => {
    if (showDialog) {
      setInvoiceMode("separate");
      setConsolidatedXubioProductCode("");
      setGlobalObservations("");
    }
  }, [showDialog]);

  const handleClose = () => {
    dispatch(hideInvoiceDialog());
  };

  const handleInvoiceModeChange = e => {
    setInvoiceMode(e.target.value);
  };

  const handleXubioProductChange = product => {
    setConsolidatedXubioProductCode(product.code || product.Code);
  };

  const handleGlobalObservationsChange = e => {
    setGlobalObservations(e.target.value);
  };

  const handleSendToXubio = () => {
    if (isEditionFlow) {
      // FLUJO PARA EDICIONES: Facturación múltiple
      const invoicesData = Object.values(groupedByClient).map(clientGroup => {
        // Preparar los items del cliente
        const items = clientGroup.items.map(item => ({
          id: item.id,
          xubioProductCode: item.xubioProductCode,
          amount: item.amount || item.total,
          totalTaxes: item.totalTaxes || 0,
          observations: item.observations || item.description,
          quantity: item.quantity || 1,
          price: (item.amount || item.total) / (item.quantity || 1),
        }));

        return {
          clientId: clientGroup.clientId,
          globalObservations: globalObservations || "",
          entityType: "ORDER", // Para ediciones siempre son órdenes
          isConsolidated: false, // Para ediciones, mantener elementos separados
          items: items,
        };
      });

      // Enviar múltiples facturas
      dispatch(sendMultipleToXubioInit(invoicesData));
    } else {
      // Flujo original para contratos
      // Validar datos
      if (
        invoiceMode === "consolidated" &&
        totalItemsCount > 1 &&
        !consolidatedXubioProductCode
      ) {
        return;
      }

      // Si hay un solo item, forzar modo separado
      const effectiveMode = totalItemsCount === 1 ? "separate" : invoiceMode;

      // Determinar el tipo de entidad
      const entityType = determineEntityType();

      // Preparar datos para enviar a Xubio
      let invoiceData = {
        clientId: selectedClient.id,
        globalObservations,
        entityType,
        isConsolidated: effectiveMode === "consolidated",
      };

      if (effectiveMode === "consolidated") {
        // Modo consolidado: un solo item con todos los detalles agrupados
        let consolidatedObservations = "";
        let totalQuantity = 0;
        let totalAmount = 0;
        let totalTaxes = 0;
        const consolidatedIds = [];

        // Generar las observaciones consolidadas y recolectar los IDs
        cartItems.forEach(cartItem => {
          if (cartItem.type === "CONTRACT" && cartItem.entityItems) {
            cartItem.entityItems.forEach(entityItem => {
              consolidatedObservations += `${entityItem.quantity} ${entityItem.productAdvertisingSpaceName} - ${entityItem.advertisingSpaceLocationTypeName}\n`;
              totalQuantity += entityItem.quantity;
              totalAmount += entityItem.total;
              totalTaxes += entityItem.totalTaxes || 0;
              consolidatedIds.push(entityItem.id);
            });
          } else if (cartItem.type === "ORDER") {
            consolidatedObservations += `${cartItem.quantity} ${cartItem.description}\n`;
            totalQuantity += cartItem.quantity || 1;
            totalAmount += cartItem.amount;
            totalTaxes += cartItem.totalTaxes || 0;
            consolidatedIds.push(cartItem.id);
          }
        });

        // Construir el item de factura consolidado
        invoiceData.items = [
          {
            xubioProductCode: consolidatedXubioProductCode,
            amount: totalAmount,
            totalTaxes: totalTaxes || 0,
            observations: consolidatedObservations.trim(),
            quantity: 1,
            price: totalAmount,
            consolidatedIds: consolidatedIds,
          },
        ];
      } else {
        // Modo separado: un item por cada entity item
        const items = [];

        cartItems.forEach(cartItem => {
          if (cartItem.type === "CONTRACT" && cartItem.entityItems) {
            cartItem.entityItems.forEach(entityItem => {
              items.push({
                id: entityItem.id,
                xubioProductCode: entityItem.xubioProductCode,
                amount: entityItem.total,
                totalTaxes: entityItem.totalTaxes || 0,
                observations: entityItem.observations,
                quantity: entityItem.quantity,
                price: entityItem.total / entityItem.quantity,
              });
            });
          } else if (cartItem.type === "ORDER") {
            items.push({
              id: cartItem.id,
              xubioProductCode: cartItem.xubioProductCode,
              amount: cartItem.amount,
              totalTaxes: cartItem.totalTaxes || 0,
              observations: cartItem.observations,
              quantity: cartItem.quantity || 1,
              price: cartItem.amount,
            });
          }
        });

        invoiceData.items = items;
      }

      dispatch(sendToXubioInit(invoiceData));
    }
  };

  // Funciones auxiliares para generar observaciones consolidadas (flujo original)
  const getConsolidatedObservations = () => {
    let observations = "";

    cartItems.forEach(cartItem => {
      if (cartItem.type === "CONTRACT" && cartItem.entityItems) {
        cartItem.entityItems.forEach(entityItem => {
          observations += `${entityItem.quantity} ${entityItem.productAdvertisingSpaceName} - ${entityItem.advertisingSpaceLocationTypeName}\n`;
        });
      } else if (cartItem.type === "ORDER") {
        observations += `${cartItem.quantity} ${cartItem.description}\n`;
      }
    });

    return observations.trim();
  };

  const getInvoiceTableData = () => {
    // Si hay un solo item, forzar modo separado
    const effectiveMode = totalItemsCount === 1 ? "separate" : invoiceMode;

    if (effectiveMode === "consolidated") {
      // Modo consolidado
      const xubioProduct = xubioProducts.find(
        p => (p.code || p.Code) === consolidatedXubioProductCode
      );
      return [
        {
          articulo:
            xubioProduct?.name ||
            xubioProduct?.Name ||
            "Seleccione un producto",
          observaciones: getConsolidatedObservations(),
          cantidad: 1,
          precio: cartTotal,
          currencyName: cartCurrency,
        },
      ];
    } else {
      // Modo separado
      const items = [];

      cartItems.forEach(cartItem => {
        if (cartItem.type === "CONTRACT" && cartItem.entityItems) {
          cartItem.entityItems.forEach(entityItem => {
            const xubioProduct = xubioProducts.find(
              p => (p.code || p.Code) === entityItem.xubioProductCode
            );
            items.push({
              articulo:
                xubioProduct?.name ||
                xubioProduct?.Name ||
                "Producto no especificado",
              observaciones: entityItem.observations || "-",
              cantidad: entityItem.quantity,
              precio: entityItem.total,
              currencyName: cartItem.currencyName,
            });
          });
        } else if (cartItem.type === "ORDER") {
          const xubioProduct = xubioProducts.find(
            p => (p.code || p.Code) === cartItem.xubioProductCode
          );
          items.push({
            articulo:
              xubioProduct?.name ||
              xubioProduct?.Name ||
              "Producto no especificado",
            observaciones: cartItem.observations || "-",
            cantidad: cartItem.quantity || 1,
            precio: cartItem.amount,
            currencyName: cartItem.currencyName,
          });
        }
      });

      return items;
    }
  };

  const getTotalAmount = () => {
    if (isEditionFlow) {
      return Object.values(groupedByClient).reduce(
        (total, clientGroup) => total + clientGroup.totals.amount,
        0
      );
    }
    return cartTotal;
  };

  const getTotalQuantity = () => {
    if (isEditionFlow) {
      return Object.values(groupedByClient).reduce(
        (total, clientGroup) => total + clientGroup.totals.quantity,
        0
      );
    }
    return totalItemsCount;
  };

  const invoiceTableData = getInvoiceTableData();

  if (!showDialog) {
    return null;
  }

  return (
    <Modal isOpen={showDialog} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        {isEditionFlow
          ? "Resumen de facturación por edición"
          : `Facturar a ${selectedClient?.brandName}`}
      </ModalHeader>
      <ModalBody>
        {isEditionFlow ? (
          // Vista para flujo de ediciones - agrupado por cliente
          <div>
            <div className="alert alert-info">
              <strong>Facturación por edición:</strong> Se generará una factura
              por cada cliente con todos sus elementos de la edición
              seleccionada.
            </div>

            {Object.values(groupedByClient).map(clientGroup => (
              <div
                key={`${clientGroup.clientId}_${clientGroup.clientName}`}
                className="card mb-3"
              >
                <div className="card-header">
                  <h6 className="mb-0">
                    <strong>{clientGroup.clientName}</strong>
                    <span className="badge bg-primary ms-2">
                      {clientGroup.items.length} elementos
                    </span>
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Precio Unit.</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientGroup.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.description || item.observations}</td>
                            <td>{item.quantity || 1}</td>
                            <td>
                              {formatCurrency(
                                item.price || 0,
                                cartCurrency || "$"
                              )}
                            </td>
                            <td>
                              {formatCurrency(
                                item.total || item.amount || 0,
                                cartCurrency || "$"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="table-light">
                          <th>Total Cliente</th>
                          <th>{clientGroup.totals.quantity}</th>
                          <th>-</th>
                          <th>
                            {formatCurrency(
                              clientGroup.totals.amount,
                              cartCurrency || "$"
                            )}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            ))}

            {/* Resumen general */}
            <div className="card bg-light">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <strong>Total de facturas a generar:</strong>
                    <div className="fs-4 text-primary">
                      {Object.keys(groupedByClient).length}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <strong>Total de elementos:</strong>
                    <div className="fs-4 text-info">{getTotalQuantity()}</div>
                  </div>
                  <div className="col-md-4">
                    <strong>Monto total:</strong>
                    <div className="fs-4 text-success">
                      {formatCurrency(getTotalAmount(), cartCurrency || "$")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vista original para contratos
          <div>
            {totalItemsCount > 1 && (
              <div className="form-group mb-4">
                <label>Modo de facturación:</label>
                <div className="d-flex">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="invoiceMode"
                      id="separate"
                      value="separate"
                      checked={invoiceMode === "separate"}
                      onChange={handleInvoiceModeChange}
                    />
                    <label className="form-check-label" htmlFor="separate">
                      Items separados
                    </label>
                  </div>
                  <div className="form-check ms-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="invoiceMode"
                      id="consolidated"
                      value="consolidated"
                      checked={invoiceMode === "consolidated"}
                      onChange={handleInvoiceModeChange}
                    />
                    <label className="form-check-label" htmlFor="consolidated">
                      Consolidado
                    </label>
                  </div>
                </div>
              </div>
            )}

            {invoiceMode === "consolidated" && totalItemsCount > 1 && (
              <div className="form-group mb-4">
                <InputSelectFieldSimple
                  labelText="Producto de Xubio para consolidar"
                  name="xubioProduct"
                  options={xubioProducts}
                  value={consolidatedXubioProductCode}
                  onChangeHandler={handleXubioProductChange}
                  getOptionLabel={option => option.name || option.Name}
                  getOptionValue={option => option.code || option.Code}
                  placeholderText="Seleccione un producto"
                />
              </div>
            )}

            <div className="row">
              <div className="col-md-12">
                <p>
                  <strong>Cliente:</strong> {selectedClient?.brandName} (
                  {clientType === "COMTUR" ? "COMTUR" : "Argentina"})
                </p>

                {cartCurrency && (
                  <p>
                    <strong>Moneda:</strong> {cartCurrency}
                  </p>
                )}

                <div className="table-responsive mt-3">
                  <table className="table table-sm table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "30%" }}>Artículo</th>
                        <th style={{ width: "40%" }}>Observaciones</th>
                        <th style={{ width: "10%" }} className="text-center">
                          Cantidad
                        </th>
                        <th style={{ width: "20%" }} className="text-end">
                          Precio
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceTableData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.articulo}</td>
                          <td>
                            {totalItemsCount > 1 &&
                            invoiceMode === "consolidated" ? (
                              <div
                                style={{
                                  whiteSpace: "pre-wrap",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {item.observaciones}
                              </div>
                            ) : (
                              item.observaciones
                            )}
                          </td>
                          <td className="text-center">{item.cantidad}</td>
                          <td className="text-end">
                            {formatCurrency(
                              item.precio,
                              item.currencyName || "$"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <th colSpan="3" className="text-end">
                          Total a facturar:
                        </th>
                        <th className="text-end">
                          {cartCurrency
                            ? formatCurrency(cartTotal, cartCurrency)
                            : formatCurrency(cartTotal, "$")}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observaciones globales - para ambos flujos */}
        <div className="form-group mt-4">
          <InputTextAreaFieldSimple
            labelText="Observaciones generales:"
            name="globalObservations"
            value={globalObservations}
            onChangeHandler={handleGlobalObservationsChange}
            placeholderText="Ingrese observaciones que se aplicarán a todas las facturas..."
            rows={3}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <DangerButton onClickHandler={handleClose} disabled={loading}>
          Cancelar
        </DangerButton>
        <SaveButton
          onClickHandler={handleSendToXubio}
          disabled={
            loading ||
            (!isEditionFlow &&
              invoiceMode === "consolidated" &&
              totalItemsCount > 1 &&
              !consolidatedXubioProductCode)
          }
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Procesando...
            </>
          ) : isEditionFlow ? (
            `Generar ${Object.keys(groupedByClient).length} facturas`
          ) : (
            "Enviar a Xubio"
          )}
        </SaveButton>
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceDialog;
