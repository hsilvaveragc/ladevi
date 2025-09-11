import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import Modal from "shared/components/Modal";
import InputTextField from "shared/components/InputTextField";
import InputDatePickerField from "shared/components/InputDatePickerField";
import InputSelectField from "shared/components/InputSelectField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import { SaveButton, DangerButton } from "shared/components/Buttons";
import InventorySpacesSection from "./InventorySpacesSection";
import {
  addEdition,
  editEdition,
  deleteEdition,
  hideEditionsAddModal,
  hideEditionsEditModal,
  hideEditionsDeleteModal,
} from "../actionCreators";
import {
  getProducts,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getSelectedItem,
  getLoading,
} from "../reducer";

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

  // Determinar qué modal está abierto
  const isModalOpen = showAddModal || showEditModal || showDeleteModal;

  // Determinar el modo
  const addMode = showAddModal;
  const editMode = showEditModal;
  const deleteMode = showDeleteModal;

  // Función para generar opciones de páginas interiores filtradas por ubicación
  const generateInteriorPageOptions = React.useCallback(
    (pageCount, pageLocation = "ambas") => {
      if (!pageCount || pageCount <= 2) return [];
      const allPages = [];

      // Generar páginas según pageLocation
      for (let i = 3; i <= pageCount; i++) {
        if (pageLocation === "ambas") {
          allPages.push({ value: i, label: `Página ${i}` });
        } else if (pageLocation === "izquierda" && i % 2 === 1) {
          allPages.push({ value: i, label: `Página ${i}` });
        } else if (pageLocation === "derecha" && i % 2 === 0) {
          allPages.push({ value: i, label: `Página ${i}` });
        }
      }

      return allPages;
    },
    []
  );

  // Función para obtener los espacios publicitarios del producto
  const getProductAdvertisingSpaces = React.useCallback(
    (productId) => {
      if (!productId || productId === -1) return [];
      const product = productsAvailable.find((p) => p.id === productId);
      return product?.productAdvertisingSpaces || [];
    },
    [productsAvailable]
  );

  // Función para crear inventario inicial
  const createInitialInventory = React.useCallback(
    (productId) => {
      const spaces = getProductAdvertisingSpaces(productId);

      if (addMode) {
        // Modo agregar: crear inventario vacío
        return spaces.map((space) => ({
          productAdvertisingSpaceId: space.id,
          quantity: 0,
          zone: null,
          order: 0,
          pageLocation: null,
          selectedPages: [],
          allPages: true,
        }));
      } else {
        // Modo editar: mantener inventario existente o crear nuevo
        return spaces.map((space) => {
          const existingItem = selectedItem.inventoryProductAdvertisingSpaces?.find(
            (item) => item.productAdvertisingSpaceId === space.id
          );

          return existingItem
            ? {
                ...existingItem,
                selectedPages: existingItem.selectedPages || [],
                allPages:
                  existingItem.allPages !== undefined
                    ? existingItem.allPages
                    : true,
              }
            : {
                productAdvertisingSpaceId: space.id,
                quantity: 0,
                zone: null,
                order: 0,
                pageLocation: null,
                selectedPages: [],
                allPages: true,
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
      code: selectedItem.code || "",
      name: selectedItem.name || "",
      productId: selectedItem.productId || -1,
      closed: selectedItem.closed || false,
      end: selectedItem.end || "",
      pageCount: selectedItem.pageCount || "",
      inventoryProductAdvertisingSpaces: createInitialInventory(
        selectedItem.productId || -1
      ),
    }),
    [selectedItem, addMode, createInitialInventory]
  );

  // Esquema de validación
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    code: Yup.string().required("El código es requerido"),
    productId: Yup.number()
      .required("El producto es requerido")
      .min(1, "Debe seleccionar un producto"),
    end: Yup.string().required("La fecha de cierre es requerida"),
    pageCount: Yup.number(),
    inventoryProductAdvertisingSpaces: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number().min(0, "La cantidad debe ser mayor o igual a 0"),
      })
    ),
  });

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

  // Handler para cambio de ubicación de página
  const handlePageLocationChange = (e, inventoryIndex, setFieldValue) => {
    const newPageLocation = e.target.value;
    setFieldValue(
      `inventoryProductAdvertisingSpaces[${inventoryIndex}].pageLocation`,
      newPageLocation
    );
    // Limpiar páginas seleccionadas al cambiar ubicación
    setFieldValue(
      `inventoryProductAdvertisingSpaces[${inventoryIndex}].selectedPages`,
      []
    );
  };

  // Handler para cambio de "todas las páginas"
  const handleAllPagesChange = (e, inventoryIndex, setFieldValue) => {
    const allPages = e.target.checked;
    setFieldValue(
      `inventoryProductAdvertisingSpaces[${inventoryIndex}].allPages`,
      allPages
    );
    if (allPages) {
      // Si se selecciona "todas las páginas", limpiar selección específica
      setFieldValue(
        `inventoryProductAdvertisingSpaces[${inventoryIndex}].selectedPages`,
        []
      );
    }
  };

  // Función para obtener el título del modal
  const getModalTitle = () => {
    if (addMode) return "Agregar Edición";
    if (editMode) return "Editar Edición";
    if (deleteMode) return "Eliminar Edición";
    return "";
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={getModalTitle()}
      size="large"
    >
      <EditionsFormContainer>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formikProps) => (
            <Form>
              {deleteMode ? (
                <p>
                  ¿Está seguro que desea eliminar la edición "
                  {selectedItem.name}"?
                </p>
              ) : (
                <>
                  <InputTextField
                    name="name"
                    label="Nombre"
                    disabled={deleteMode}
                    required
                  />

                  <InputTextField
                    name="code"
                    label="Código"
                    disabled={deleteMode}
                    required
                  />

                  <InputSelectField
                    name="productId"
                    label="Producto"
                    disabled={deleteMode}
                    options={[
                      { value: -1, label: "Seleccione un producto" },
                      ...productsAvailable.map((product) => ({
                        value: product.id,
                        label: product.name,
                      })),
                    ]}
                    required
                    onChange={(e) => {
                      const newProductId = parseInt(e.target.value);
                      formikProps.setFieldValue("productId", newProductId);

                      // Reinicializar inventario cuando cambia el producto
                      if (newProductId !== -1) {
                        const newInventory = createInitialInventory(
                          newProductId
                        );
                        formikProps.setFieldValue(
                          "inventoryProductAdvertisingSpaces",
                          newInventory
                        );
                      }
                    }}
                  />

                  <InputDatePickerField
                    name="end"
                    label="Fecha de cierre"
                    disabled={deleteMode}
                    required
                  />

                  <InputTextField
                    name="pageCount"
                    label="Cantidad de páginas"
                    disabled={deleteMode}
                    type="number"
                    min="1"
                  />

                  <IsClosedCheckBoxContainer>
                    <InputCheckboxField
                      name="closed"
                      label="Cerrada"
                      disabled={deleteMode}
                    />
                  </IsClosedCheckBoxContainer>

                  <InventorySpacesSection
                    formikProps={formikProps}
                    deleteMode={deleteMode}
                    getProductAdvertisingSpaces={getProductAdvertisingSpaces}
                    generateInteriorPageOptions={generateInteriorPageOptions}
                    handlePageLocationChange={handlePageLocationChange}
                    handleAllPagesChange={handleAllPagesChange}
                  />
                </>
              )}

              <div className="button-container">
                {deleteMode ? (
                  <>
                    <SaveButton onClickHandler={handleClose}>
                      Cancelar
                    </SaveButton>
                    <DangerButton type="submit" loading={isLoading}>
                      Eliminar
                    </DangerButton>
                  </>
                ) : (
                  <>
                    <DangerButton onClickHandler={handleClose}>
                      Cancelar
                    </DangerButton>
                    <SaveButton type="submit" loading={isLoading}>
                      {addMode ? "Agregar" : null}
                      {editMode ? "Guardar" : null}
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
