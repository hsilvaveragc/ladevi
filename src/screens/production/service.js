import axios from 'axios';

import { getHeaders } from 'shared/services/utils';
import productService from 'screens/products/service';

export default {
  // Obtener productos para filtros de ediciones
  getProductsForEditions: () => productService.getAllProducts(),

  // Obtener ediciones por producto
  getEditionsByProduct: (productId) =>
    axios
      .get(`ProductEdition/Options`, {
        params: {
          productId: productId,
          includeClosed: false,
        },
        headers: getHeaders(),
      })
      .then((response) => response.data),

  // Obtener ProductionTemplates con ProductionSlots para una edición
  getProductionTemplates: (productEditionId) =>
    axios
      .get(`Production/ProductionTemplates`, {
        params: { productEditionId },
        headers: getHeaders(),
      })
      .then((response) => response.data),

  // Mover orden de publicación entre slots
  movePublishingOrderBetweenSlots: (
    publishingOrderId,
    sourceSlotId,
    targetSlotId
  ) =>
    axios
      .put(
        `Production/MovePublishingOrderBetweenSlots`,
        {
          publishingOrderId,
          sourceSlotId,
          targetSlotId,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Agregar nuevo slot a un ProductionTemplate
  addSlot: (productionTemplateId, inventoryAdvertisingSpaceId) =>
    axios
      .post(
        `Production/AddSlot`,
        {
          productionTemplateId,
          inventoryAdvertisingSpaceId,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Remover slot
  removeSlot: (slotId) =>
    axios
      .delete(`Production/RemoveSlot/${slotId}`, {
        headers: getHeaders(),
      })
      .then((response) => response.data),

  // Actualizar observación de un slot
  updateSlotObservation: (slotId, observations) =>
    axios
      .put(
        `Production/UpdateSlotObservation`,
        {
          slotId,
          observations,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Marcar slot como editorial
  markSlotAsEditorial: (slotId, isEditorial) =>
    axios
      .put(
        `Production/MarkSlotAsEditorial`,
        {
          slotId,
          isEditorial,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Marcar slot como CA
  markSlotAsCA: (slotId, isCA) =>
    axios
      .put(
        `Production/MarkSlotAsCA`,
        {
          slotId,
          isCA,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Validar reducción de páginas
  validatePageReduction: (productEditionId, newPageCount) =>
    axios
      .post(
        `Production/ValidatePageReduction`,
        {
          productEditionId,
          newPageCount,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Validar reducción de inventario
  validateInventoryReduction: (productEditionId, inventoryChanges) =>
    axios
      .post(
        `Production/ValidateInventoryReduction`,
        {
          productEditionId,
          inventoryChanges,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),
};
