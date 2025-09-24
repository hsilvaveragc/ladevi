import {
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
} from './actionTypes';

// Gestión de filtros
export const fetchProductsInit = () => ({
  type: FETCH_PRODUCTS_INIT,
});

export const fetchEditionsInit = (productId) => ({
  type: FETCH_EDITIONS_INIT,
  payload: productId,
});

export const setSelectedProduct = (product) => ({
  type: SET_SELECTED_PRODUCT,
  payload: product,
});

export const setSelectedEdition = (edition) => ({
  type: SET_SELECTED_EDITION,
  payload: edition,
});

// Cargar productos y ediciones
export const fetchProducts = () => ({
  type: FETCH_PRODUCTS_INIT,
});

export const fetchEditions = (productId) => ({
  type: FETCH_EDITIONS_INIT,
  payload: { productId },
});

// Cargar elementos de producción desde backend
export const fetchProductionItems = (productEditionId) => ({
  type: FETCH_PRODUCTION_ITEMS_INIT,
  payload: productEditionId,
});

// Mover elemento de una página a otra
export const moveItem = (
  itemId,
  sourcePageNumber,
  sourceSlot,
  targetPageNumber,
  targetSlot
) => ({
  type: MOVE_ITEM_INIT,
  payload: {
    itemId,
    sourcePageNumber,
    sourceSlot,
    targetPageNumber,
    targetSlot,
  },
});

// Agregar nuevo slot en una página
export const addSlot = (
  productEditionId,
  pageNumber,
  inventoryProductAdvertisingSpaceId
) => ({
  type: ADD_SLOT_INIT,
  payload: {
    productEditionId,
    pageNumber,
    inventoryProductAdvertisingSpaceId,
  },
});

// Remover slot
export const removeSlot = (itemId) => ({
  type: REMOVE_SLOT_INIT,
  payload: { itemId },
});

// Actualizar observación de un item
export const updateObservation = (itemId, observations) => ({
  type: UPDATE_OBSERVATION_INIT,
  payload: { itemId, observations },
});

// Marcar como editorial
export const markAsEditorial = (itemId, isEditorial) => ({
  type: MARK_AS_EDITORIAL_INIT,
  payload: { itemId, isEditorial },
});

// Marcar como CA (Cuenta Ajena)
export const markAsCA = (itemId, isCA) => ({
  type: MARK_AS_CA_INIT,
  payload: { itemId, isCA },
});

// Generar layout automático
export const generateAutoLayout = (productEditionId) => ({
  type: GENERATE_AUTO_LAYOUT_INIT,
  payload: { productEditionId },
});

// Validaciones
export const validatePageReduction = (productEditionId, newPageCount) => ({
  type: VALIDATE_PAGE_REDUCTION_INIT,
  payload: { productEditionId, newPageCount },
});

export const validateInventoryReduction = (
  productEditionId,
  inventoryChanges
) => ({
  type: VALIDATE_INVENTORY_REDUCTION_INIT,
  payload: { productEditionId, inventoryChanges },
});
