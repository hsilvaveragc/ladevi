import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { CONSTANTS } from "../constants";
import {
  removeFromCart,
  clearCart,
  showInvoiceDialog,
} from "../actionCreators";
import {
  getCartItems,
  getCartTotal,
  getLoading,
  getCurrentXubioProducts,
  getClientType,
} from "../reducer";
import { SaveButton, DangerButton } from "shared/components/Buttons";

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

const CartForEditions = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(getCartItems);
  const cartTotal = useSelector(getCartTotal);
  const loading = useSelector(getLoading);
  const xubioProducts = useSelector(getCurrentXubioProducts);
  const clientType = useSelector(getClientType);

  // Estado para controlar los grupos de clientes colapsados
  const [collapsedClients, setCollapsedClients] = useState({});

  // Estado para agrupar órdenes por cliente
  const [groupedByClient, setGroupedByClient] = useState({});

  // Agrupar items del carrito por cliente
  useEffect(() => {
    console.log("CartForEditions - Items del carrito:", cartItems);

    if (cartItems.length > 0) {
      const grouped = {};

      cartItems.forEach(item => {
        if (item.type === CONSTANTS.ORDER_CODE) {
          // Manejar diferentes nombres de campos para el nombre del cliente
          const clientName =
            item.clientName ||
            item.clientBrandName ||
            `Cliente ${item.clientId}`;
          const clientKey = `${item.clientId}_${clientName}`;

          console.log("CartForEditions - Procesando item:", {
            itemId: item.id,
            clientId: item.clientId,
            clientName: item.clientName,
            clientBrandName: item.clientBrandName,
            finalClientName: clientName,
            clientKey: clientKey,
          });

          if (!grouped[clientKey]) {
            grouped[clientKey] = {
              clientId: item.clientId,
              clientName: clientName,
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
        }
      });

      console.log("CartForEditions - Agrupación final:", grouped);
      setGroupedByClient(grouped);

      // Inicializar estado de colapso para nuevos clientes
      const initialCollapsed = {};
      Object.keys(grouped).forEach(clientKey => {
        initialCollapsed[clientKey] =
          collapsedClients[clientKey] !== undefined
            ? collapsedClients[clientKey]
            : false; // Por defecto expandido para ver las órdenes
      });
      setCollapsedClients(initialCollapsed);
    } else {
      setGroupedByClient({});
    }
  }, [cartItems]);

  const getCartCurrency = () => {
    return cartItems.length > 0 ? cartItems[0].currencyName : "$";
  };

  const handleRemoveItem = itemId => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleToggleClientCollapse = clientKey => {
    setCollapsedClients(prev => ({
      ...prev,
      [clientKey]: !prev[clientKey],
    }));
  };

  const handleRemoveClientOrders = clientKey => {
    const clientGroup = groupedByClient[clientKey];
    if (clientGroup) {
      clientGroup.items.forEach(item => {
        dispatch(removeFromCart(item.id));
      });
    }
  };

  const handleProceedToInvoice = () => {
    dispatch(showInvoiceDialog());
  };

  const getXubioProductName = xubioProductCode => {
    const product = xubioProducts.find(
      p => (p.code || p.Code) === xubioProductCode
    );
    return product ? product.name || product.Name : "Producto no especificado";
  };

  const cartCurrency = getCartCurrency();
  const clientGroups = Object.values(groupedByClient);
  const totalClients = clientGroups.length;

  return (
    <div
      className="card mb-4 sticky-top d-flex flex-column"
      style={{
        top: "1rem",
        height: "calc(100vh - 2rem)",
        position: "sticky",
      }}
    >
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Ordenes a facturar</h5>
        {clientType && (
          <small className="text-white-50">
            Cliente{" "}
            {clientType === CONSTANTS.COMTUR_CODE
              ? CONSTANTS.COMTUR_CODE
              : CONSTANTS.ARGENTINA_CODE}
          </small>
        )}
      </div>
      <div
        className="card-body d-flex flex-column"
        style={{ overflow: "hidden" }}
      >
        {cartItems.length === 0 ? (
          <p className="text-center text-muted flex-grow-1 d-flex align-items-center justify-content-center">
            No hay ítems
          </p>
        ) : (
          <div className="d-flex flex-column h-100">
            {/* Info de facturación por edición */}
            <div
              className="alert alert-info p-2 mb-2"
              style={{ fontSize: "0.85rem" }}
            >
              <strong>Facturación por edición:</strong>
              <br />
              {totalClients} cliente{totalClients !== 1 ? "s" : ""} ·{" "}
              {cartItems.length} órden{cartItems.length !== 1 ? "es" : ""}
              <br />
              <small>Se generará una factura por cliente</small>
            </div>

            <div
              className="cart-items mb-3 flex-grow-1"
              style={{ overflowY: "auto" }}
            >
              {clientGroups.map(clientGroup => {
                const clientKey = `${clientGroup.clientId}_${clientGroup.clientName}`;
                const isCollapsed = collapsedClients[clientKey];

                return (
                  <div key={clientKey} className="card mb-2">
                    <div className="card-body py-2 px-3">
                      <div className="d-flex flex-column">
                        {/* Cabecera del cliente */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div
                            className="d-flex align-items-center cursor-pointer"
                            onClick={() =>
                              handleToggleClientCollapse(clientKey)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <div className="mr-3">
                              {isCollapsed ? (
                                <FontAwesomeIcon icon={faAngleDown} />
                              ) : (
                                <FontAwesomeIcon icon={faAngleUp} />
                              )}
                            </div>
                            <div>
                              <h6 className="mb-0">{clientGroup.clientName}</h6>
                              <small className="text-muted">
                                {clientGroup.items.length} órden
                                {clientGroup.items.length !== 1 ? "es" : ""}
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="me-2 font-weight-bold mr-2">
                              {formatCurrency(
                                clientGroup.totals.amount,
                                cartCurrency
                              )}
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleRemoveClientOrders(clientKey)
                              }
                              disabled={loading}
                              title="Eliminar todas las órdenes de este cliente"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        {/* Listado de órdenes del cliente (expandible) */}
                        {!isCollapsed && (
                          <div className="mb-2">
                            {clientGroup.items.map(item => (
                              <div
                                key={item.id}
                                className="border-start border-3 ps-3 mb-2"
                              >
                                <div className="row align-items-start">
                                  <div className="col-7 pr-0">
                                    <small className="text-muted d-block">
                                      <strong>Contrato:</strong>{" "}
                                      {item.contractNumber}
                                    </small>
                                    <small className="text-muted d-block">
                                      <strong>Producto:</strong>{" "}
                                      {item.productName}
                                    </small>
                                    {item.productEditionName && (
                                      <small className="text-muted d-block">
                                        <strong>Edición:</strong>{" "}
                                        {item.productEditionName}
                                      </small>
                                    )}
                                    <small className="text-muted d-block">
                                      <strong>Espacio:</strong>{" "}
                                      {item.productAdvertisingSpaceName} -{" "}
                                      {item.advertisingSpaceLocationTypeName}
                                    </small>
                                    <small className="text-muted d-block">
                                      <strong>Cantidad:</strong> {item.quantity}
                                    </small>
                                    <small className="text-info">
                                      <strong>Producto Xubio</strong>{" "}
                                      {getXubioProductName(
                                        item.xubioProductCode
                                      )}
                                    </small>
                                  </div>
                                  <div className="col-5 text-end d-flex flex-column align-items-end justify-content-start">
                                    <div className="mb-2">
                                      <small className="text-muted mr-2">
                                        {formatCurrency(
                                          item.total || item.amount || 0,
                                          item.currencyName
                                        )}
                                      </small>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                          handleRemoveItem(item.id)
                                        }
                                        disabled={loading}
                                      >
                                        ×
                                      </button>
                                    </div>{" "}
                                  </div>
                                </div>
                                {item.observations && (
                                  <div className="row align-items-start">
                                    <div className="col-12 pr-0">
                                      <small className="text-secondary d-block">
                                        <strong>Observaciones:</strong>{" "}
                                        {item.observations}
                                      </small>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-top pt-3 mt-auto">
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5>{formatCurrency(cartTotal, cartCurrency)}</h5>
              </div>

              <div className="d-flex justify-content-between">
                <DangerButton
                  onClickHandler={handleClearCart}
                  disabled={loading}
                >
                  Vaciar
                </DangerButton>
                <SaveButton
                  onClickHandler={handleProceedToInvoice}
                  disabled={loading || cartItems.length === 0}
                >
                  Facturar
                </SaveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartForEditions;
