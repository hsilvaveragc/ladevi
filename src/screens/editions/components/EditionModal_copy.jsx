import React, { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'shared/components/Modal';
import InputTextField from 'shared/components/InputTextField';
import InputDatePickerField from 'shared/components/InputDatePickerField';
import InputSelectField from 'shared/components/InputSelectField';
import InputCheckboxField from 'shared/components/InputCheckboxField';
import FormFieldset from 'shared/components/FormFieldset';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

import {
  getProducts,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getSelectedItem,
  getLoading,
} from '../reducer';
import {
  addEdition,
  editEdition,
  deleteEdition,
  hideEditionsAddModal,
  hideEditionsEditModal,
  hideEditionsDeleteModal,
} from '../actionCreators';

const EditionsFormContainer = styled.div`
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .inventory-container {
    margin-top: 1rem;
    .form-row {
      margin: 0;
      margin-bottom: 0.5rem;
    }
    .form-group {
      margin: 0;
    }
    .inventory-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      .space-name {
        flex: 1;
        font-weight: 500;
        margin-right: 1rem;
      }
      .quantity-input {
        width: 100px;
      }
    }
  }
`;

const IsClosedCheckBoxContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: end;
  justify-content: flex-end;
`;

const EditionModal = () => {
  const dispatch = useDispatch();

  // Estados del Redux store
  const showAddModal = useSelector(getShowAddModal);
  const showEditModal = useSelector(getShowEditModal);
  const showDeleteModal = useSelector(getShowDeleteModal);
  const selectedItem = useSelector(getSelectedItem);
  const productsAvailable = useSelector(getProducts);
  const errors = useSelector(getErrors);
  const isLoading = useSelector(getLoading);

  // Determinar qué modal está abierto
  const isModalOpen = showAddModal || showEditModal || showDeleteModal;

  // Determinar el modo
  const addMode = showAddModal;
  const editMode = showEditModal;
  const deleteMode = showDeleteModal;

  // Handler para guardar
  const handleSubmit = (values) => {
    const payload = {
      ...values,
      params: {}, // para filtros posteriores si es necesario
    };

    if (addMode) {
      dispatch(addEdition(payload));
    } else if (editMode) {
      dispatch(editEdition(payload));
    } else if (deleteMode) {
      dispatch(deleteEdition(payload));
    }
  };

  // Handler para cerrar
  const handleClose = () => {
    if (addMode) {
      dispatch(hideEditionsAddModal());
    } else if (editMode) {
      dispatch(hideEditionsEditModal());
    } else if (deleteMode) {
      dispatch(hideEditionsDeleteModal());
    }
  };

  // Función para obtener productAdvertisingSpaces según el modo y producto seleccionado
  const getProductAdvertisingSpaces = React.useCallback(
    (productId) => {
      if (addMode) {
        // En modo alta, buscar en productsAvailable por el productId
        const selectedProduct = productsAvailable.find(
          (p) => p.id === productId
        );
        return selectedProduct?.productAdvertisingSpaces || [];
      } else {
        // En modo edición/eliminación, usar los del selectedItem
        return selectedItem.productAdvertisingSpaces || [];
      }
    },
    [addMode, productsAvailable, selectedItem.productAdvertisingSpaces]
  );

  // Crear inventoryProductAdvertisingSpaces inicial basado en productAdvertisingSpaces
  const createInitialInventory = React.useCallback(
    (productId) => {
      const productAdvertisingSpaces = getProductAdvertisingSpaces(productId);

      if (addMode) {
        // En modo alta, crear con cantidades en 0
        return productAdvertisingSpaces.map((space) => ({
          id: 0,
          productAdvertisingSpaceId: space.id,
          productEditionId: 0,
          quantity: 0,
        }));
      } else {
        // En modo edición/eliminación, usar valores existentes
        const existingInventory =
          selectedItem.inventoryProductAdvertisingSpaces || [];

        return productAdvertisingSpaces.map((space) => {
          const existingItem = existingInventory.find(
            (item) => item.productAdvertisingSpaceId === space.id
          );

          return {
            id: existingItem?.id || 0,
            productAdvertisingSpaceId: space.id,
            productEditionId: selectedItem.id || 0,
            quantity: existingItem?.quantity || 0,
          };
        });
      }
    },
    [addMode, selectedItem, getProductAdvertisingSpaces]
  );

  // Valores iniciales del formulario
  const initialValues = React.useMemo(
    () => ({
      id: selectedItem.id || 0,
      code: selectedItem.code || '',
      name: selectedItem.name || '',
      productId: selectedItem.productId || -1,
      closed: selectedItem.closed || false,
      end: selectedItem.end || '',
      pageCount: selectedItem.pageCount || '',
      inventoryProductAdvertisingSpaces: createInitialInventory(
        selectedItem.productId || -1
      ),
    }),
    [selectedItem, addMode, createInitialInventory]
  );

  // Esquema de validación
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    code: Yup.string().required('El código es requerido'),
    productId: Yup.number()
      .required('El producto es requerido')
      .min(1, 'Debe seleccionar un producto'),
    end: Yup.string().required('La fecha de cierre es requerida'),
    pageCount: Yup.number(),
    inventoryProductAdvertisingSpaces: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
      })
    ),
  });

  return (
    <Modal
      shouldClose={true}
      closeHandler={handleClose}
      isOpen={isModalOpen}
      size='sm'
    >
      <EditionsFormContainer className='container'>
        <h3>
          {addMode ? 'Agregar Edición' : null}
          {editMode ? 'Editar Edición' : null}
          {deleteMode ? 'Eliminar Edición' : null}
        </h3>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {(formikProps) => (
            <Form autoComplete='off'>
              <div className='form-row'>
                <div className='col-md-12'>
                  <InputTextField
                    labelText='Título:'
                    name='name'
                    disabled={deleteMode}
                    error={errors.name}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='col-md-12'>
                  <InputTextField
                    labelText='Código:'
                    name='code'
                    disabled={deleteMode}
                    error={errors.code}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='col-md-12'>
                  <InputSelectField
                    labelText='Pertenece a:'
                    name='productId'
                    options={productsAvailable}
                    disabled={deleteMode || editMode}
                    error={errors.productId}
                    onChangeHandler={(selectedProduct) => {
                      if (addMode && selectedProduct) {
                        formikProps.setFieldValue(
                          'productId',
                          selectedProduct.id
                        );
                        // Actualizar inventoryProductAdvertisingSpaces cuando cambie el producto
                        const newInventory = createInitialInventory(
                          selectedProduct.id
                        );
                        formikProps.setFieldValue(
                          'inventoryProductAdvertisingSpaces',
                          newInventory
                        );
                      }
                    }}
                  />
                </div>
              </div>
              <div className='form-group form-row'>
                <div className='col-md-4'>
                  <InputDatePickerField
                    labelText='Fecha Salida:'
                    error={errors.end}
                    name='end'
                    disabled={deleteMode}
                  />
                </div>
                <div className='col-md-4'>
                  <InputTextField
                    labelText='Cantidad de páginas:'
                    name='pageCount'
                    disabled={deleteMode}
                    error={errors.code}
                  />
                </div>
                <IsClosedCheckBoxContainer className='col-md-4'>
                  <div className='form-group'>
                    <InputCheckboxField
                      name='closed'
                      labelText='Edición cerrada'
                      inline={true}
                      error={errors.closed}
                      disabled={deleteMode}
                    />
                  </div>
                </IsClosedCheckBoxContainer>
              </div>
              <div className='inventory-container'>
                <FormFieldset title='Configuración de inventario'>
                  <FieldArray
                    name='inventoryProductAdvertisingSpaces'
                    render={() => {
                      const currentProductAdvertisingSpaces =
                        getProductAdvertisingSpaces(
                          formikProps.values.productId
                        );

                      return (
                        <>
                          {currentProductAdvertisingSpaces.length === 0 && (
                            <div className='alert alert-info'>
                              <FontAwesomeIcon
                                icon={faInfoCircle}
                                className='text-info'
                                style={{ fontSize: '1.25rem' }}
                              />{' '}
                              Seleccione un producto para configurar el
                              inventario de sus tipos de espacios
                            </div>
                          )}
                          {currentProductAdvertisingSpaces.map(
                            (space, index) => {
                              const inventoryIndex =
                                formikProps.values.inventoryProductAdvertisingSpaces.findIndex(
                                  (item) =>
                                    item.productAdvertisingSpaceId === space.id
                                );

                              if (inventoryIndex === -1) return null;

                              return (
                                <div key={space.id} className='inventory-item'>
                                  <div className='space-name'>{space.name}</div>
                                  <div className='quantity-input'>
                                    <InputTextField
                                      name={`inventoryProductAdvertisingSpaces[${inventoryIndex}].quantity`}
                                      showLabel={false}
                                      disabled={deleteMode}
                                      type='number'
                                      min='0'
                                    />
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </>
                      );
                    }}
                  />
                </FormFieldset>
              </div>
              <div className='button-container'>
                {deleteMode ? (
                  <>
                    <SaveButton onClickHandler={handleClose}>
                      Cancelar
                    </SaveButton>
                    <DangerButton type='submit' loading={isLoading}>
                      Eliminar
                    </DangerButton>
                  </>
                ) : (
                  <>
                    <DangerButton onClickHandler={handleClose}>
                      Cancelar
                    </DangerButton>
                    <SaveButton type='submit' loading={isLoading}>
                      {addMode ? 'Agregar' : null}
                      {editMode ? 'Guardar' : null}
                    </SaveButton>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </EditionsFormContainer>
    </Modal>
  );
};

export default EditionModal;
