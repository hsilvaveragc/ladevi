import axios from "axios";
import { getHeaders } from "shared/services/utils";
import clientService from "screens/clients/service";
import productService from "screens/products/service";

export default {
  // Obtener productos de Xubio
  getXubioProducts: () => productService.getXubioProducts(),
  getXubioComturProducts: () => productService.getXubioComturProducts(),

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

  // Obtener vendedores
  getVendors: () =>
    axios
      .get(`Users/Vendors`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  getClientsByType: clientType =>
    clientService.getAllClientsOptionsFull({
      onlyArgentina: clientType === "ARGENTINA",
      onlyComtur: clientType === "COMTUR",
    }),

  // Filtrar contratos (sin cambios)
  filterContracts: filters =>
    axios
      .post(
        `Contracts/Search`,
        {
          take: 10000,
          filter: {
            logic: "and",
            filters: [...filters],
          },
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),

  // Obtener contratos anticipados por cliente (sin cambios)
  getPendingContractsByClient: clientId =>
    axios
      .get(`Contract/GetContractByClient/${clientId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // MÉTODO ÚNICO: Obtener órdenes por edición (con parámetro isComturClient)
  getOrdersByEdition: (editionId, isComturClient = false) =>
    axios
      .get(`PublishingOrder/GetPublishingOrdersByEdition/${editionId}`, {
        params: { isComturClient },
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Obtener OP por cliente (flujo original - sin cambios)
  getPublishingOrdersByClient: clientId =>
    axios
      .get(`PublishingOrder/GetPublishingOrdersByClient/${clientId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Enviar datos a Xubio - ahora puede manejar múltiples facturas
  sendToXubio: invoiceData =>
    axios
      .post(`Billing/Post`, invoiceData, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Enviar múltiples facturas a Xubio (para facturación por ediciones)
  sendMultipleInvoicesToXubio: invoicesData =>
    axios
      .post(`Billing/PostMultiple`, invoicesData, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Obtener items de un contrato (sin cambios)
  getContractItems: contractId =>
    axios
      .get(`Contracts/GetContractItems/${contractId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Obtener detalles de una orden de publicación (sin cambios)
  getOrderDetails: orderId =>
    axios
      .get(`Orders/GetOrderDetails/${orderId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),
};
