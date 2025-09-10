import axios from "axios";
import { getHeaders } from "shared/services/utils";
import productService from "screens/products/service";

// Datos mockeados en memoria
let mockProductionItems = [
  {
    id: 1,
    pageNumber: 1,
    inventoryProductAdvertisingSpaceId: 1,
    productEditionId: 5212,
    contractId: "contract-1",
    clientId: 1,
    clientName: "VIAJES JETSMART S.A.",
    selllerId: 1,
    selllerName: "Juan Perez",
    productAdvertisingSpaceHeight: 297,
    productAdvertisingSpaceWidth: 210,
    advertisingSpaceLocationTypeId: 1,
    observations: "",
    isEditorial: false,
    isCA: false,
    publishingOrders: [
      {
        id: 101,
        publishingOrderId: 1001,
        orderNumber: "OP-1001",
      },
    ],

    // position: 1,
    // anunciante: "JETSMART",
    // vendedor: "BM",
    // medida: "OJOS TAPA",
    // ubicacion: null,

    // isOriginalSlot: true,
    // opId: "op-1",
    // createdAt: new Date(),
    // updatedAt: new Date(),
  },
  {
    id: "2",
    editionId: "edition-1",
    pageNumber: 1,
    position: 2,
    anunciante: "CARNIVAL TOURS",
    vendedor: "BM",
    medida: "PIE DE TAPA",
    ubicacion: null,
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    editionId: "edition-1",
    pageNumber: 2,
    position: 1,
    anunciante: "GRUPO GEA",
    vendedor: "AGG",
    medida: "PAGINA",
    ubicacion: "antes",
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    editionId: "edition-1",
    pageNumber: 3,
    position: 1,
    anunciante: "",
    vendedor: "",
    medida: "EDITORIAL",
    ubicacion: null,
    observacion: "Nota sobre turismo sustentable",
    isEditorial: true,
    isCA: false,
    isOriginalSlot: true,
    opId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    editionId: "edition-1",
    pageNumber: 4,
    position: 1,
    anunciante: "",
    vendedor: "",
    medida: "EDITORIAL",
    ubicacion: null,
    observacion: "",
    isEditorial: true,
    isCA: false,
    isOriginalSlot: true,
    opId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    editionId: "edition-1",
    pageNumber: 5,
    position: 1,
    anunciante: "SUDAMERIA",
    vendedor: "AG",
    medida: "PAGINA",
    ubicacion: "antes",
    observacion: "Confirmar fechas con cliente",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    editionId: "edition-1",
    pageNumber: 6,
    position: 1,
    anunciante: "TRAYECTO UNO",
    vendedor: "PA",
    medida: "HORIZONTAL",
    ubicacion: "antes",
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    editionId: "edition-1",
    pageNumber: 7,
    position: 1,
    anunciante: "TOP DEST",
    vendedor: "AGG",
    medida: "PAGINA",
    ubicacion: "antes",
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    editionId: "edition-1",
    pageNumber: 8,
    position: 1,
    anunciante: "PLAZA BOHEMIA",
    vendedor: "PA",
    medida: "PIE",
    ubicacion: "antes",
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-7",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    editionId: "edition-1",
    pageNumber: 9,
    position: 1,
    anunciante: "TUCANO",
    vendedor: "PA",
    medida: "PAGINA",
    ubicacion: "antes",
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-8",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    editionId: "edition-1",
    pageNumber: 10,
    position: 1,
    anunciante: "EUROPA BA",
    vendedor: "PA",
    medida: "HORIZONTAL",
    ubicacion: "antes",
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-9",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    editionId: "edition-1",
    pageNumber: 11,
    position: 1,
    anunciante: "UNIVERSAL ASSISTANCE",
    vendedor: "BM",
    medida: "PAGINA",
    ubicacion: "despues",
    observacion: "",
    isEditorial: false,
    isCA: false,
    isOriginalSlot: true,
    opId: "op-10",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    editionId: "edition-1",
    pageNumber: 12,
    position: 1,
    anunciante: "ARUBA-CA",
    vendedor: "",
    medida: "CA",
    ubicacion: null,
    observacion: "Publireportaje sobre Aruba",
    isEditorial: false,
    isCA: true,
    isOriginalSlot: true,
    opId: "op-11",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Simulación de delay de red
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Generar ID único
const generateId = () =>
  "item_" +
  Date.now() +
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

export default {
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

  // // Obtener órdenes por edición
  // getOrdersByEdition: (editionId, isComturClient = false) =>
  //   axios
  //     .get(`PublishingOrder/GetPublishingOrdersByEdition/${editionId}`, {
  //       params: { isComturClient },
  //       headers: getHeaders(),
  //     })
  //     .then(response => response.data),

  // Obtener todos los elementos de producción de una edición
  getProductionItems: editionId => {
    delay(500); // Simular latencia de red

    const items = mockProductionItems.filter(
      item => item.editionId === editionId
    );
    const totalPages = Math.max(...items.map(item => item.pageNumber), 20); // Mínimo 20 páginas

    return {
      items,
      totalPages,
      editionId,
    };
  },

  // Mover un elemento a otra página/posición
  moveItem: (itemId, newPageNumber) => {
    delay(200);

    const itemIndex = mockProductionItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Elemento no encontrado");
    }

    // Actualizar el elemento
    mockProductionItems[itemIndex] = {
      ...mockProductionItems[itemIndex],
      pageNumber: newPageNumber,
      updatedAt: new Date(),
    };

    console.log(`Elemento ${itemId} movido a página ${newPageNumber}`);
    return { success: true };
  },

  // Agregar un nuevo slot a una página
  addSlot: (editionId, pageNumber) => {
    delay(300);

    const newItem = {
      id: generateId(),
      editionId,
      pageNumber,
      position: 999, // Se asignará automáticamente
      anunciante: "",
      vendedor: "",
      medida: "",
      ubicacion: null,
      observacion: "",
      isEditorial: false,
      isCA: false,
      isOriginalSlot: false, // Slot agregado manualmente
      opId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProductionItems.push(newItem);

    console.log(`Slot agregado en página ${pageNumber}:`, newItem);
    return newItem;
  },

  // Eliminar un slot (solo los que no son originales)
  removeSlot: itemId => {
    delay(200);

    const itemIndex = mockProductionItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Elemento no encontrado");
    }

    const item = mockProductionItems[itemIndex];
    if (item.isOriginalSlot) {
      throw new Error("No se puede eliminar un slot original");
    }

    mockProductionItems.splice(itemIndex, 1);

    console.log(`Slot ${itemId} eliminado`);
    return { success: true };
  },

  // Actualizar observación de un elemento
  updateObservation: (itemId, observacion) => {
    delay(100);

    const itemIndex = mockProductionItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Elemento no encontrado");
    }

    mockProductionItems[itemIndex] = {
      ...mockProductionItems[itemIndex],
      observacion,
      updatedAt: new Date(),
    };

    console.log(`Observación actualizada para ${itemId}: "${observacion}"`);
    return { success: true };
  },

  // Marcar elemento como Editorial
  markAsEditorial: (itemId, isEditorial) => {
    delay(150);

    const itemIndex = mockProductionItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Elemento no encontrado");
    }

    mockProductionItems[itemIndex] = {
      ...mockProductionItems[itemIndex],
      isEditorial,
      isCA: isEditorial ? false : mockProductionItems[itemIndex].isCA, // Si es editorial, no puede ser CA
      medida: isEditorial ? "EDITORIAL" : mockProductionItems[itemIndex].medida,
      updatedAt: new Date(),
    };

    console.log(
      `Elemento ${itemId} marcado como ${
        isEditorial ? "Editorial" : "Publicidad"
      }`
    );
    return { success: true };
  },

  // Marcar elemento como CA (Content)
  markAsCA: (itemId, isCA) => {
    delay(150);

    const itemIndex = mockProductionItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Elemento no encontrado");
    }

    mockProductionItems[itemIndex] = {
      ...mockProductionItems[itemIndex],
      isCA,
      isEditorial: isCA ? false : mockProductionItems[itemIndex].isEditorial, // Si es CA, no puede ser editorial
      medida: isCA ? "CA" : mockProductionItems[itemIndex].medida,
      updatedAt: new Date(),
    };

    console.log(
      `Elemento ${itemId} marcado como ${isCA ? "CA" : "Publicidad"}`
    );
    return { success: true };
  },

  // Generar automáticamente la distribución de páginas basada en las OPs
  generateAutoLayout: editionId => {
    delay(1000); // Operación más lenta

    const items = mockProductionItems.filter(
      item => item.editionId === editionId
    );

    // Lógica de auto-asignación simplificada
    let assignedItems = [];
    let currentPagePar = 2; // Empezar en página 2 para TDE Página
    let currentPageImpar = 3; // Empezar en página 3 para otros

    items.forEach(item => {
      let newPageNumber = item.pageNumber; // Por defecto mantener

      // Ojo de tapa y Pie de tapa van a página 1
      if (
        item.medida &&
        (item.medida.toLowerCase().includes("ojo") ||
          item.medida.toLowerCase().includes("pie"))
      ) {
        newPageNumber = 1;
      }
      // TDE Página van a páginas pares
      else if (item.medida && item.medida.toLowerCase().startsWith("pagina")) {
        newPageNumber = currentPagePar;
        currentPagePar += 2;
      }
      // Resto va a páginas impares
      else if (!item.isEditorial && !item.isCA) {
        newPageNumber = currentPageImpar;
        currentPageImpar += 2;
      }

      assignedItems.push({
        ...item,
        pageNumber: newPageNumber,
        updatedAt: new Date(),
      });
    });

    // Actualizar los datos en memoria
    mockProductionItems = mockProductionItems.map(item => {
      if (item.editionId !== editionId) return item;
      const assigned = assignedItems.find(a => a.id === item.id);
      return assigned || item;
    });

    console.log("Layout automático generado para edición:", editionId);
    return {
      items: assignedItems,
      totalPages: Math.max(...assignedItems.map(item => item.pageNumber), 20),
    };
  },

  // Validar que la edición puede reducir páginas
  validatePageReduction: (editionId, newPageCount) => {
    delay(300);

    const items = mockProductionItems.filter(
      item => item.editionId === editionId
    );
    const conflictingItems = items
      .filter(item => item.pageNumber > newPageCount)
      .map(
        item => `${item.anunciante || "Editorial"} (Página ${item.pageNumber})`
      );

    const canReduce = conflictingItems.length === 0;

    console.log(`Validación reducción a ${newPageCount} páginas:`, {
      canReduce,
      conflictingItems,
    });
    return { canReduce, conflictingItems };
  },

  // Validar que se puede reducir inventario
  validateInventoryReduction: (editionId, newInventory) => {
    delay(300);

    // Simulación simple - siempre validar que hay suficiente stock
    const items = mockProductionItems.filter(
      item => item.editionId === editionId
    );
    const usedSlots = items.filter(item => !item.isEditorial && !item.isCA)
      .length;

    // Simular que newInventory tiene una propiedad totalSlots
    const availableSlots = newInventory.totalSlots || 0;
    const canReduce = availableSlots >= usedSlots;
    const conflictingItems = canReduce
      ? []
      : [`${usedSlots - availableSlots} avisos sin asignar`];

    console.log("Validación reducción inventario:", {
      canReduce,
      conflictingItems,
      usedSlots,
      availableSlots,
    });
    return { canReduce, conflictingItems };
  },
};

// Función helper para resetear datos (útil para testing)
export const resetMockData = () => {
  mockProductionItems = mockProductionItems.filter(() => false); // Limpiar array
  console.log("Datos mockeados reiniciados");
};

// Función helper para agregar datos de prueba adicionales
export const addMockData = items => {
  mockProductionItems.push(...items);
  console.log("Datos mockeados agregados:", items.length);
};
