import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  hideContractDialog,
  addToCart,
  updateCartItem,
} from "../actionCreators";
import {
  getShowContractDialog,
  getSelectedContract,
  getCurrentXubioProducts,
  getLoading,
  getCartItems,
  getContractDialogEditMode,
  getClientType,
} from "../reducer";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import InputTextAreaFieldSimple from "shared/components/InputTextAreaFieldSimple";
import InputCheckboxFieldSimple from "shared/components/InputCheckboxFieldSimple";

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

const ContractDialog = () => {
  const dispatch = useDispatch();
  const showDialog = useSelector(getShowContractDialog);
  const selectedContract = useSelector(getSelectedContract);
  const xubioProducts = useSelector(getCurrentXubioProducts);
  const loading = useSelector(getLoading);
  const cartItems = useSelector(getCartItems);
  const isEditMode = useSelector(getContractDialogEditMode);
  const clientType = useSelector(getClientType);

  const [contractItems, setContractItems] = useState([]);
  const [selectedContractItems, setSelectedContractItems] = useState([]);
  const [itemXubioProducts, setItemXubioProducts] = useState({}); // Producto Xubio por cada item
  const [itemObservations, setItemObservations] = useState({}); // Observaciones por cada item
  const [selectAll, setSelectAll] = useState(false);

  // Actualizar los ítems seleccionados y otros datos cuando se abre el diálogo
  useEffect(() => {
    if (showDialog && selectedContract) {
      // Asegurarse de que soldSpaces es un array
      const soldSpacesArray = selectedContract.soldSpaces || [];
      setContractItems(soldSpacesArray);

      // Buscar si ya existe un ítem de este contrato en el carrito
      const existingCartItem = cartItems.find(
        item => item.type === "CONTRACT" && item.id === selectedContract.id
      );

      if (existingCartItem && isEditMode) {
        // Si el contrato ya está en el carrito y estamos en modo edición, cargar los ítems seleccionados
        const selectedIds = existingCartItem.entityItems
          ? existingCartItem.entityItems.map(item => item.id)
          : [];
        setSelectedContractItems(selectedIds);

        // Cargar los productos Xubio y observaciones existentes para cada item
        const existingXubioProducts = {};
        const existingObservations = {};
        if (existingCartItem.entityItems) {
          existingCartItem.entityItems.forEach(item => {
            existingXubioProducts[item.id] = item.xubioProductId || "";
            existingObservations[item.id] = item.observations || "";
          });
        }
        setItemXubioProducts(existingXubioProducts);
        setItemObservations(existingObservations);

        // No seleccionar todo en modo edición, sólo los ítems existentes
        setSelectAll(false);
      } else {
        // Si es un nuevo ítem, inicializar con los códigos Xubio predeterminados
        const defaultXubioProducts = {};

        // Usar el código correcto según el tipo de cliente
        const defaultXubioCode =
          clientType === "COMTUR"
            ? selectedContract.comturXubioProductCode
            : selectedContract.xubioProductCode;

        if (defaultXubioCode) {
          soldSpacesArray.forEach(item => {
            defaultXubioProducts[item.id] = defaultXubioCode;
          });
        }
        setSelectedContractItems([]);
        setItemXubioProducts(defaultXubioProducts);
        setItemObservations({});
        setSelectAll(false);
      }
    }
  }, [showDialog, selectedContract, cartItems, isEditMode, clientType]);

  const handleClose = () => {
    dispatch(hideContractDialog());
  };

  const handleSelectItem = itemId => {
    if (selectedContractItems.includes(itemId)) {
      setSelectedContractItems(
        selectedContractItems.filter(id => id !== itemId)
      );
      // Limpiar el producto Xubio y observaciones cuando se deselecciona un item
      const updatedXubioProducts = { ...itemXubioProducts };
      const updatedObservations = { ...itemObservations };
      delete updatedXubioProducts[itemId];
      delete updatedObservations[itemId];
      setItemXubioProducts(updatedXubioProducts);
      setItemObservations(updatedObservations);
    } else {
      setSelectedContractItems([...selectedContractItems, itemId]);

      // Si el item tiene un xubioProductCode predefinido y no hay valor actual, establecerlo
      const contractItem = contractItems.find(item => item.id === itemId);
      if (contractItem && !itemXubioProducts[itemId]) {
        // Usar el código correcto según el tipo de cliente
        const defaultXubioCode =
          clientType === "COMTUR"
            ? contractItem.comturXubioProductCode ||
              selectedContract.comturXubioProductCode
            : contractItem.xubioProductCode ||
              selectedContract.xubioProductCode;

        if (defaultXubioCode) {
          setItemXubioProducts({
            ...itemXubioProducts,
            [itemId]: defaultXubioCode,
          });
        }
      }
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContractItems([]);
      setItemXubioProducts({});
      setItemObservations({});
    } else {
      // Seleccionar todos los ítems no facturados
      const nonBilledItems = contractItems.filter(item => !item.billed);
      setSelectedContractItems(nonBilledItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleItemXubioProductChange = (itemId, product) => {
    setItemXubioProducts({
      ...itemXubioProducts,
      [itemId]: product.code || product.Code,
    });
  };

  const handleItemObservationChange = (itemId, value) => {
    setItemObservations({
      ...itemObservations,
      [itemId]: value,
    });
  };

  const handleAddToCart = () => {
    if (selectedContractItems.length === 0) {
      return;
    }

    // Verificar que todos los items seleccionados tengan un producto Xubio
    const missingXubioProducts = selectedContractItems.filter(
      itemId => !itemXubioProducts[itemId]
    );

    if (missingXubioProducts.length > 0) {
      alert("Debe asignar un producto Xubio a cada item seleccionado");
      return;
    }

    // Crear un array con los ítems seleccionados, incluyendo su producto Xubio y observaciones
    const newEntityItems = selectedContractItems.map(itemId => {
      const contractItem = contractItems.find(item => item.id === itemId);
      return {
        id: itemId,
        productAdvertisingSpaceName: contractItem.productAdvertisingSpaceName,
        advertisingSpaceLocationTypeName:
          contractItem.advertisingSpaceLocationTypeName,
        quantity: contractItem.quantity,
        total: contractItem.total,
        totalTaxes: contractItem.totalTaxes || 0, // Incluir total de impuestos si exist
        xubioProductId: itemXubioProducts[itemId], // Producto Xubio específico para este item
        observations:
          itemObservations[itemId] ||
          `${contractItem.productAdvertisingSpaceName} - ${contractItem.advertisingSpaceLocationTypeName}`, // Observaciones específicas para este item
      };
    });

    // Calcular el total de los items seleccionados
    const amount = newEntityItems.reduce(
      (total, item) => total + item.total,
      0
    );

    const totalTaxes = newEntityItems.reduce(
      (totalTaxes, item) => totalTaxes + (item.totalTaxes || 0),
      0
    );

    // Buscar si ya existe un ítem de este contrato en el carrito
    const existingCartItemIndex = cartItems.findIndex(
      item => item.type === "CONTRACT" && item.id === selectedContract.id
    );

    if (existingCartItemIndex !== -1 && isEditMode) {
      // Si el contrato ya existe en el carrito y estamos en modo edición
      const existingItem = cartItems[existingCartItemIndex];

      // Crear el ítem actualizado manteniendo todas las propiedades originales
      const updatedCartItem = {
        ...existingItem,
        amount: amount,
        amountTaxes: totalTaxes,
        entityItems: newEntityItems,
      };

      // Usar el action creator para actualizar el ítem directamente
      dispatch(updateCartItem(existingItem.id, updatedCartItem));
    } else {
      // Si no existe o no estamos en modo edición, crear un nuevo ítem en el carrito
      const cartItem = {
        id: selectedContract.id,
        type: "CONTRACT",
        description: `Contrato #${selectedContract.number ||
          ""} - ${selectedContract.name || ""}`,
        number: selectedContract.number || "",
        name: selectedContract.name || "",
        amount,
        entityItems: newEntityItems,
        currencyName: selectedContract.currencyName || "$",
      };

      dispatch(addToCart(cartItem));
    }

    dispatch(hideContractDialog());
  };

  const getXubioProductName = xubioProductId => {
    const product = xubioProducts.find(
      p => (p.code || p.Code) === xubioProductId
    );
    return product ? product.name || product.Name : "Producto no especificado";
  };

  if (!showDialog || !selectedContract) {
    return null;
  }

  return (
    <Modal isOpen={showDialog} toggle={handleClose} size="xl">
      <ModalHeader toggle={handleClose}>
        {isEditMode
          ? `Editar items del contrato #${selectedContract.number ||
              ""} - ${selectedContract.name || ""}`
          : `Agregar items del contrato #${selectedContract.number ||
              ""} - ${selectedContract.name || ""}`}
      </ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              Seleccione los items a facturar y asigne un producto Xubio{" "}
              {clientType === "COMTUR" ? "COMTUR" : "Argentina"} a cada uno
            </h6>
            <InputCheckboxFieldSimple
              name="selectAll"
              labelText="Seleccionar todos"
              checked={selectAll}
              onChangeHandler={handleSelectAll}
            />
          </div>
          <div
            className="items-list"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {contractItems && contractItems.length > 0 ? (
              contractItems.map(item => (
                <div key={item.id} className="card mb-2">
                  <div className="card-body py-1 px-3">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <input
                          className="form-check-input mt-3 ml-2"
                          type="checkbox"
                          id={`item-${item.id}`}
                          checked={selectedContractItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          disabled={item.billed}
                          style={{ marginTop: "0" }}
                        />
                        <label
                          className="form-check-label mb-0 ml-5 d-block"
                          htmlFor={`item-${item.id}`}
                          style={{
                            cursor: item.billed ? "default" : "pointer",
                            marginLeft: "25px",
                          }}
                        >
                          <div>
                            <strong>{item.quantity}</strong>{" "}
                            {item.productAdvertisingSpaceName}
                          </div>
                          <small className="text-muted">
                            {item.advertisingSpaceLocationTypeName}
                          </small>
                        </label>
                      </div>
                      <div className="col-md-2 text-end">
                        <div className="fw-bold">
                          {formatCurrency(
                            item.total,
                            selectedContract.currencyName || "$"
                          )}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <InputSelectFieldSimple
                          name={`xubio-${item.id}`}
                          options={xubioProducts}
                          value={itemXubioProducts[item.id] || ""}
                          onChangeHandler={product =>
                            handleItemXubioProductChange(item.id, product)
                          }
                          disabled={
                            loading || !selectedContractItems.includes(item.id)
                          }
                          getOptionValue={option => option.code || option.Code}
                          getOptionLabel={option => option.name || option.Name}
                          placeholder={`Producto Xubio ${
                            clientType === "COMTUR" ? "COMTUR" : "Argentina"
                          }...`}
                          isSmall={true}
                          showLabel={false}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputTextAreaFieldSimple
                          value={itemObservations[item.id] || ""}
                          onChangeHandler={e =>
                            handleItemObservationChange(item.id, e.target.value)
                          }
                          multiline={true}
                          rows={2}
                          placeholder="Observaciones..."
                          disabled={
                            loading || !selectedContractItems.includes(item.id)
                          }
                          showLabel={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">
                No hay espacios disponibles para este contrato
              </div>
            )}
          </div>
        </div>

        {selectedContractItems.length > 0 && (
          <div className="alert alert-info">
            <strong>Items seleccionados:</strong> {selectedContractItems.length}
            <br />
            <strong>Total:</strong>{" "}
            {formatCurrency(
              selectedContractItems.reduce((total, itemId) => {
                const item = contractItems.find(i => i.id === itemId);
                return total + (item ? item.total : 0);
              }, 0),
              selectedContract.currencyName || "$"
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <DangerButton onClickHandler={handleClose} disabled={loading}>
          Cancelar
        </DangerButton>
        <SaveButton
          onClickHandler={handleAddToCart}
          disabled={
            loading ||
            selectedContractItems.length === 0 ||
            selectedContractItems.some(itemId => !itemXubioProducts[itemId])
          }
        >
          {isEditMode ? "Actualizar items" : "Agregar items"}
        </SaveButton>
      </ModalFooter>
    </Modal>
  );
};

export default ContractDialog;
