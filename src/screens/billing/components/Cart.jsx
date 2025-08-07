import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
  removeFromCart,
  clearCart,
  showInvoiceDialog,
  showContractDialogForEdit,
  showOrderDialog,
} from "../actionCreators";
import {
  getCartItems,
  getCartTotal,
  getLoading,
  getCurrentXubioProducts,
  getContracts,
  getOrders,
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

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(getCartItems);
  const cartTotal = useSelector(getCartTotal);
  const loading = useSelector(getLoading);
  const xubioProducts = useSelector(getCurrentXubioProducts);
  const contracts = useSelector(getContracts);
  const orders = useSelector(getOrders);
  const clientType = useSelector(getClientType);

  // Estado para controlar los items colapsados
  const [collapsedItems, setCollapsedItems] = useState({});

  // Inicializa el estado cuando cambian los ítems del carrito
  useEffect(() => {
    const initialCollapsed = {};

    cartItems.forEach(item => {
      initialCollapsed[item.id] =
        collapsedItems[item.id] !== undefined ? collapsedItems[item.id] : true;
    });

    setCollapsedItems(initialCollapsed);
  }, [cartItems.length]);

  const getCartCurrency = () => {
    return cartItems.length > 0 ? cartItems[0].currencyName : "$";
  };

  const handleRemoveItem = itemId => {
    dispatch(removeFromCart(itemId));
  };

  const handleEditItem = item => {
    if (item.type === "CONTRACT") {
      // Buscar el contrato correspondiente al item del carrito
      const contract = contracts.find(c => c.id === item.id);

      if (contract) {
        // Si el contrato existe en el store, abrir el diálogo en modo edición
        dispatch(showContractDialogForEdit(contract, true));
      } else if (item.id) {
        // Si no se encuentra en el store, creamos un objeto con la información del item del carrito
        const contractData = {
          id: item.id,
          number: item.number || "",
          name: item.name || item.description || "",
          soldSpaces: item.entityItems
            ? item.entityItems.map(entity => ({
                id: entity.id,
                productAdvertisingSpaceName: entity.productAdvertisingSpaceName,
                advertisingSpaceLocationTypeName:
                  entity.advertisingSpaceLocationTypeName,
                quantity: entity.quantity,
                total: entity.total,
                billed: false,
              }))
            : [],
          currencyName: item.currencyName,
        };

        // Abrir el diálogo con los datos reconstruidos
        dispatch(showContractDialogForEdit(contractData, true));
      }
    } else if (item.type === "ORDER") {
      // Buscar la orden correspondiente al item del carrito
      const order = orders.find(o => o.id === item.id);

      if (order) {
        dispatch(showOrderDialog(order, true));
      } else if (item.id) {
        const orderData = {
          id: item.id,
          contractNumber: item.contract
            ? item.contract.split(" - ")[0].replace("#", "")
            : "",
          contracName: item.contract ? item.contract.split(" - ")[1] : "",
          productName: item.productName || "",
          productAdvertisingSpaceName:
            item.description.split(" - ")[0].split(" ")[1] || "",
          advertisingSpaceLocationTypeName:
            item.description.split(" - ")[1] || "",
          quantity: item.quantity || 0,
          total: item.amount || 0,
          currencyName: item.currencyName,
        };
        dispatch(showOrderDialog(orderData, true));
      }
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleProceedToInvoice = () => {
    dispatch(showInvoiceDialog());
  };

  const toggleCollapse = itemId => {
    setCollapsedItems({
      ...collapsedItems,
      [itemId]: !collapsedItems[itemId],
    });
  };

  const getXubioProductName = xubioProductCode => {
    const product = xubioProducts.find(
      p => (p.code || p.Code) === xubioProductCode
    );
    return product ? product.name || product.Name : "Producto no especificado";
  };

  const cartCurrency = getCartCurrency();

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
        <h5 className="mb-0">Items a facturar</h5>
        {clientType && (
          <small className="text-white-50">
            Cliente {clientType === "COMTUR" ? "COMTUR" : "Argentina"}
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
            <div
              className="cart-items mb-3 flex-grow-1"
              style={{ overflowY: "auto" }}
            >
              {cartItems.map(item => (
                <div key={item.id} className="card mb-2">
                  <div className="card-body py-2 px-3">
                    <div className="d-flex flex-column">
                      {/* Cabecera */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <h6 className="mb-0">{item.description}</h6>
                        </div>
                        <div className="font-weight-bold">
                          {formatCurrency(
                            item.amount,
                            item.currencyName || "$"
                          )}
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="mb-1">
                        {item.type === "ORDER" && (
                          <>
                            <small className="text-muted d-block">
                              <strong>Cantidad:</strong> {item.quantity}
                            </small>
                            <small className="text-muted d-block">
                              <strong>Contrato:</strong> {item.contract}
                            </small>
                            <small className="text-muted d-block">
                              <strong>Producto:</strong> {item.productName}
                            </small>
                            <small className="text-muted d-block">
                              <strong>
                                Producto Xubio{" "}
                                {clientType === "COMTUR"
                                  ? "COMTUR"
                                  : "Argentina"}
                                :
                              </strong>{" "}
                              {getXubioProductName(item.xubioProductCode)}
                            </small>
                          </>
                        )}

                        {item.type === "CONTRACT" && (
                          <small className="text-muted d-block">
                            <strong>Items seleccionados:</strong>{" "}
                            {item.entityItems ? item.entityItems.length : 0}
                          </small>
                        )}

                        {item.observations && (
                          <small className="text-muted d-block">
                            <strong>Observaciones:</strong> {item.observations}
                          </small>
                        )}

                        {/* Detalles colapsables para contratos */}
                        {item.entityItems && item.entityItems.length > 0 && (
                          <div
                            className="d-flex justify-content-between align-items-center mt-2"
                            onClick={() => toggleCollapse(item.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div>
                              <small className="text-muted">
                                <strong>Ver detalles</strong> (
                                {item.entityItems.reduce(
                                  (total, i) => total + i.quantity,
                                  0
                                )}{" "}
                                espacios de venta)
                              </small>
                            </div>
                            <div>
                              <i>
                                {collapsedItems[item.id] ? (
                                  <FontAwesomeIcon icon={faAngleDown} />
                                ) : (
                                  <FontAwesomeIcon icon={faAngleUp} />
                                )}
                              </i>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Listado de items expandido */}
                      {!collapsedItems[item.id] &&
                        item.entityItems &&
                        item.entityItems.length > 0 && (
                          <div className="mb-2">
                            {item.entityItems.map((entityItem, index) => (
                              <div
                                key={`${item.id}-entity-${entityItem.id}-${index}`}
                                className="border-start border-3 ps-3 mb-2"
                              >
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <small className="text-muted">
                                      {`${entityItem.quantity} ${entityItem.productAdvertisingSpaceName} - ${entityItem.advertisingSpaceLocationTypeName}`}
                                    </small>
                                    <br />
                                    <small className="text-info">
                                      <strong>
                                        Xubio{" "}
                                        {clientType === "COMTUR"
                                          ? "COMTUR"
                                          : "Argentina"}
                                        :
                                      </strong>{" "}
                                      {getXubioProductName(
                                        entityItem.xubioProductCode
                                      )}
                                    </small>
                                    {entityItem.observations && (
                                      <>
                                        <br />
                                        <small className="text-secondary">
                                          <strong>Observaciones:</strong>{" "}
                                          {entityItem.observations}
                                        </small>
                                      </>
                                    )}
                                  </div>
                                  <div>
                                    <small className="text-muted">
                                      {formatCurrency(
                                        entityItem.total,
                                        item.currencyName || "$"
                                      )}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Botones de acción */}
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2 mx-2"
                          onClick={() => handleEditItem(item)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export default Cart;
