import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputSelectFieldSimple from 'shared/components/InputSelectFieldSimple';

import {
  fetchProducts,
  fetchEditions,
  setSelectedProduct,
  setSelectedEdition,
  fetchProductionTemplates,
} from '../actionCreators';
import {
  getLoading,
  getProducts,
  getEditions,
  getSelectedProduct,
  getSelectedEdition,
} from '../reducer';

const SelectorsContainer = () => {
  const dispatch = useDispatch();

  /* Estados globales */
  const loading = useSelector(getLoading);

  /* Estados para el manejo de productos y ediciones */
  const products = useSelector(getProducts);
  const editions = useSelector(getEditions);
  const selectedProduct = useSelector(getSelectedProduct);
  const selectedEdition = useSelector(getSelectedEdition);

  // Cargar productos cuando carga la página
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Cargar ediciones cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchEditions(selectedProduct));
    }
  }, [dispatch, selectedProduct]);

  // Cargar production templates inmediatamente al seleccionar edición
  useEffect(() => {
    if (selectedEdition) {
      dispatch(fetchProductionTemplates(selectedEdition));
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
        <h5 className='mb-0'>Selección de Producto y Edición</h5>
        <small className='text-muted'>
          Selecciona el producto y edición para gestionar la producción
        </small>
      </div>
      <div className='card-body'>
        <div className='row'>
          <div className='col-md-4 mb-3'>
            <InputSelectFieldSimple
              labelText='Producto *'
              name='product'
              options={products || []}
              value={selectedProduct || ''}
              onChangeHandler={handleProductChange}
              disabled={loading}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              placeholderText='Seleccionar producto...'
            />
          </div>

          <div className='col-md-4 mb-3'>
            <InputSelectFieldSimple
              labelText='Edición *'
              name='edition'
              options={editions || []}
              value={selectedEdition || ''}
              onChangeHandler={handleEditionChange}
              disabled={loading || !selectedProduct}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              getOptionValue={(option) => option.id}
              placeholderText='Seleccionar edición...'
            />
          </div>
        </div>

        {/* {selectedEdition && (
          <div className='row'>
            <div className='col-md-12'>
              <div className='alert alert-info mb-0'>
                <strong>Edición seleccionada:</strong> {selectedEdition.name}
                {selectedEdition.description && (
                  <>
                    <br />
                    <small>{selectedEdition.description}</small>
                  </>
                )}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SelectorsContainer;
