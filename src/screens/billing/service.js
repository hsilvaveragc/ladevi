import axios from "axios";
import { getHeaders } from "shared/services/utils";
import clientService from "screens/clients/service";
import productService from "screens/products/service";
import ordersService from "screens/orders/service";

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

  // NUEVO: Filtrar órdenes por edición
  filterOrdersByEdition: (editionId, filters = {}) =>
    axios
      .post(
        `PublishingOrder/SearchByEdition`,
        {
          editionId: editionId,
          clientId: filters.clientId || null,
          sellerId: filters.sellerId || null,
          isComturClient: filters.isComturClient || null,
          take: 1000,
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),

  // Filtrar órdenes (método original, ahora menos usado)
  filterOrders: filters =>
    axios
      .post(
        `Orders/Search`,
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

  // Obtener OP contra publicación por cliente (sin cambios)
  getPublishingOrdersByClient: clientId =>
    axios
      .get(`PublishingOrder/GetPublishingOrdersByClient/${clientId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // ACTUALIZADO: Enviar datos a Xubio - ahora puede manejar múltiples facturas
  sendToXubio: invoiceData =>
    axios
      .post(`Billing/Post`, invoiceData, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // NUEVO: Enviar múltiples facturas a Xubio (para facturación por ediciones)
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

  // NUEVO: Obtener clientes únicos de una edición (para filtros)
  getClientsFromEdition: editionId =>
    axios
      .get(`Orders/GetClientsFromEdition/${editionId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),
};
