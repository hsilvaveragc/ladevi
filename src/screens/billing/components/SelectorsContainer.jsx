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
} from "../reducer";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";

const SelectorsContainer = () => {
  const dispatch = useDispatch();
  const clientType = useSelector(getClientType);
  const clients = useSelector(getClients);
  const selectedClient = useSelector(getSelectedClient);
  const entityType = useSelector(getEntityType);
  const loading = useSelector(getLoading);
  const contracts = useSelector(getContracts);
  const orders = useSelector(getOrders);
  const selectedCurrency = useSelector(getSelectedCurrency);

  // Estado local para las opciones de moneda
  const [currencyOptions, setCurrencyOptions] = useState([]);

  // Cargar clientes cuando cambia el tipo de cliente
  useEffect(() => {
    if (clientType) {
      dispatch(fetchClientsInit(clientType));
    }
  }, [dispatch, clientType]);

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
    } else if (entityType === "ORDERS" && orders && orders.length > 0) {
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
    if (selected.id === "CONTRACTS") {
      dispatch(fetchContractsInit(selectedClient.id));
    } else if (selected.id === "ORDERS") {
      dispatch(fetchOrdersInit(selectedClient.id));
    }
  };

  const handleCurrencyChange = selected => {
    dispatch(setSelectedCurrency(selected.id));
  };

  const getSortedClients = clients => {
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

  // Opciones para el selector de tipo de entidad
  const entityTypeOptions = [
    { id: "", name: "Seleccione tipo de entidad" },
    { id: "CONTRACTS", name: "Contratos" },
    { id: "ORDERS", name: "Órdenes de Publicación" },
  ];

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Inicio de facturación</h5>
      </div>
      <div className="card-body">
        <div className="row">
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

          <div className="col-md-5 mb-3">
            <InputSelectFieldSimple
              labelText="Cliente *"
              name="client"
              options={getSortedClients(clients)}
              value={selectedClient ? selectedClient.id : ""}
              onChangeHandler={handleClientChange}
              disabled={loading || !clientType || clients.length === 0}
              getOptionLabel={option => {
                const baseLabel = `${option.brandName} - ${option.legalName}`;
                return option.xubioId
                  ? baseLabel
                  : `${baseLabel} (NO SINCRONIZADO CON XUBIO)`;
              }}
            />
          </div>

          <div className="col-md-2 mb-3">
            <InputSelectFieldSimple
              labelText="¿Qué desea facturar? *"
              name="entityType"
              options={entityTypeOptions}
              value={entityType || ""}
              onChangeHandler={handleEntityTypeChange}
              disabled={loading || !selectedClient}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
            />
          </div>

          <div className="col-md-2 mb-3">
            <InputSelectFieldSimple
              labelText="Moneda *"
              name="currency"
              options={currencyOptions}
              value={selectedCurrency}
              onChangeHandler={handleCurrencyChange}
              disabled={loading || !entityType || currencyOptions.length === 0}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectorsContainer;
