import {
  SET_SELECTED_CURRENCY,
  FETCH_PRODUCTS_INIT,
  FETCH_EDITIONS_INIT,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_EDITION,
  FETCH_PRODUCTION_TEMPLATES_INIT,
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

// Gestión de filtros y selección
export const setSelectedProduct = (payload) => ({
  type: SET_SELECTED_PRODUCT,
  payload,
});

export const setSelectedEdition = (payload) => ({
  type: SET_SELECTED_EDITION,
  payload,
});

// Cargar productos y ediciones
export const fetchProducts = () => ({
  type: FETCH_PRODUCTS_INIT,
});

export const fetchEditions = (payload) => ({
  type: FETCH_EDITIONS_INIT,
  payload,
});

// Cargar ProductionTemplates desde backend
export const fetchProductionTemplates = (payload) => ({
  type: FETCH_PRODUCTION_TEMPLATES_INIT,
  payload,
});

// Mover slot de una página/posición a otra
export const moveSlot = (
  slotId,
  sourceTemplateId,
  sourceSlotNumber,
  targetTemplateId,
  targetSlotNumber
) => ({
  type: MOVE_ITEM_INIT,
  payload: {
    slotId,
    sourceTemplateId,
    sourceSlotNumber,
    targetTemplateId,
    targetSlotNumber,
  },
});

// Agregar nuevo slot en una página (ProductionTemplate)
export const addSlot = (productionTemplateId, inventoryAdvertisingSpaceId) => ({
  type: ADD_SLOT_INIT,
  payload: {
    productionTemplateId,
    inventoryAdvertisingSpaceId,
  },
});

// Remover slot
export const removeSlot = (slotId) => ({
  type: REMOVE_SLOT_INIT,
  payload: { slotId },
});

// Actualizar observación de un slot
export const updateSlotObservation = (slotId, observations) => ({
  type: UPDATE_OBSERVATION_INIT,
  payload: { slotId, observations },
});

// Marcar slot como editorial
export const markSlotAsEditorial = (slotId, isEditorial) => ({
  type: MARK_AS_EDITORIAL_INIT,
  payload: { slotId, isEditorial },
});

// Marcar slot como CA (Cuenta Ajena)
export const markSlotAsCA = (slotId, isCA) => ({
  type: MARK_AS_CA_INIT,
  payload: { slotId, isCA },
});

// Generar layout automático para una edición
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
