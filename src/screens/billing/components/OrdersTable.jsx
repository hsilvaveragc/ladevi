import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "shared/utils/extensionsMethods.js";
import { getHeaderStyleTable, getAllItem } from "shared/utils/index";
import { CONSTANTS } from "../constants";
import { addToCart } from "../actionCreators";
import {
  getOrders,
  getLoading,
  getCartItems,
  getSelectedCurrency,
} from "../reducer";
import Table from "shared/components/Table";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import { SaveButton } from "shared/components/Buttons";

const OrdersTable = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getLoading);
  const orders = useSelector(getOrders);
  const cartItems = useSelector(getCartItems);
  const selectedCurrency = useSelector(getSelectedCurrency);

  const [filters, setFilters] = useState({
    sellerId: -1,
    clientId: -1,
  });

  // Estado para almacenar las órdenes filtradas localmente
  const [visibleOrders, setVisibleOrders] = useState([]);

  const [sellerOptions, setSellerOptions] = useState([getAllItem()]);
  const [clientOptions, setClientOptions] = useState([getAllItem()]);

  // Obtener IDs de ordenes que ya están en el carrito (memorizado para evitar loops)
  const ordersInCart = React.useMemo(
    () =>
      cartItems
        .filter(item => item.type === CONSTANTS.ORDER_CODE)
        .map(item => item.id),
    [cartItems]
  );

  // Filtrar las órdenes por moneda  y EXCLUIR los que están en el carrito
  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      // Solo filtrar si hay moneda seleccionada
      let ordersFilteredByCurrency = orders;
      if (selectedCurrency) {
        ordersFilteredByCurrency = orders.filter(
          order => order.currencyName === selectedCurrency
        );
      } else {
        setVisibleOrders([]);
        setSellerOptions([getAllItem()]);
        setClientOptions([getAllItem()]);
        return;
      }

      // Extraer vendedores y clientes únicos
      const uniqueSellers = new Set();
      const sellerOpts = [getAllItem()];
      const uniqueClients = new Set();
      const clientOpts = [getAllItem()];

      ordersFilteredByCurrency.forEach(order => {
        if (order.sellerId && !uniqueSellers.has(order.sellerId)) {
          uniqueSellers.add(order.sellerId);
          sellerOpts.push({
            id: order.sellerId,
            name: order.sellerFullName || `Vendedor ${order.sellerId}`,
          });
        }
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
      setVisibleOrders(availableOrders);
    } else {
      // Si no hay órdenes, resetear la vista
      setVisibleOrders([]);
      setSellerOptions([getAllItem()]);
      setClientOptions([getAllItem()]);
    }
  }, [orders, cartItems, selectedCurrency]);

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // Filtros solo en memoria
  const handleApplyFilters = () => {
    // Filtrar primero por moneda seleccionada
    let ordersToFilter = orders;
    if (selectedCurrency) {
      ordersToFilter = orders.filter(
        order => order.currencyName === selectedCurrency
      );
    }

    // Luego aplicar los filtros adicionales
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

  const handleAddOrderToCart = order => {
    if (loading) {
      return;
    }

    // Crear el item del carrito con TODA la orden
    const cartItem = {
      id: order.id,
      type: CONSTANTS.ORDER_CODE,
      clientId: order.clientId,
      clientName: order.clientBrandName,
      contractId: order.contractId,
      contractNumber: order.contractNumber,
      productName: order.productName,
      productEditionName: order.productEditionName,
      productAdvertisingSpaceName: order.productAdvertisingSpaceName,
      advertisingSpaceLocationTypeName: order.advertisingSpaceLocationTypeName,
      quantity: order.quantity,
      amount: order.total,
      totalTaxes: order.totalTaxes || 0,
      currencyName: order.currencyName,
      xubioProductCode: order.xubioProductCode,
      description: `${order.productAdvertisingSpaceName} - ${order.advertisingSpaceLocationTypeName}`,
    };

    dispatch(addToCart(cartItem));
  };

  // Agregar todas las órdenes visibles al carrito
  const handleAddAllToCart = () => {
    if (visibleOrders.length === 0) {
      return;
    }

    // Agregar cada orden visible al carrito
    visibleOrders.forEach(order => {
      handleAddOrderToCart(order);
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
      Cell: ({ row }) => {
        const order = row._original;
        return (
          <button
            className="btn btn-sm btn-primary"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleAddOrderToCart(order);
            }}
            disabled={loading}
            title="Agregar"
          >
            Agregar
          </button>
        );
      },
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

                {visibleOrders.length > 0 && (
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

        {visibleOrders.length === 0 ? (
          <div className="alert alert-info">
            {selectedCurrency
              ? "No hay ordenes de publiación disponibles con los filtros aplicados"
              : "Selecciona una moneda para ver las ordenes de publiación disponibles"}
          </div>
        ) : (
          <Table
            data={visibleOrders}
            columns={columns}
            loading={loading}
            showButton={false}
          />
        )}

        {/* NUEVO: Mostrar información de resumen */}
        {visibleOrders.length > 0 && (
          <div className="mt-3">
            <small className="text-muted">
              Mostrando {visibleOrders.length} órdenes
              {selectedCurrency && <span> • Moneda: {selectedCurrency}</span>}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
