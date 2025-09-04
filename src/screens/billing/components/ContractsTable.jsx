import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHeaderStyleTable, getAllItem } from "shared/utils/index";
import { CONSTANTS } from "../constants";
import { addToCart } from "../actionCreators";
import {
  getContracts,
  getLoading,
  getCartItems,
  getSelectedCurrency,
} from "../reducer";
import Table from "shared/components/Table";
import InputTextFieldSimple from "shared/components/InputTextFieldSimple";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import { SaveButton } from "shared/components/Buttons";

const ContractsTable = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getLoading);
  const contracts = useSelector(getContracts);
  const cartItems = useSelector(getCartItems);
  const selectedCurrency = useSelector(getSelectedCurrency);

  const [filters, setFilters] = useState({
    number: "",
    name: "",
    productId: -1,
    sellerId: -1,
  });

  // Estado para almacenar los contratos filtradas localmente
  const [visibleContracts, setVisibleContracts] = useState([]);

  const [productOptions, setProductOptions] = useState([getAllItem()]);
  const [sellerOptions, setSellerOptions] = useState([getAllItem()]);

  // Obtener IDs de contratos que ya están en el carrito (memorizado para evitar loops)
  const contractsInCart = React.useMemo(
    () =>
      cartItems
        .filter(item => item.type === CONSTANTS.CONTRACT_CODE)
        .map(item => item.id),
    [cartItems]
  );

  // Filtrar los contratos por moneda y EXCLUIR los que están en el carrito
  useEffect(() => {
    if (Array.isArray(contracts) && contracts.length > 0) {
      // Solo filtrar si hay moneda seleccionada
      let contractsFilteredByCurrency = contracts;
      if (selectedCurrency) {
        contractsFilteredByCurrency = contracts.filter(
          contract => contract.currencyName === selectedCurrency
        );
      } else {
        setVisibleContracts([]);
        setProductOptions([getAllItem()]);
        setSellerOptions([getAllItem()]);
        return;
      }

      // Extraer productos y vendedores únicos
      const uniqueProducts = new Set();
      const productOpts = [getAllItem()];
      const uniqueSellers = new Set();
      const sellerOpts = [getAllItem()];

      contractsFilteredByCurrency.forEach(contract => {
        if (contract.productId && !uniqueProducts.has(contract.productId)) {
          uniqueProducts.add(contract.productId);
          productOpts.push({
            id: contract.productId,
            name: contract.productName || `Producto ${contract.productId}`,
          });
        }
        if (contract.sellerId && !uniqueSellers.has(contract.sellerId)) {
          uniqueSellers.add(contract.sellerId);
          sellerOpts.push({
            id: contract.sellerId,
            name: contract.sellerFullName || `Vendedor ${contract.sellerId}`,
          });
        }
      });

      setProductOptions(productOpts);
      setSellerOptions(sellerOpts);

      // Inicializar los contratos filtrados excluyendo los que ya están en el carrito
      const availableContracts = contractsFilteredByCurrency.filter(
        contract => !contractsInCart.includes(contract.id)
      );
      setVisibleContracts(availableContracts);
    } else {
      // Si no hay contratos, resetear la vista
      setVisibleContracts([]);
      setProductOptions([getAllItem()]);
      setSellerOptions([getAllItem()]);
    }
  }, [contracts, cartItems, selectedCurrency]);

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // Filtros solo en memoria
  const handleApplyFilters = () => {
    // Filtrar primero por moneda seleccionada
    let contractsToFilter = contracts;
    if (selectedCurrency) {
      contractsToFilter = contracts.filter(
        contract => contract.currencyName === selectedCurrency
      );
    }

    // Luego aplicar los filtros adicionales
    const filtered = contractsToFilter.filter(contract => {
      // Excluir órdenes que ya están en el carrito
      if (contractsInCart.includes(contract.id)) {
        return false;
      }

      // Filtrar por number
      if (
        filters.number &&
        !String(contract.number)
          .toLowerCase()
          .includes(filters.number.toLowerCase())
      ) {
        return false;
      }

      // Filtrar por name
      if (
        filters.name &&
        !String(contract.name)
          .toLowerCase()
          .includes(filters.name.toLowerCase())
      ) {
        return false;
      }

      // Filtrar por productId
      if (
        filters.productId !== -1 &&
        contract.productId !== filters.productId
      ) {
        return false;
      }

      // Filtrar por sellerId
      if (filters.sellerId !== -1 && contract.sellerId !== filters.sellerId) {
        return false;
      }

      return true;
    });

    setVisibleContracts(filtered);
  };

  const handleAddContractToCart = contract => {
    if (loading) {
      return;
    }

    // Filtrar solo los items no facturados del contrato
    const soldSpacesArray = contract.soldSpaces || [];
    const nonBilledItems = soldSpacesArray.filter(item => !item.billed);

    if (nonBilledItems.length === 0) {
      alert("No hay espacios disponibles para facturar en este contrato");
      return;
    }

    // Crear array con TODOS los ítems no facturados del contrato
    const newEntityItems = nonBilledItems.map(contractItem => ({
      id: contractItem.id,
      productAdvertisingSpaceName: contractItem.productAdvertisingSpaceName,
      advertisingSpaceLocationTypeName:
        contractItem.advertisingSpaceLocationTypeName,
      quantity: contractItem.quantity,
      unitPriceWithDiscounts: contractItem.unitPriceWithDiscounts,
      total: contractItem.total,
      totalTaxes: contractItem.totalTaxes || 0,
      xubioProductCode:
        contractItem.xubioProductCode || contract.xubioProductCode,
      observations: `${contractItem.productAdvertisingSpaceName}`,
    }));

    // Calcular el total de TODOS los items
    const amount = newEntityItems.reduce(
      (total, item) => total + item.total,
      0
    );

    const totalTaxes = newEntityItems.reduce(
      (totalTaxes, item) => totalTaxes + (item.totalTaxes || 0),
      0
    );

    // Crear el item del carrito con TODO el contrato
    const cartItem = {
      id: contract.id,
      type: "CONTRACT",
      description: `Contrato #${contract.number || ""} - ${contract.name ||
        ""}`,
      number: contract.number || "",
      name: contract.name || "",
      amount,
      amountTaxes: totalTaxes,
      entityItems: newEntityItems,
      currencyName: contract.currencyName || "$",
      isAnticipated: true,
      isCompleteContract: true,
    };

    dispatch(addToCart(cartItem));
  };

  const columns = [
    {
      Header: "Número",
      accessor: "number",
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Cliente",
      accessor: "clientBrandName",
      width: "20%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Contrato",
      accessor: "name",
      width: "25%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Producto",
      accessor: "productName",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      id: "balance",
      Header: "Saldo",
      accessor: d => {
        const saldos = d.balance.join(", ");
        return saldos;
      },
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      id: "end",
      Header: "F. vto",
      accessor: d => {
        const fechaEnd = new Date(d.end);
        return `${fechaEnd.getDate()}/${fechaEnd.getMonth() +
          1}/${fechaEnd.getFullYear()}`;
      },
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Vendedor",
      accessor: "sellerFullName",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Acciones",
      width: "10%",
      Cell: ({ row }) => {
        const contract = row._original;

        return (
          <button
            className="btn btn-sm btn-primary"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleAddContractToCart(contract);
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
        <h5 className="mb-0">Contratos disponibles para facturar</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <div className="row">
            <div className="col-md-2">
              <InputTextFieldSimple
                labelText="Número"
                name="number"
                value={filters.number}
                onChangeHandler={e =>
                  handleFilterChange("number", e.target.value)
                }
                placeholderText="Filtrar por número..."
              />
            </div>
            <div className="col-md-3">
              <InputTextFieldSimple
                labelText="Nombre"
                name="name"
                value={filters.name}
                onChangeHandler={e =>
                  handleFilterChange("name", e.target.value)
                }
                placeholderText="Filtrar por nombre..."
              />
            </div>
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

        {visibleContracts.length === 0 ? (
          <div className="alert alert-info">
            {selectedCurrency
              ? "No hay contratos disponibles con los filtros aplicados"
              : "Selecciona una moneda para ver los contratos disponibles"}
          </div>
        ) : (
          <Table
            data={visibleContracts}
            columns={columns}
            loading={loading}
            showPagination={true}
            defaultPageSize={10}
          />
        )}
      </div>
    </div>
  );
};

export default ContractsTable;
