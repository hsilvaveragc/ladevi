import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setClientType,
  fetchClientsInit,
  selectClient,
  setEntityType,
  fetchContractsInit,
  fetchOrdersInit,
  setSelectedCurrency,
  // Nuevas acciones para productos y ediciones
  fetchProductsInit,
  fetchEditionsInit,
  setSelectedProduct,
  setSelectedEdition,
} from "../actionCreators";
import {
  getClientType,
  getClients,
  getSelectedClient,
  getEntityType,
  getLoading,
  getContracts,
  getOrders,
  getSelectedCurrency,
  // Nuevos selectores
  getProducts,
  getEditions,
  getSelectedProduct,
  getSelectedEdition,
} from "../reducer";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";

const SelectorsContainer = () => {
  const dispatch = useDispatch();

  // Selectores existentes
  const clientType = useSelector(getClientType);
  const clients = useSelector(getClients);
  const selectedClient = useSelector(getSelectedClient);
  const entityType = useSelector(getEntityType);
  const loading = useSelector(getLoading);
  const contracts = useSelector(getContracts);
  const orders = useSelector(getOrders);
  const selectedCurrency = useSelector(getSelectedCurrency);

  // Nuevos selectores para productos y ediciones
  const products = useSelector(getProducts);
  const editions = useSelector(getEditions);
  const selectedProduct = useSelector(getSelectedProduct);
  const selectedEdition = useSelector(getSelectedEdition);

  // Estado local para las opciones de moneda
  const [currencyOptions, setCurrencyOptions] = useState([]);

  // Cargar clientes cuando cambia el tipo de cliente
  useEffect(() => {
    if (clientType) {
      dispatch(fetchClientsInit(clientType));
    }
  }, [dispatch, clientType]);

  // Cargar productos cuando se selecciona tipo ediciones
  useEffect(() => {
    if (entityType === "EDITIONS" && clientType) {
      dispatch(fetchProductsInit(clientType));
    }
  }, [dispatch, entityType, clientType]);

  // Cargar ediciones cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct && entityType === "EDITIONS") {
      dispatch(fetchEditionsInit(selectedProduct, clientType !== "ARGENTINA"));
    }
  }, [dispatch, selectedProduct, entityType]);

  // Extraer opciones de moneda únicas cuando se cargan contratos u órdenes
  useEffect(() => {
    if (entityType === "CONTRACTS" && contracts && contracts.length > 0) {
      // Extraer monedas únicas de los contratos
      const uniqueCurrencies = new Set();
      contracts.forEach(contract => {
        if (contract.currencyName) {
          uniqueCurrencies.add(contract.currencyName);
        }
      });

      // Convertir a array de opciones
      const currencyOpts = [];
      uniqueCurrencies.forEach(currency => {
        currencyOpts.push({ id: currency, name: currency });
      });

      setCurrencyOptions(currencyOpts);

      // Si hay opciones y no hay moneda seleccionada, seleccionar la primera automáticamente
      if (currencyOpts.length > 0 && !selectedCurrency) {
        dispatch(setSelectedCurrency(currencyOpts[0].id));
      }
    } else if (entityType === "EDITIONS" && orders && orders.length > 0) {
      // Extraer monedas únicas de las órdenes
      const uniqueCurrencies = new Set();
      orders.forEach(order => {
        if (order.currencyName) {
          uniqueCurrencies.add(order.currencyName);
        }
      });

      // Convertir a array de opciones
      const currencyOpts = [];
      uniqueCurrencies.forEach(currency => {
        currencyOpts.push({ id: currency, name: currency });
      });

      setCurrencyOptions(currencyOpts);

      // Si hay opciones y no hay moneda seleccionada, seleccionar la primera automáticamente
      if (currencyOpts.length > 0 && !selectedCurrency) {
        dispatch(setSelectedCurrency(currencyOpts[0].id));
      }
    }
  }, [entityType, contracts, orders, selectedCurrency, dispatch]);

  const handleClientTypeChange = selected => {
    // Reset client selection and entity type when client type changes
    dispatch(setClientType(selected.id));
  };

  const handleClientChange = selected => {
    dispatch(selectClient(selected));
  };

  const handleEntityTypeChange = selected => {
    dispatch(setEntityType(selected.id));

    // Cargar datos según el tipo seleccionado
    if (selected.id === "CONTRACTS" && selectedClient) {
      dispatch(fetchContractsInit(selectedClient.id));
    } else if (selected.id === "EDITIONS") {
      // Para ediciones, no cargamos datos hasta seleccionar producto y edición
      // Los productos ya se cargan automáticamente en el useEffect
    }
  };

  const handleProductChange = selected => {
    dispatch(setSelectedProduct(selected.id));
    // Las ediciones se cargan automáticamente en el useEffect
  };

  const handleEditionChange = selected => {
    dispatch(setSelectedEdition(selected.id));
    // Cargar órdenes de la edición seleccionada
    dispatch(fetchOrdersInit({ editionId: selected.id }));
  };

  const handleCurrencyChange = selected => {
    dispatch(setSelectedCurrency(selected.id));
  };

  const getSortedClients = clients => {
    if (!clients || !Array.isArray(clients)) {
      return [];
    }

    return [...clients].sort((a, b) => {
      // Primero por xubioId
      const aHasXubio = a.xubioId ? 0 : 1;
      const bHasXubio = b.xubioId ? 0 : 1;

      if (aHasXubio !== bHasXubio) {
        return aHasXubio - bHasXubio;
      }

      // Luego alfabético por brandName (con trim)
      const aBrandName = (a.brandName || "").trim().toLowerCase();
      const bBrandName = (b.brandName || "").trim().toLowerCase();

      return aBrandName.localeCompare(bBrandName);
    });
  };

  // Opciones para el selector de tipo de cliente
  const clientTypeOptions = [
    { id: "", name: "Seleccione tipo de cliente" },
    { id: "ARGENTINA", name: "Cliente de Argentina" },
    { id: "COMTUR", name: "Cliente COMTUR" },
  ];

  // Opciones para el selector de tipo de entidad - CAMBIO PRINCIPAL
  const entityTypeOptions = [
    { id: "CONTRACTS", name: "Contratos" },
    { id: "EDITIONS", name: "Ediciones" }, // Cambio de "ORDERS" a "EDITIONS"
  ];

  // Filtros para mostrar según el tipo de entidad seleccionado
  const isContractFlow = entityType === "CONTRACTS";
  const isEditionFlow = entityType === "EDITIONS";

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Inicio de facturación</h5>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Tipo de cliente - siempre primero */}
          <div className="col-md-3 mb-3">
            <InputSelectFieldSimple
              labelText="Tipo de cliente *"
              name="clientType"
              options={clientTypeOptions}
              value={clientType || ""}
              onChangeHandler={handleClientTypeChange}
              disabled={loading}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
            />
          </div>

          {/* Tipo de entidad - segundo */}
          <div className="col-md-2 mb-3">
            <InputSelectFieldSimple
              labelText="¿Qué desea facturar? *"
              fontSize="14px"
              name="entityType"
              options={entityTypeOptions}
              value={entityType || ""}
              onChangeHandler={handleEntityTypeChange}
              disabled={loading || !clientType}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
            />
          </div>

          {/* FLUJO PARA CONTRATOS - igual que antes */}
          {isContractFlow && (
            <>
              <div className="col-md-5 mb-3">
                <InputSelectFieldSimple
                  labelText="Cliente *"
                  name="client"
                  options={getSortedClients(clients || [])}
                  value={selectedClient ? selectedClient.id : ""}
                  onChangeHandler={handleClientChange}
                  disabled={
                    loading || !entityType || (clients || []).length === 0
                  }
                  getOptionLabel={option => {
                    const baseLabel = `${option.brandName} - ${option.legalName}`;
                    return option.xubioId
                      ? baseLabel
                      : `${baseLabel} (NO SINCRONIZADO CON XUBIO)`;
                  }}
                  getOptionValue={option => option.id}
                />
              </div>

              <div className="col-md-2 mb-3">
                <InputSelectFieldSimple
                  labelText="Moneda *"
                  fontSize="14px"
                  name="currency"
                  options={currencyOptions}
                  value={selectedCurrency || ""}
                  onChangeHandler={handleCurrencyChange}
                  disabled={loading || !selectedClient}
                  getOptionLabel={option => option.name}
                  getOptionValue={option => option.id}
                />
              </div>
            </>
          )}

          {/* NUEVO FLUJO PARA EDICIONES */}
          {isEditionFlow && (
            <>
              <div className="col-md-3 mb-3">
                <InputSelectFieldSimple
                  labelText="Producto *"
                  name="product"
                  options={products || []}
                  value={selectedProduct || ""}
                  onChangeHandler={handleProductChange}
                  disabled={loading || !entityType}
                  getOptionLabel={option => option.name}
                  getOptionValue={option => option.id}
                />
              </div>

              <div className="col-md-3 mb-3">
                <InputSelectFieldSimple
                  labelText="Edición *"
                  name="edition"
                  options={editions || []}
                  value={selectedEdition || ""}
                  onChangeHandler={handleEditionChange}
                  disabled={loading || !selectedProduct}
                  getOptionLabel={option => `${option.name} (${option.code})`}
                  getOptionValue={option => option.id}
                />
              </div>

              <div className="col-md-1 mb-3">
                <InputSelectFieldSimple
                  labelText="Moneda *"
                  fontSize="10px"
                  name="currency"
                  options={currencyOptions}
                  value={selectedCurrency || ""}
                  onChangeHandler={handleCurrencyChange}
                  disabled={loading || !selectedEdition}
                  getOptionLabel={option => option.name}
                  getOptionValue={option => option.id}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectorsContainer;
