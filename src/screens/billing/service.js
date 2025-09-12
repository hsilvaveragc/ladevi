import axios from "axios";
import { getHeaders } from "shared/services/utils";
import clientService from "screens/clients/service";
import productService from "screens/products/service";
import { CONSTANTS } from "./constants";

export default {
  // Obtener productos de Xubio
  getXubioProducts: () => productService.getXubioProducts(),
  getXubioComturProducts: () => productService.getXubioComturProducts(),
  getXubioGenericProduct: () => productService.getXubioGenericProduct(),
  getXubioComturGenericProduct: () =>
    productService.getXubioComturGenericProduct(),

  getClientsByType: clientType =>
    clientService.getAllClientsOptionsFull({
      onlyArgentina: clientType === CONSTANTS.ARGENTINA_CODE,
      onlyComtur: clientType === CONSTANTS.COMTUR_CODE,
      onlyEnabled: true,
    }),

  getPendingContractsByClient: clientId =>
    axios
      .get(`Contract/GetContractByClient/${clientId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Obtener productos para filtros de ediciones
  getProductsForEditions: () => productService.getAllProducts(),

  // Obtener ediciones por producto
  getEditionsByProduct: productId =>
    axios
      .get(`ProductEdition/Options`, {
        params: {
          productId: productId,
          includeClosed: false,
        },
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Obtener órdenes por edición
  getOrdersByEdition: (editionId, isComturClient = false) =>
    axios
      .get(`PublishingOrder/GetPublishingOrdersByEdition/${editionId}`, {
        params: { isComturClient },
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Enviar datos a Xubio - ahora puede manejar múltiples facturas
  sendToXubio: invoiceData =>
    axios
      .post(`Billing/Contracts`, invoiceData, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Enviar múltiples facturas a Xubio (para facturación por ediciones)
  sendMultipleInvoicesToXubio: invoicesData =>
    axios
      .post(`Billing/Orders`, invoicesData, {
        headers: getHeaders(),
      })
      .then(response => response.data),
};
