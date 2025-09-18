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

  // Obtener elementos de producción para una edición
  getProductionInventory: (productEditionId) =>
    axios
      .get(`Production/ProductionInventory`, {
        params: { productEditionId },
        headers: getHeaders(),
      })
      .then((response) => response.data),

  // Mover elemento de producción
  moveItem: (
    itemId,
    sourcePageNumber,
    sourceSlot,
    targetPageNumber,
    targetSlot
  ) =>
    axios
      .put(
        `Production/MoveItem`,
        {
          itemId,
          sourcePageNumber,
          sourceSlot,
          targetPageNumber,
          targetSlot,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Agregar nuevo slot
  addSlot: (productEditionId, pageNumber, inventoryProductAdvertisingSpaceId) =>
    axios
      .post(
        `Production/AddSlot`,
        {
          productEditionId,
          pageNumber,
          inventoryProductAdvertisingSpaceId,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Remover slot
  removeSlot: (itemId) =>
    axios
      .delete(`Production/RemoveSlot/${itemId}`, {
        headers: getHeaders(),
      })
      .then((response) => response.data),

  // Actualizar observación
  updateObservation: (itemId, observations) =>
    axios
      .put(
        `Production/UpdateObservation`,
        {
          itemId,
          observations,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Marcar como editorial
  markAsEditorial: (itemId, isEditorial) =>
    axios
      .put(
        `Production/MarkAsEditorial`,
        {
          itemId,
          isEditorial,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Marcar como CA
  markAsCA: (itemId, isCA) =>
    axios
      .put(
        `Production/MarkAsCA`,
        {
          itemId,
          isCA,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Generar layout automático
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
  assignPublishingOrderToSlot: (itemId, publishingOrderId) =>
    axios
      .put(
        `Production/AssignPublishingOrder`,
        {
          itemId,
          publishingOrderId,
        },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),

  // Desasignar orden de publicación
  unassignPublishingOrder: (itemId) =>
    axios
      .put(
        `Production/UnassignPublishingOrder`,
        { itemId },
        {
          headers: getHeaders(),
        }
      )
      .then((response) => response.data),
};
