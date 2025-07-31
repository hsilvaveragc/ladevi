import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "shared/utils/extensionsMethods.js";
import { showOrderDialog } from "../actionCreators";
import {
  getOrders,
  getLoading,
  getCartItems,
  getSelectedCurrency,
} from "../reducer";
import Table from "shared/components/Table";
import { getHeaderStyleTable } from "shared/utils/index";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import { SaveButton } from "shared/components/Buttons";

const OrdersTable = () => {
  const dispatch = useDispatch();
  // Usamos los selectores básicos en lugar del filtrado por moneda
  const orders = useSelector(getOrders);
  const loading = useSelector(getLoading);
  const cartItems = useSelector(getCartItems);
  const selectedCurrency = useSelector(getSelectedCurrency);

  const [filters, setFilters] = useState({
    productId: -1,
    editionId: -1,
    sellerId: -1,
  });

  // Estado para almacenar las órdenes filtradas localmente
  const [visibleOrders, setVisibleOrders] = useState([]);

  // Extraer opciones únicas para los dropdowns de filtros desde las órdenes cargadas
  const [productOptions, setProductOptions] = useState([
    { id: -1, name: "Todos" },
  ]);

  const [editionOptions, setEditionOptions] = useState([
    { id: -1, name: "Todas" },
  ]);

  const [sellerOptions, setSellerOptions] = useState([
    { id: -1, name: "Todos" },
  ]);

  // Obtener IDs de órdenes que ya están en el carrito
  const ordersInCart = cartItems
    .filter(item => item.type === "ORDER")
    .map(item => item.id);

  // Filtrar las órdenes por moneda y por las que no están en el carrito
  useEffect(() => {
    console.log("OrdersTable useEffect - Órdenes totales:", orders);
    console.log(
      "OrdersTable useEffect - Moneda seleccionada:",
      selectedCurrency
    );

    if (Array.isArray(orders) && orders.length > 0) {
      // Primero filtrar por moneda seleccionada
      let ordersFilteredByCurrency = orders;
      if (selectedCurrency) {
        ordersFilteredByCurrency = orders.filter(
          order => order.currencyName === selectedCurrency
        );
      }

      console.log(
        "OrdersTable useEffect - Órdenes filtradas por moneda:",
        ordersFilteredByCurrency
      );

      // Extraer productos únicos
      const uniqueProducts = new Set();
      const productOpts = [{ id: -1, name: "Todos" }];

      ordersFilteredByCurrency.forEach(order => {
        if (order.productId && !uniqueProducts.has(order.productId)) {
          uniqueProducts.add(order.productId);
          productOpts.push({
            id: order.productId,
            name: order.productName || `Producto ${order.productId}`,
          });
        }
      });

      // Extraer ediciones únicas
      const uniqueEditions = new Set();
      const editionOpts = [{ id: -1, name: "Todas" }];

      ordersFilteredByCurrency.forEach(order => {
        if (
          order.productEditionId &&
          !uniqueEditions.has(order.productEditionId)
        ) {
          uniqueEditions.add(order.productEditionId);
          editionOpts.push({
            id: order.productEditionId,
            name:
              order.productEditionName || `Edición ${order.productEditionId}`,
          });
        }
      });

      // Extraer vendedores únicos
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

      setProductOptions(productOpts);
      setEditionOptions(editionOpts);
      setSellerOptions(sellerOpts);

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
      setProductOptions([{ id: -1, name: "Todos" }]);
      setEditionOptions([{ id: -1, name: "Todas" }]);
      setSellerOptions([{ id: -1, name: "Todos" }]);
    }
  }, [orders, cartItems, selectedCurrency]); // Actualizar cuando cambia el filtro de moneda

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

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

      // Filtrar por productId
      if (filters.productId !== -1 && order.productId !== filters.productId) {
        return false;
      }

      // Filtrar por editionId
      if (
        filters.editionId !== -1 &&
        order.productEditionId !== filters.editionId
      ) {
        return false;
      }

      // Filtrar por sellerId
      if (filters.sellerId !== -1 && order.sellerId !== filters.sellerId) {
        return false;
      }

      return true;
    });

    setVisibleOrders(filtered);
  };

  const handleAddToCart = order => {
    dispatch(showOrderDialog(order));
  };

  const columns = [
    {
      Header: "N°Contrato",
      accessor: "contractNumber",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Contrato",
      accessor: "contracName",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Producto",
      accessor: "productName",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Edición",
      accessor: "productEditionName",
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Espacio",
      accessor: "productAdvertisingSpaceName",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Ubicación",
      accessor: "advertisingSpaceLocationTypeName",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Moneda",
      accessor: "currencyName",
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Cantidad",
      accessor: "quantity",
      width: "10%",
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
        <h5 className="mb-0">
          Órdenes de publicación disponibles para facturar
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <InputSelectFieldSimple
                labelText="Producto"
                name="productId"
                options={productOptions}
                value={filters.productId}
                onChangeHandler={product =>
                  handleFilterChange("productId", product.id)
                }
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
              />
            </div>
            <div className="col-md-3">
              <InputSelectFieldSimple
                labelText="Edición"
                name="editionId"
                options={editionOptions}
                value={filters.editionId}
                onChangeHandler={edition =>
                  handleFilterChange("editionId", edition.id)
                }
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
              />
            </div>
            <div className="col-md-3">
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
            <div className="col-md-1 d-flex justify-content-center align-items-center mt-2">
              <div>
                <SaveButton
                  onClickHandler={handleApplyFilters}
                  disabled={loading}
                >
                  Buscar
                </SaveButton>
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
      </div>
    </div>
  );
};

export default OrdersTable;
