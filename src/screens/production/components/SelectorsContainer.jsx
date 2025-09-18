import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputSelectFieldSimple from 'shared/components/InputSelectFieldSimple';

import { CONSTANTS } from '../constants';
import {
  fetchProductsInit,
  fetchEditionsInit,
  setSelectedProduct,
  setSelectedEdition,
  fetchProductionItems,
} from '../actionCreators';
import {
  getLoading,
  getProducts,
  getEditions,
  getSelectedProduct,
  getSelectedEdition,
  getProductionItems,
} from '../reducer';

const SelectorsContainer = () => {
  const dispatch = useDispatch();

  /* Estados globales */
  const loading = useSelector(getLoading);

  /* Estados para el manejo de ordenes*/
  const products = useSelector(getProducts);
  const editions = useSelector(getEditions);
  const selectedProduct = useSelector(getSelectedProduct);
  const selectedEdition = useSelector(getSelectedEdition);
  const productionItems = useSelector(getProductionItems);

  // Cargar productos cuando carga la pagina
  useEffect(() => {
    dispatch(fetchProductsInit());
  }, []);

  // Cargar ediciones cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchEditionsInit(selectedProduct));
    }
  }, [dispatch, selectedProduct]);

  // Cargar órdenes inmediatamente al seleccionar edición
  useEffect(() => {
    if (selectedEdition) {
      dispatch(
        fetchProductionItems({
          editionId: selectedEdition,
        })
      );
    }
  }, [dispatch, selectedEdition]);

  const handleProductChange = (selected) => {
    dispatch(setSelectedProduct(selected.id));
    dispatch(setSelectedEdition(null));
  };

  const handleEditionChange = (selected) => {
    dispatch(setSelectedEdition(selected.id));
  };

  return (
    <div className='card mb-4'>
      <div className='card-header'>
        <h5 className='mb-0'>Filtro de ediciones</h5>
      </div>
      <div className='card-body'>
        <div className='row'>
          <div className='col-md-3 mb-3'>
            <InputSelectFieldSimple
              labelText='Producto *'
              name='product'
              options={products || []}
              value={selectedProduct || ''}
              onChangeHandler={handleProductChange}
              disabled={loading}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>

          <div className='col-md-3 mb-3'>
            <InputSelectFieldSimple
              labelText='Edición *'
              name='edition'
              options={editions || []}
              value={selectedEdition || ''}
              onChangeHandler={handleEditionChange}
              disabled={loading || !selectedProduct}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              getOptionValue={(option) => option.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectorsContainer;
