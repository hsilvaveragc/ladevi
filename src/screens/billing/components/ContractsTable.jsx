import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showContractDialog } from "../actionCreators";
import {
  getContracts,
  getLoading,
  getCartItems,
  getSelectedCurrency,
} from "../reducer";
import Table from "shared/components/Table";
import { getHeaderStyleTable } from "shared/utils/index";
import InputTextFieldSimple from "shared/components/InputTextFieldSimple";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";
import { SaveButton } from "shared/components/Buttons";

const ContractsTable = () => {
  const dispatch = useDispatch();
  const contracts = useSelector(getContracts);
  const loading = useSelector(getLoading);
  const cartItems = useSelector(getCartItems);
  const selectedCurrency = useSelector(getSelectedCurrency);

  const [filters, setFilters] = useState({
    number: "",
    name: "",
    productId: -1,
    sellerId: -1,
  });

  const [visibleContracts, setVisibleContracts] = useState([]);
  const [productOptions, setProductOptions] = useState([
    { id: -1, name: "Todos" },
  ]);
  const [sellerOptions, setSellerOptions] = useState([
    { id: -1, name: "Todos" },
  ]);

  // Obtener IDs de contratos que ya están en el carrito
  const contractsInCart = cartItems
    .filter(item => item.type === "CONTRACT")
    .map(item => item.id);

  // Filtrar los contratos por moneda y por los que no están en el carrito
  useEffect(() => {
    if (Array.isArray(contracts) && contracts.length > 0) {
      // CORREGIDO: Solo mostrar si hay moneda seleccionada (igual que OrdersTable)
      let contractsFilteredByCurrency = contracts;
      if (selectedCurrency) {
        contractsFilteredByCurrency = contracts.filter(
          contract => contract.currencyName === selectedCurrency
        );
      } else {
        // Si no hay moneda seleccionada, tabla vacía (igual que órdenes)
        setVisibleContracts([]);
        setProductOptions([{ id: -1, name: "Todos" }]);
        setSellerOptions([{ id: -1, name: "Todos" }]);
        return;
      }

      // Extraer productos únicos
      const uniqueProducts = new Set();
      const productOpts = [{ id: -1, name: "Todos" }];

      contractsFilteredByCurrency.forEach(contract => {
        if (contract.productId && !uniqueProducts.has(contract.productId)) {
          uniqueProducts.add(contract.productId);
          productOpts.push({
            id: contract.productId,
            name: contract.productName || `Producto ${contract.productId}`,
          });
        }
      });

      // Extraer vendedores únicos
      const uniqueSellers = new Set();
      const sellerOpts = [{ id: -1, name: "Todos" }];

      contractsFilteredByCurrency.forEach(contract => {
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
      setProductOptions([{ id: -1, name: "Todos" }]);
      setSellerOptions([{ id: -1, name: "Todos" }]);
    }
  }, [contracts, cartItems, selectedCurrency]);

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handleApplyFilters = () => {
    let contractsToFilter = contracts;
    if (selectedCurrency) {
      contractsToFilter = contracts.filter(
        contract => contract.currencyName === selectedCurrency
      );
    }

    const filtered = contractsToFilter.filter(contract => {
      if (contractsInCart.includes(contract.id)) {
        return false;
      }

      if (
        filters.number &&
        !String(contract.number)
          .toLowerCase()
          .includes(filters.number.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.name &&
        !String(contract.name)
          .toLowerCase()
          .includes(filters.name.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.productId !== -1 &&
        contract.productId !== filters.productId
      ) {
        return false;
      }

      if (filters.sellerId !== -1 && contract.sellerId !== filters.sellerId) {
        return false;
      }

      return true;
    });

    setVisibleContracts(filtered);
  };

  const handleAddToCart = contract => {
    dispatch(showContractDialog(contract));
  };

  const getContractCartStatus = contract => {
    if (!contract.soldSpaces || contract.soldSpaces.length === 0) {
      return { status: "no-items", text: "No disponible" };
    }

    const nonBilledSpaces = contract.soldSpaces.filter(space => !space.billed);
    if (nonBilledSpaces.length === 0) {
      return { status: "fully-billed", text: "Ya facturado" };
    }

    return { status: "available", text: "Agregar" };
  };

  const columns = [
    {
      Header: "Nro",
      accessor: "number",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Nombre",
      accessor: "name",
      width: "20%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Vendedor",
      accessor: "sellerFullName",
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
      id: "currency",
      Header: "Moneda",
      accessor: "currencyName",
      width: "10%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      id: "balance",
      Header: "Saldo",
      accessor: d => {
        const saldos = d.balance.join(", ");
        return saldos;
      },
      width: "15%",
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
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Acciones",
      width: "10%",
      Cell: ({ row }) => {
        const contract = row._original;
        const cartStatus = getContractCartStatus(contract);

        let buttonClass = "btn btn-sm ";
        let disabled = loading;
        let title = "";

        switch (cartStatus.status) {
          case "no-items":
          case "fully-billed":
            buttonClass += "btn-secondary";
            disabled = true;
            title = "Todos los ítems ya han sido facturados";
            break;
          case "available":
            buttonClass += "btn-primary";
            title = "Agregar ítems de este contrato al carrito";
            break;
        }

        return (
          <button
            className={buttonClass}
            onClick={() => handleAddToCart(contract)}
            disabled={disabled}
            title={title}
          >
            {cartStatus.text}
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
        <Table
          data={visibleContracts}
          columns={columns}
          loading={loading}
          showButton={false}
        />
      </div>
    </div>
  );
};

export default ContractsTable;
