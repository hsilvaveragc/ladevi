import React, { useSelector, useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import Modal from 'shared/components/Modal';
import InputTextField from 'shared/components/InputTextField';
import InputDatePickerField from 'shared/components/InputDatePickerField';
import InputSelectField from 'shared/components/InputSelectField';
import InputCheckboxField from 'shared/components/InputCheckboxField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

import {
  addEdition,
  editEdition,
  deleteEdition,
  hideEditionsAddModal,
  hideEditionsEditModal,
  hideEditionsDeleteModal,
} from '../actionCreators';
import {
  getProducts,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getSelectedItem,
  getLoading,
} from '../reducer';

import InventorySpacesSection from './InventorySpacesSection';

const EditionsFormContainer = styled.div`
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

  // Estados locales para drag and drop
  const [draggedSpace, setDraggedSpace] = React.useState(null);

  // Función para generar opciones de páginas interiores filtradas por ubicación
  const generateInteriorPageOptions = React.useCallback(
    (pageCount, pageLocation = 'ambas') => {
      if (!pageCount || pageCount <= 2) return [];
      const allPages = [];

      // Generar todas las páginas desde 2 hasta pageCount-1
      for (let i = 2; i <= pageCount - 1; i++) {
        allPages.push(i);
      }

      // Filtrar según la ubicación seleccionada
      switch (pageLocation) {
        case 'pares':
          return allPages.filter((page) => page % 2 === 0);
        case 'impares':
          return allPages.filter((page) => page % 2 !== 0);
        case 'ambas':
        default:
          return allPages;
      }
    },
    []
  );

  // Handler para cambiar selección de todas las páginas
  const handleAllPagesChange = React.useCallback(
    (spaceId, allPages, setFieldValue, values) => {
      const updatedInventory = values.inventoryProductAdvertisingSpaces.map(
        (item) => {
          if (item.productAdvertisingSpaceId === spaceId) {
            const pageOptions = generateInteriorPageOptions(
              values.pageCount,
              item.pageLocation
            );
            return {
              ...item,
              allPages: allPages,
              specificPages: allPages ? [...pageOptions] : [],
            };
          }
          return item;
        }
      );
      setFieldValue('inventoryProductAdvertisingSpaces', updatedInventory);
    },
    [generateInteriorPageOptions]
  );

  // Handler para cambiar páginas específicas
  const handleSpecificPagesChange = React.useCallback(
    (spaceId, pageNumber, isChecked, setFieldValue, values) => {
      const updatedInventory = values.inventoryProductAdvertisingSpaces.map(
        (item) => {
          if (item.productAdvertisingSpaceId === spaceId) {
            let newSpecificPages = [...item.specificPages];
            if (isChecked) {
              if (!newSpecificPages.includes(pageNumber)) {
                newSpecificPages.push(pageNumber);
              }
            } else {
              newSpecificPages = newSpecificPages.filter(
                (page) => page !== pageNumber
              );
            }

            // Verificar si todas las páginas están seleccionadas
            const pageOptions = generateInteriorPageOptions(
              values.pageCount,
              item.pageLocation
            );
            const allSelected = pageOptions.every((page) =>
              newSpecificPages.includes(page)
            );

            return {
              ...item,
              specificPages: newSpecificPages,
              allPages: allSelected,
            };
          }
          return item;
        }
      );
      setFieldValue('inventoryProductAdvertisingSpaces', updatedInventory);
    },
    [generateInteriorPageOptions]
  );

  // Determinar qué modal está abierto
  const isModalOpen = showAddModal || showEditModal || showDeleteModal;

  // Determinar el modo
  const addMode = showAddModal;
  const editMode = showEditModal;
  const deleteMode = showDeleteModal;

  // Handler para cambiar ubicación de páginas
  const handlePageLocationChange = React.useCallback(
    (spaceId, location, setFieldValue, values) => {
      const updatedInventory = values.inventoryProductAdvertisingSpaces.map(
        (item) => {
          if (item.productAdvertisingSpaceId === spaceId) {
            // Generar nuevas páginas disponibles según la nueva ubicación
            const newPageOptions = generateInteriorPageOptions(
              values.pageCount,
              location
            );

            // Filtrar las páginas específicas existentes para que solo incluyan páginas válidas
            const filteredSpecificPages = item.specificPages.filter((page) =>
              newPageOptions.includes(page)
            );

            // Verificar si todas las páginas de la nueva ubicación están seleccionadas
            const allSelected = newPageOptions.every((page) =>
              filteredSpecificPages.includes(page)
            );

            return {
              ...item,
              pageLocation: location,
              specificPages: filteredSpecificPages,
              allPages: allSelected && newPageOptions.length > 0,
            };
          }
          return item;
        }
      );
      setFieldValue('inventoryProductAdvertisingSpaces', updatedInventory);
    },
    [generateInteriorPageOptions]
  );

  // Función para obtener productAdvertisingSpaces según el modo y producto seleccionado
  const getProductAdvertisingSpaces = React.useCallback(
    (productId) => {
      if (addMode) {
        const selectedProduct = productsAvailable.find(
          (p) => p.id === productId
        );
        return selectedProduct?.productAdvertisingSpaces || [];
      } else {
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
        return productAdvertisingSpaces.map((space) => ({
          id: 0,
          productAdvertisingSpaceId: space.id,
          productEditionId: 0,
          quantity: 0,
          zone: null,
          order: 0,
          pageLocation: 'ambas',
          specificPages: [],
          allPages: true,
        }));
      } else {
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
            zone: existingItem?.zone || null,
            order: existingItem?.order || 0,
            pageLocation: existingItem?.pageLocation || 'ambas',
            specificPages: existingItem?.specificPages || [],
            allPages:
              existingItem?.allPages !== undefined
                ? existingItem.allPages
                : true,
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

  // Handlers para drag and drop
  const handleDragStart = (e, space, currentZone = null) => {
    const spaceData = { ...space, currentZone };
    setDraggedSpace(spaceData);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    const container = e.currentTarget;
    container.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    const container = e.currentTarget;
    container.classList.remove('drag-over');
  };

  const handleDrop = (e, targetZone, setFieldValue, values) => {
    e.preventDefault();
    const container = e.currentTarget;
    container.classList.remove('drag-over');

    if (!draggedSpace) return;

    // Crear una copia del inventario para manipular
    const updatedInventory = [...values.inventoryProductAdvertisingSpaces];

    // Encontrar el item que se está moviendo
    const draggedItemIndex = updatedInventory.findIndex(
      (item) => item.productAdvertisingSpaceId === draggedSpace.id
    );

    if (draggedItemIndex === -1) return;

    // Si viene de otra zona, reordenar la zona origen
    if (draggedSpace.currentZone && draggedSpace.currentZone !== targetZone) {
      // Reordenar elementos restantes en la zona origen
      updatedInventory
        .filter(
          (item) =>
            item.zone === draggedSpace.currentZone &&
            item.productAdvertisingSpaceId !== draggedSpace.id
        )
        .sort((a, b) => a.order - b.order)
        .forEach((item, index) => {
          const itemIndex = updatedInventory.findIndex(
            (inv) =>
              inv.productAdvertisingSpaceId === item.productAdvertisingSpaceId
          );
          if (itemIndex !== -1) {
            updatedInventory[itemIndex] = {
              ...updatedInventory[itemIndex],
              order: index,
            };
          }
        });
    }

    // Calcular nuevo orden en la zona destino
    const targetZoneItems = updatedInventory.filter(
      (item) =>
        item.zone === targetZone &&
        item.productAdvertisingSpaceId !== draggedSpace.id
    );
    const newOrder = targetZoneItems.length;

    // Actualizar el item arrastrado
    updatedInventory[draggedItemIndex] = {
      ...updatedInventory[draggedItemIndex],
      zone: targetZone,
      quantity: updatedInventory[draggedItemIndex].quantity || 1,
      order: newOrder,
    };

    setFieldValue('inventoryProductAdvertisingSpaces', updatedInventory);
    setDraggedSpace(null);
  };

  // Handler para guardar
  const handleSubmit = (values) => {
    const payload = {
      ...values,
      params: {},
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

    // Limpiar estados locales
    setDraggedSpace(null);
  };

  return (
    <Modal
      shouldClose={true}
      closeHandler={handleClose}
      isOpen={isModalOpen}
      size='md'
    >
      <EditionsFormContainer className='container'>
        <h3>
          {addMode ? 'Agregar Edición' : null}
          {editMode ? 'Editar Edición' : null}
          {deleteMode ? 'Eliminar Edición' : null}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formikProps) => (
            <Form>
              <div className='form-row'>
                <div className='col-md-6'>
                  <InputTextField
                    labelText='Código:'
                    name='code'
                    disabled={deleteMode}
                    error={errors.code}
                  />
                </div>
                <div className='col-md-6'>
                  <InputTextField
                    labelText='Nombre:'
                    name='name'
                    disabled={deleteMode}
                    error={errors.name}
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
              <div className='form-row'>
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

              <InventorySpacesSection
                formikProps={formikProps}
                deleteMode={deleteMode}
                getProductAdvertisingSpaces={getProductAdvertisingSpaces}
                generateInteriorPageOptions={generateInteriorPageOptions}
                handlePageLocationChange={handlePageLocationChange}
                handleAllPagesChange={handleAllPagesChange}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragEnter={handleDragEnter}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
              />

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
