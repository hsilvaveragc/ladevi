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

  // Mover slot de una posición a otra
  moveSlot: (
    slotId,
    sourceTemplateId,
    sourceSlotNumber,
    targetTemplateId,
    targetSlotNumber
  ) =>
    axios
      .put(
        `Production/MoveSlot`,
        {
          slotId,
          sourceTemplateId,
          sourceSlotNumber,
          targetTemplateId,
          targetSlotNumber,
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

  // Generar layout automático para una edición
  generateAutoLayout: (productEditionId) =>
    axios
      .post(
        `Production/GenerateAutoLayout`,
        { productEditionId },
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

  // Asignar orden de publicación a slot
  assignPublishingOrderToSlot: (slotId, publishingOrderId) =>
    axios
      .put(
        `Production/AssignPublishingOrderToSlot`,
        {
          slotId,
          publishingOrderId,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Desasignar orden de publicación
  unassignPublishingOrderFromSlot: (slotId) =>
    axios
      .put(
        `Production/UnassignPublishingOrderFromSlot`,
        { slotId },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),
};
