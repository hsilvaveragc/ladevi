import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CONSTANTS } from "../constants";
import {
  setClientType,
  fetchOrdersInit,
  setSelectedCurrency,
  fetchProductsInit,
  fetchEditionsInit,
  setSelectedProduct,
  setSelectedEdition,
} from "../actionCreators";
import {
  getClientType,
  getLoading,
  getOrders,
  getSelectedCurrency,
  getProducts,
  getEditions,
  getSelectedProduct,
  getSelectedEdition,
} from "../reducer";
import InputSelectFieldSimple from "shared/components/InputSelectFieldSimple";

const SelectorsContainer = () => {
  const dispatch = useDispatch();

  /* Estados globales */
  const loading = useSelector(getLoading);
  const clientType = useSelector(getClientType);
  const selectedCurrency = useSelector(getSelectedCurrency);

  /* Estados para el manejo de ordenes*/
  const products = useSelector(getProducts);
  const editions = useSelector(getEditions);
  const selectedProduct = useSelector(getSelectedProduct);
  const selectedEdition = useSelector(getSelectedEdition);
  // const orders = useSelector(getOrders);

  // Estado local para las opciones de moneda
  const [currencyOptions, setCurrencyOptions] = useState([]);

  // Cargar productos cuando se selecciona tipo de cliente
  useEffect(() => {
    if (clientType) {
      dispatch(fetchProductsInit(clientType));
    }
  }, [dispatch, clientType]);

  // Cargar ediciones cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      dispatch(
        fetchEditionsInit(
          selectedProduct,
          clientType !== CONSTANTS.ARGENTINA_CODE
        )
      );
    }
  }, [dispatch, selectedProduct, clientType]);

  // Cargar órdenes inmediatamente al seleccionar edición
  useEffect(() => {
    if (selectedEdition) {
      console.log("Cargando órdenes para edición:", selectedEdition);
      // dispatch(
      //   fetchOrdersInit({
      //     editionId: selectedEdition,
      //   })
      // );
    }
  }, [dispatch, selectedEdition]);

  // Extraer opciones de moneda únicas cuando se cargan contratos u órdenes
  useEffect(() => {
    var entityDocuments = [];

    // if (entityType === CONSTANTS.ORDERS_CODE) {
    //   entityDocuments = orders;
    // }

    // Extraer monedas únicas de la opcion seleccionada (contrato u órdenes)
    // const uniqueCurrencies = new Set();
    // entityDocuments.forEach(entityDocument => {
    //   if (entityDocument.currencyName) {
    //     uniqueCurrencies.add(entityDocument.currencyName);
    //   }
    // });

    // // Convertir a array de opciones
    // const currencyOpts = [];
    // uniqueCurrencies.forEach(currency => {
    //   currencyOpts.push({
    //     id: currency,
    //     name: currency,
    //   });
    // });

    // setCurrencyOptions(currencyOpts);
    // }, [orders, selectedCurrency, dispatch]);
  }, [selectedCurrency, dispatch]);

  const handleClientTypeChange = selected => {
    // Reset all selections when client type changes
    dispatch(setClientType(selected.id));
    dispatch(setSelectedProduct(null));
    dispatch(setSelectedEdition(null));
    dispatch(setSelectedCurrency(""));
    setCurrencyOptions([]);
  };

  const handleProductChange = selected => {
    dispatch(setSelectedProduct(selected.id));
    // Reset edition and currency when product changes
    dispatch(setSelectedEdition(null));
    dispatch(setSelectedCurrency(""));
    // Las ediciones se cargan automáticamente en el useEffect
  };

  const handleEditionChange = selected => {
    dispatch(setSelectedEdition(selected.id));
    // Reset currency when edition changes
    dispatch(setSelectedCurrency(""));
    // Las órdenes se cargan automáticamente en el useEffect
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
    {
      id: CONSTANTS.ARGENTINA_CODE,
      name: "Cliente de Argentina",
    },
    {
      id: CONSTANTS.COMTUR_CODE,
      name: "Cliente COMTUR",
    },
  ];

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Filtro de ediciones</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-2 mb-3">
            <InputSelectFieldSimple
              labelText="Tipo de cliente *"
              fontSize="13px"
              name="clientType"
              options={clientTypeOptions}
              value={clientType || ""}
              onChangeHandler={handleClientTypeChange}
              disabled={loading}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
            />
          </div>

          <>
            <div className="col-md-3 mb-3">
              <InputSelectFieldSimple
                labelText="Producto *"
                name="product"
                options={products || []}
                value={selectedProduct || ""}
                onChangeHandler={handleProductChange}
                disabled={loading}
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

            <div className="col-md-2 mb-3">
              <InputSelectFieldSimple
                labelText="Moneda *"
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
        </div>
      </div>
    </div>
  );
};

export default SelectorsContainer;
