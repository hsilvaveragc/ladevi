import {
  SET_CLIENT_TYPE,
  SET_SELECTED_CURRENCY,
  FETCH_PRODUCTS_INIT,
  FETCH_EDITIONS_INIT,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_EDITION,
  FETCH_PRODUCTION_ITEMS_INIT,
  MOVE_ITEM_INIT,
  ADD_SLOT_INIT,
  REMOVE_SLOT_INIT,
  UPDATE_OBSERVATION_INIT,
  MARK_AS_EDITORIAL_INIT,
  MARK_AS_CA_INIT,
  GENERATE_AUTO_LAYOUT_INIT,
  VALIDATE_PAGE_REDUCTION_INIT,
  VALIDATE_INVENTORY_REDUCTION_INIT,
} from "./actionTypes";

export const setClientType = clientType => ({
  type: SET_CLIENT_TYPE,
  payload: clientType,
});

export const fetchProductsInit = clientType => ({
  type: FETCH_PRODUCTS_INIT,
  payload: clientType,
});

export const setSelectedProduct = productId => ({
  type: SET_SELECTED_PRODUCT,
  payload: productId,
});

export const fetchEditionsInit = (productId, isComturClient) => ({
  type: FETCH_EDITIONS_INIT,
  payload: productId,
});

export const setSelectedEdition = editionId => ({
  type: SET_SELECTED_EDITION,
  payload: editionId,
});

export const setSelectedCurrency = currency => ({
  type: SET_SELECTED_CURRENCY,
  payload: currency,
});

// Obtener elementos de producción de una edición
export const fetchProductionItems = editionId => ({
  type: FETCH_PRODUCTION_ITEMS_INIT,
  payload: { editionId },
});

// Mover elemento a otra página
export const moveItem = (itemId, newPageNumber) => ({
  type: MOVE_ITEM_INIT,
  payload: { itemId, newPageNumber },
});

// Agregar slot a una página
export const addSlot = (editionId, pageNumber) => ({
  type: ADD_SLOT_INIT,
  payload: { editionId, pageNumber },
});

// Remover slot
export const removeSlot = itemId => ({
  type: REMOVE_SLOT_INIT,
  payload: { itemId },
});

// Actualizar observación
export const updateObservation = (itemId, observacion) => ({
  type: UPDATE_OBSERVATION_INIT,
  payload: { itemId, observacion },
});

// Marcar como editorial
export const markAsEditorial = (itemId, isEditorial) => ({
  type: MARK_AS_EDITORIAL_INIT,
  payload: { itemId, isEditorial },
});

// Marcar como CA
export const markAsCA = (itemId, isCA) => ({
  type: MARK_AS_CA_INIT,
  payload: { itemId, isCA },
});

// Generar layout automático
export const generateAutoLayout = editionId => ({
  type: GENERATE_AUTO_LAYOUT_INIT,
  payload: { editionId },
});

// Validar reducción de páginas
export const validatePageReduction = (editionId, newPageCount) => ({
  type: VALIDATE_PAGE_REDUCTION_INIT,
  payload: { editionId, newPageCount },
});

// Validar reducción de inventario
export const validateInventoryReduction = (editionId, newInventory) => ({
  type: VALIDATE_INVENTORY_REDUCTION_INIT,
  payload: { editionId, newInventory },
});
