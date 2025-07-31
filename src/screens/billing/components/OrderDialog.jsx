import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "shared/utils/extensionsMethods.js";
import { hideOrderDialog, addToCart, updateCartItem } from "../actionCreators";
import {
  getShowOrderDialog,
  getSelectedOrder,
  getCurrentXubioProducts,
  getLoading,
  getCartItems,
  getClientType,
} from "../reducer";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import InputTextAreaFieldSimple from "shared/components/InputTextAreaFieldSimple";

// Función para formatear números con punto como separador de miles y coma decimal
const formatCurrency = (amount, currencySymbol) => {
  // Usar Intl.NumberFormat pero con configuración específica
  return (
    currencySymbol +
    " " +
    new Intl.NumberFormat("es-AR", {
      style: "decimal", // Sin símbolo de moneda
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  );
};

const OrderDialog = () => {
  const dispatch = useDispatch();
  const showDialog = useSelector(getShowOrderDialog);
  const selectedOrder = useSelector(getSelectedOrder);
  const xubioProducts = useSelector(getCurrentXubioProducts);
  const loading = useSelector(getLoading);
  const cartItems = useSelector(getCartItems);
  const clientType = useSelector(getClientType);

  const [xubioProductId, setXubioProductId] = useState("");
  const [observations, setObservations] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Determinar si la orden ya está en el carrito y configurar el modo edición
  useEffect(() => {
    if (showDialog && selectedOrder) {
      // Buscar si ya existe un ítem de esta orden en el carrito
      const existingCartItem = cartItems.find(
        item => item.type === "ORDER" && item.id === selectedOrder.id
      );

      if (existingCartItem) {
        // Si la orden ya está en el carrito, cargamos sus datos y activamos el modo edición
        setXubioProductId(existingCartItem.xubioProductId || "");
        setObservations(existingCartItem.observations || "");
        setIsEditMode(true);
      } else {
        // Usar el código correcto según el tipo de cliente
        const defaultXubioCode =
          clientType === "COMTUR"
            ? selectedOrder.comturXubioProductCode
            : selectedOrder.xubioProductCode;
        // Si es un nuevo ítem, reiniciar valores
        setXubioProductId(defaultXubioCode || "");
        setObservations("");
        setIsEditMode(false);
      }
    }
  }, [showDialog, selectedOrder, cartItems]);

  const handleClose = () => {
    dispatch(hideOrderDialog());
  };

  const handleXubioProductChange = product => {
    setXubioProductId(product.code || product.Code);
  };

  const handleObservationsChange = e => {
    setObservations(e.target.value);
  };

  const handleAddOrUpdateCart = () => {
    if (!xubioProductId) {
      return;
    }

    // Buscar si ya existe un ítem de esta orden en el carrito
    const existingCartItemIndex = cartItems.findIndex(
      item => item.type === "ORDER" && item.id === selectedOrder.id
    );

    if (existingCartItemIndex !== -1 && isEditMode) {
      // Si la orden ya existe en el carrito y estamos en modo edición
      const existingItem = cartItems[existingCartItemIndex];

      // Crear el ítem actualizado manteniendo la mayoría de las propiedades originales
      const updatedCartItem = {
        ...existingItem,
        xubioProductId: xubioProductId,
        observations: observations,
      };

      // Usar el action creator para actualizar el ítem directamente
      dispatch(updateCartItem(existingItem.id, updatedCartItem));
    } else {
      // Si no existe o no estamos en modo edición, crear un nuevo ítem en el carrito
      const cartItem = {
        id: selectedOrder.id, // ID único para el carrito
        type: "ORDER",
        description: `Orden ${selectedOrder.productEditionName ||
          ""} - ${selectedOrder.productAdvertisingSpaceName ||
          ""}, ${selectedOrder.advertisingSpaceLocationTypeName || ""}`,
        amount: selectedOrder.total || 0,
        totalTaxes: selectedOrder.totalTaxes || 0,
        xubioProductId,
        observations,
        quantity: selectedOrder.quantity || 0,
        contract: `#${selectedOrder.contractNumber ||
          ""} - ${selectedOrder.contracName || ""}`,
        productName: selectedOrder.productName || "",
        currencyName: selectedOrder.currencyName || "$", // Asegurarse de guardar la moneda
      };

      dispatch(addToCart(cartItem));
    }

    dispatch(hideOrderDialog());
  };

  if (!showDialog || !selectedOrder) {
    return null;
  }

  return (
    <Modal isOpen={showDialog} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        {isEditMode
          ? "Editar orden de publicación"
          : "Agregar orden de publicación"}
      </ModalHeader>
      <ModalBody>
        <div className="card mb-3">
          <div className="card-header">
            <h6 className="mb-0">Detalles de la orden</h6>
          </div>
          <div className="card-body">
            <p>
              <strong>Contrato:</strong>
              {" #"}
              {selectedOrder.contractNumber} {selectedOrder.contracName}
            </p>
            <p>
              <strong>Producto:</strong>
              {selectedOrder.productName}
            </p>
            <p>
              <strong>Edición:</strong> {selectedOrder.productEditionName}
            </p>
            <p>
              <strong>Espacio:</strong>{" "}
              {selectedOrder.productAdvertisingSpaceName} {" - "}
              {selectedOrder.advertisingSpaceLocationTypeName}
            </p>
            <p>
              <strong>Cantidad:</strong> {selectedOrder.quantity}
            </p>
            <p>
              <strong>Monto:</strong>{" "}
              {formatCurrency(
                selectedOrder.total || 0,
                selectedOrder.currencyName || "$"
              )}
            </p>
          </div>
        </div>

        <div className="form-group">
          <InputSelectFieldSimple
            labelText={`Producto de Xubio ${
              clientType === "COMTUR" ? "COMTUR" : "Argentina"
            } *`}
            name="xubioProductCode"
            options={xubioProducts}
            value={xubioProductId}
            getOptionValue={option => option.code || option.Code}
            getOptionLabel={option => option.name || option.Name}
            onChangeHandler={handleXubioProductChange}
            disabled={loading}
            error={!xubioProductId ? "Debe seleccionar un producto" : ""}
          />
        </div>

        <div className="form-group">
          <InputTextAreaFieldSimple
            labelText="Observaciones"
            name="observations"
            value={observations}
            onChangeHandler={handleObservationsChange}
            multiline={true}
            rows={3}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <DangerButton onClickHandler={handleClose} disabled={loading}>
          Cancelar
        </DangerButton>
        <SaveButton
          onClickHandler={handleAddOrUpdateCart}
          disabled={loading || !xubioProductId}
        >
          {isEditMode ? "Actualizar" : "Agregar al carrito"}
        </SaveButton>
      </ModalFooter>
    </Modal>
  );
};

export default OrderDialog;
