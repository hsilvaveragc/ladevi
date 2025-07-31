import axios from "axios";
import { getHeaders } from "shared/services/utils";
import clientService from "screens/clients/service";
import productService from "screens/products/service";

export default {
  // Obtener productos de Xubio
  getXubioProducts: () => productService.getXubioProducts(),

  getXubioComturProducts: () => productService.getXubioComturProducts(),

  getClientsByType: clientType =>
    clientService.getAllClientsOptionsFull({
      onlyArgentina: clientType === "ARGENTINA",
      onlyComtur: clientType === "COMTUR",
    }),

  // Filtrar contratos
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

  // Obtener contratos anticipados por cliente
  getPendingContractsByClient: clientId =>
    axios
      .get(`Contract/GetContractByClient/${clientId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Filtrar órdenes
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

  // Obtener OP cotra publicacion
  getPublishingOrdersByClient: clientId =>
    axios
      .get(`PublishingOrder/GetPublishingOrdersByClient/${clientId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Enviar datos a Xubio para generar factura
  sendToXubio: invoiceData =>
    axios
      .post(`Billing/Post`, invoiceData, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Obtener items de un contrato
  getContractItems: contractId =>
    axios
      .get(`Contracts/GetContractItems/${contractId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),

  // Obtener detalles de una orden de publicación
  getOrderDetails: orderId =>
    axios
      .get(`Orders/GetOrderDetails/${orderId}`, {
        headers: getHeaders(),
      })
      .then(response => response.data),
};
