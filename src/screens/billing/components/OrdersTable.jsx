import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "shared/utils/extensionsMethods.js";
import { showOrderDialog, addToCart } from "../actionCreators";
import {
  getOrders,
  getLoading,
  getCartItems,
  getSelectedCurrency,
  getEntityType,
} from "../reducer";
import Table from "shared/components/Table";
import { getHeaderStyleTable } from "shared/utils/index";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import { SaveButton } from "shared/components/Buttons";

const OrdersTable = () => {
  const dispatch = useDispatch();

  // Selectores
  const orders = useSelector(getOrders);
  const loading = useSelector(getLoading);
  const cartItems = useSelector(getCartItems);
  const selectedCurrency = useSelector(getSelectedCurrency);
  const entityType = useSelector(getEntityType);

  // SIMPLIFICADO: Solo filtros relevantes para facturación por ediciones
  const [filters, setFilters] = useState({
    sellerId: -1,
    clientId: -1, // Solo para ediciones
  });

  // Estado para almacenar las órdenes filtradas localmente
  const [visibleOrders, setVisibleOrders] = useState([]);

  // SIMPLIFICADO: Solo opciones necesarias
  const [sellerOptions, setSellerOptions] = useState([
    { id: -1, name: "Todos" },
  ]);

  const [clientOptions, setClientOptions] = useState([
    { id: -1, name: "Todos" },
  ]);

  // Obtener IDs de órdenes que ya están en el carrito
  const ordersInCart = cartItems
    .filter(item => item.type === "ORDER")
    .map(item => item.id);

  // Filtrar las órdenes por moneda (IGUAL QUE CONTRATOS) - Solo mostrar cuando hay moneda seleccionada
  useEffect(() => {
    console.log("OrdersTable useEffect - Órdenes totales:", orders);
    console.log(
      "OrdersTable useEffect - Moneda seleccionada:",
      selectedCurrency
    );

    if (Array.isArray(orders) && orders.length > 0) {
      // IGUAL QUE CONTRATOS: Solo filtrar si hay moneda seleccionada
      let ordersFilteredByCurrency = orders;
      if (selectedCurrency) {
        ordersFilteredByCurrency = orders.filter(
          order => order.currencyName === selectedCurrency
        );
      } else {
        // Si no hay moneda seleccionada, no mostrar órdenes (igual que contratos)
        setVisibleOrders([]);
        setSellerOptions([{ id: -1, name: "Todos" }]);
        setClientOptions([{ id: -1, name: "Todos" }]);
        return;
      }

      console.log(
        "OrdersTable useEffect - Órdenes filtradas por moneda:",
        ordersFilteredByCurrency
      );

      // SIMPLIFICADO: Solo extraer vendedores y clientes (no producto/edición que ya están seleccionados)
      const uniqueSellers = new Set();
      const sellerOpts = [{ id: -1, name: "Todos" }];

      ordersFilteredByCurrency.forEach(order => {
        if (order.sellerId && !uniqueSellers.has(order.sellerId)) {
          uniqueSellers.add(order.sellerId);
          sellerOpts.push({
            id: order.sellerId,
            name: order.sellerFullName || `Vendedor ${order.sellerId}`,
          });
        }
      });

      // Extraer clientes únicos (para facturación por ediciones)
      const uniqueClients = new Set();
      const clientOpts = [{ id: -1, name: "Todos" }];

      ordersFilteredByCurrency.forEach(order => {
        if (order.clientId && !uniqueClients.has(order.clientId)) {
          uniqueClients.add(order.clientId);
          clientOpts.push({
            id: order.clientId,
            name: order.clientBrandName || `Cliente ${order.clientId}`,
          });
        }
      });

      setSellerOptions(sellerOpts);
      setClientOptions(clientOpts);

      // Inicializar las órdenes filtradas excluyendo las que ya están en el carrito
      const availableOrders = ordersFilteredByCurrency.filter(
        order => !ordersInCart.includes(order.id)
      );
      console.log(
        "OrdersTable useEffect - Órdenes disponibles final:",
        availableOrders
      );
      setVisibleOrders(availableOrders);
    } else {
      // Si no hay órdenes, resetear la vista
      setVisibleOrders([]);
      setSellerOptions([{ id: -1, name: "Todos" }]);
      setClientOptions([{ id: -1, name: "Todos" }]);
    }
  }, [orders, cartItems, selectedCurrency]);

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // SIMPLIFICADO: Filtros solo en memoria (igual que ContractsTable)
  const handleApplyFilters = () => {
    // Filtrar primero por moneda seleccionada
    let ordersToFilter = orders;
    if (selectedCurrency) {
      ordersToFilter = orders.filter(
        order => order.currencyName === selectedCurrency
      );
    }

    // Luego aplicar los filtros adicionales EN MEMORIA
    const filtered = ordersToFilter.filter(order => {
      // Excluir órdenes que ya están en el carrito
      if (ordersInCart.includes(order.id)) {
        return false;
      }

      // Filtrar por sellerId
      if (filters.sellerId !== -1 && order.sellerId !== filters.sellerId) {
        return false;
      }

      // Filtrar por clientId (para facturación por ediciones)
      if (filters.clientId !== -1 && order.clientId !== filters.clientId) {
        return false;
      }

      return true;
    });

    setVisibleOrders(filtered);
  };

  const handleAddToCart = order => {
    dispatch(showOrderDialog(order));
  };

  // NUEVA FUNCIÓN: Agregar todas las órdenes visibles al carrito
  const handleAddAllToCart = () => {
    if (visibleOrders.length === 0) {
      return;
    }

    // Agregar cada orden visible al carrito
    visibleOrders.forEach(order => {
      const cartItem = {
        id: order.id,
        type: "ORDER",
        clientId: order.clientId,
        clientName: order.clientBrandName,
        contractId: order.contractId,
        contractNumber: order.contractNumber,
        productName: order.productName,
        productEditionName: order.productEditionName,
        productAdvertisingSpaceName: order.productAdvertisingSpaceName,
        advertisingSpaceLocationTypeName:
          order.advertisingSpaceLocationTypeName,
        quantity: order.quantity,
        amount: order.total,
        totalTaxes: order.totalTaxes || 0,
        currencyName: order.currencyName,
        xubioProductCode: order.xubioProductCode,
        description: `${order.productAdvertisingSpaceName} - ${order.advertisingSpaceLocationTypeName}`,
        observations: `Contrato: ${order.contractNumber} - ${order.contractName}\nProducto: ${order.productName}\nEdición: ${order.productEditionName}\nEspacio: ${order.productAdvertisingSpaceName}\nUbicación: ${order.advertisingSpaceLocationTypeName}`,
      };

      dispatch(addToCart(cartItem));
    });
  };

  const columns = [
    {
      Header: "Cliente",
      accessor: "clientBrandName",
      width: "1%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "N°Contrato",
      accessor: "contractNumber",
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Contrato",
      accessor: "contractName",
      width: "20%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Espacio",
      accessor: "productAdvertisingSpaceName",
      width: "20%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Ubicación",
      accessor: "advertisingSpaceLocationTypeName",
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Moneda",
      accessor: "currencyName",
      width: "5%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Cantidad",
      accessor: "quantity",
      width: "5%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: "total",
      Header: "Importe",
      width: "10%",
      headerStyle: getHeaderStyleTable(),
      Cell: props =>
        `${
          props.original.currencyName
        } ${props.original.total.toLocaleCurrency()}`,
    },
    {
      Header: "Acciones",
      width: "10%",
      Cell: ({ row }) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleAddToCart(row._original)}
          disabled={loading}
        >
          Agregar
        </button>
      ),
      headerStyle: getHeaderStyleTable(),
    },
  ];

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Órdenes de la edición seleccionada</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <div className="row">
            {/* SIMPLIFICADO: Solo filtros relevantes para facturación por ediciones */}
            <div className="col-md-4">
              <InputSelectFieldSimple
                labelText="Cliente"
                name="clientId"
                options={clientOptions}
                value={filters.clientId}
                onChangeHandler={client =>
                  handleFilterChange("clientId", client.id)
                }
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
              />
            </div>

            <div className="col-md-4">
              <InputSelectFieldSimple
                labelText="Vendedor"
                name="sellerId"
                options={sellerOptions}
                value={filters.sellerId}
                onChangeHandler={seller =>
                  handleFilterChange("sellerId", seller.id)
                }
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
              />
            </div>

            <div className="col-md-3 d-flex justify-content-center align-items-center mt-2">
              <div className="d-flex gap-2">
                <SaveButton
                  onClickHandler={handleApplyFilters}
                  disabled={loading}
                >
                  Buscar
                </SaveButton>

                {entityType === "EDITIONS" && visibleOrders.length > 0 && (
                  <button
                    className="btn btn-primary btn-sm ml-3"
                    onClick={handleAddAllToCart}
                    disabled={loading}
                    title="Agregar todas las órdenes visibles al carrito"
                  >
                    Agregar Todo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Table
          data={visibleOrders}
          columns={columns}
          loading={loading}
          showButton={false}
        />

        {/* NUEVO: Mostrar información de resumen */}
        {visibleOrders.length > 0 && (
          <div className="mt-3">
            <small className="text-muted">
              Mostrando {visibleOrders.length} órdenes
              {entityType === "EDITIONS" && selectedCurrency && (
                <span> • Moneda: {selectedCurrency}</span>
              )}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
