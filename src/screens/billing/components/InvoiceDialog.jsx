import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { hideInvoiceDialog, sendToXubioInit } from "../actionCreators";
import {
  getShowInvoiceDialog,
  getCartItems,
  getCurrentXubioProducts,
  getLoading,
  getSelectedClient,
  getCartTotal,
  getClientType,
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

  const [invoiceMode, setInvoiceMode] = useState("separate");
  const [consolidatedXubioProductId, setConsolidatedXubioProductId] = useState(
    ""
  );
  const [globalObservations, setGlobalObservations] = useState("");

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
      setConsolidatedXubioProductId("");
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
    setConsolidatedXubioProductId(product.code || product.Code);
  };

  const handleGlobalObservationsChange = e => {
    setGlobalObservations(e.target.value);
  };

  const handleSendToXubio = () => {
    // Validar datos
    if (
      invoiceMode === "consolidated" &&
      totalItemsCount > 1 &&
      !consolidatedXubioProductId
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
            totalTaxes += entityItem.totalTaxes || 0; // Incluir impuestos si existen
            consolidatedIds.push(entityItem.id);
          });
        } else if (cartItem.type === "ORDER") {
          consolidatedObservations += `${cartItem.quantity} ${cartItem.description}\n`;
          totalQuantity += cartItem.quantity || 1;
          totalAmount += cartItem.amount;
          totalTaxes += cartItem.totalTaxes || 0; // Incluir impuestos si existen
          consolidatedIds.push(cartItem.id);
        }
      });

      // Construir el item de factura consolidado
      invoiceData.items = [
        {
          xubioProductId: consolidatedXubioProductId,
          amount: totalAmount,
          totalTaxes: totalTaxes || 0,
          observations: consolidatedObservations.trim(),
          // Para consolidado, usamos un ID genérico y sumamos las cantidades
          id: 0,
          quantity: totalQuantity,
          price: totalAmount / totalQuantity,
          // Agregar array de IDs consolidados
          consolidatedIds: consolidatedIds,
        },
      ];
    } else {
      // Modo separado: cada item se convierte en un item de factura
      invoiceData.items = [];

      cartItems.forEach(cartItem => {
        if (cartItem.type === "CONTRACT") {
          // Para contratos, cada entityItem se convierte en un item de factura separado
          if (cartItem.entityItems) {
            cartItem.entityItems.forEach(entityItem => {
              invoiceData.items.push({
                xubioProductId: entityItem.xubioProductId,
                amount: entityItem.total,
                totalTaxes: entityItem.totalTaxes || 0, // Incluir impuestos si existen
                observations: entityItem.observations || "",
                id: entityItem.id,
                quantity: entityItem.quantity,
                price: entityItem.total / entityItem.quantity,
              });
            });
          }
        } else {
          // Para órdenes, mantener la misma estructura
          invoiceData.items.push({
            xubioProductId: cartItem.xubioProductId,
            amount: cartItem.amount,
            observations: cartItem.observations || "",
            id: cartItem.id,
            quantity: cartItem.quantity || 1,
            price: cartItem.amount / (cartItem.quantity || 1),
          });
        }
      });
    }

    dispatch(sendToXubioInit(invoiceData));
    dispatch(hideInvoiceDialog());
  };

  // Función para obtener las observaciones consolidadas
  const getConsolidatedObservations = () => {
    // Crear un mapa para agrupar los items
    const groupedMap = new Map();

    cartItems.forEach(cartItem => {
      if (cartItem.type === "CONTRACT" && cartItem.entityItems) {
        cartItem.entityItems.forEach(entityItem => {
          // Crear una clave única para cada combinación de espacio y ubicación
          const key = `${entityItem.productAdvertisingSpaceName}|${entityItem.advertisingSpaceLocationTypeName}`;

          if (groupedMap.has(key)) {
            // Si ya existe, sumar la cantidad
            const existing = groupedMap.get(key);
            existing.quantity += entityItem.quantity;
          } else {
            // Si no existe, crear nueva entrada
            groupedMap.set(key, {
              productAdvertisingSpaceName:
                entityItem.productAdvertisingSpaceName,
              advertisingSpaceLocationTypeName:
                entityItem.advertisingSpaceLocationTypeName,
              quantity: entityItem.quantity,
            });
          }
        });
      } else if (cartItem.type === "ORDER") {
        // Para órdenes, usar descripción como clave
        const key = cartItem.description;

        if (groupedMap.has(key)) {
          const existing = groupedMap.get(key);
          existing.quantity += cartItem.quantity || 1;
        } else {
          groupedMap.set(key, {
            description: cartItem.description,
            quantity: cartItem.quantity || 1,
          });
        }
      }
    });

    // Convertir el mapa a string de observaciones
    let observations = "";
    groupedMap.forEach(item => {
      if (item.description) {
        // Es una orden
        observations += `${item.quantity} ${item.description}\n`;
      } else {
        // Es un item de contrato
        observations += `${item.quantity} ${item.productAdvertisingSpaceName} - ${item.advertisingSpaceLocationTypeName}\n`;
      }
    });

    return observations.trim();
  };

  // Función para obtener los items de factura según el modo
  const getInvoiceTableData = () => {
    // Si hay un solo item, siempre usar modo separado
    const effectiveMode = totalItemsCount === 1 ? "separate" : invoiceMode;

    if (effectiveMode === "consolidated") {
      // Modo consolidado
      const xubioProduct = xubioProducts.find(
        p => (p.code || p.Code) === consolidatedXubioProductId
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
              p => (p.code || p.Code) === entityItem.xubioProductId
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
            p => (p.code || p.Code) === cartItem.xubioProductId
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

  const invoiceTableData = getInvoiceTableData();

  if (!showDialog) {
    return null;
  }

  return (
    <Modal isOpen={showDialog} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        Facturar a {selectedClient?.brandName}
      </ModalHeader>
      <ModalBody>
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
                  Facturar espacios por separado
                </label>
              </div>
              <div className="form-check ml-5">
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
                  Facturar todo junto (consolidado)
                </label>
              </div>
            </div>
          </div>
        )}

        {invoiceMode === "consolidated" && totalItemsCount > 1 && (
          <div className="form-group mb-3">
            <InputSelectFieldSimple
              labelText={`Producto de Xubio ${
                clientType === "COMTUR" ? "COMTUR" : "Argentina"
              } para factura consolidada *`}
              name="consolidatedXubioProductId"
              options={xubioProducts}
              value={consolidatedXubioProductId}
              onChangeHandler={handleXubioProductChange}
              disabled={loading}
              getOptionValue={option => option.code || option.Code}
              getOptionLabel={option => option.name || option.Name}
              error={
                !consolidatedXubioProductId
                  ? "Debe seleccionar un producto"
                  : ""
              }
            />
          </div>
        )}

        <div className="form-group mb-4">
          <InputTextAreaFieldSimple
            labelText="Observaciones globales de la factura"
            name="globalObservations"
            value={globalObservations}
            onChangeHandler={handleGlobalObservationsChange}
            rows={3}
          />
        </div>

        <div className="card mb-3">
          <div className="card-header">
            <h6 className="mb-0">Resumen de items a facturar</h6>
          </div>
          <div className="card-body">
            <p>
              <strong>Cliente:</strong> {selectedClient?.brandName} (
              {selectedClient?.legalName})
            </p>
            <p>
              <strong>Tipo de cliente:</strong>{" "}
              {clientType === "COMTUR" ? "COMTUR" : "Argentina"}
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
                        {formatCurrency(item.precio, item.currencyName || "$")}
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
      </ModalBody>
      <ModalFooter>
        <DangerButton onClickHandler={handleClose} disabled={loading}>
          Cancelar
        </DangerButton>
        <SaveButton
          onClickHandler={handleSendToXubio}
          disabled={
            loading ||
            (invoiceMode === "consolidated" &&
              totalItemsCount > 1 &&
              !consolidatedXubioProductId)
          }
        >
          Enviar a Xubio
        </SaveButton>
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceDialog;
