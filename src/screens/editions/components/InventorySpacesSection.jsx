import { FieldArray } from 'formik';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import InputMultiSelectField from 'shared/components/InputMultiSelectField';
import FormFieldset from 'shared/components/FormFieldset';
import InputCheckboxField from 'shared/components/InputCheckboxField';

const InventoryContainer = styled.div`
  margin-bottom: 2rem;

  .drag-drop-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .available-spaces {
      width: 100%;

      h5 {
        margin-bottom: 1rem;
        color: #495057;
        font-weight: 600;
        font-size: 1rem;
      }

      .spaces-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.75rem;
        padding: 0.75rem;
        border: 2px dashed #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
        min-height: 80px;
      }
    }

    .drop-zones {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .drop-zone {
        border: 2px solid #007bff;
        border-radius: 8px;
        min-height: 100px;
        padding: 0.75rem;
        background-color: #f8f9fa;

        .zone-header {
          font-weight: bold;
          color: #007bff;
          margin-bottom: 0.5rem;
          text-align: center;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #dee2e6;
          font-size: 0.95rem;
        }

        .cards-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-height: 50px;
        }
      }

      .tapa {
        border-color: #dc3545;
        .zone-header {
          color: #dc3545;
        }
      }

      .interior {
        border-color: #28a745;
        .zone-header {
          color: #28a745;
        }
      }

      .contratapa {
        border-color: #ffc107;
        .zone-header {
          color: #856404;
        }
      }
    }
  }

  .space-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.5rem;
    user-select: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 150px;
    height: 60px;
    position: relative;

    &:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    .drag-handle {
      color: #666;
      cursor: grab;
      font-size: 0.7rem;
      flex-shrink: 0;

      &:hover {
        color: #333;
      }
    }

    .space-name {
      font-size: 0.75rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
      line-height: 1.2;
    }

    .quantity-badge {
      background: #007bff;
      color: white;
      border-radius: 8px;
      padding: 0.15rem 0.4rem;
      font-size: 0.65rem;
      flex-shrink: 0;
      font-weight: 600;
    }

    .label-inputs {
      font-size: 0.75rem;
      overflow: hidden;
      white-space: nowrap;
      min-width: 0;
      line-height: 1.2;
    }
  }

  /* Cards en zonas tienen diferentes dimensiones y controles */
  .drop-zone .space-card {
    width: 100%;
    height: auto;
    min-height: 45px;
    flex-wrap: wrap;

    .page-location-select {
      margin-left: auto;
      margin-right: 0.3rem;
      min-width: 80px;

      .form-group {
        margin-bottom: 0;
      }

      select {
        font-size: 0.7rem;
        padding: 0.2rem 0.15rem;
        height: auto;
        border-radius: 4px;
      }
    }

    .page-selection-container {
      margin-left: auto;
      margin-right: 0.3rem;
      min-width: 100px;

      .form-group {
        margin-bottom: 0;
      }

      button {
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
        height: auto;
      }
    }
  }

  /* Tooltip styling */
  .space-card[title] .space-name {
    cursor: help;

    &:hover {
      color: #0056b3;
    }
  }
`;

const InventorySpacesSection = ({
  formikProps,
  deleteMode,
  getProductAdvertisingSpaces,
  generateInteriorPageOptions,
  handlePageLocationChange,
  handleAllPagesChange,
}) => {
  // Handler para @hello-pangea/dnd
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    // Si se mueve dentro de la misma zona, no hacemos nada por ahora
    if (sourceDroppableId === destinationDroppableId) {
      return;
    }

    // Crear una copia del inventario para manipular
    let updatedInventory = [...formikProps.values.inventoryAdvertisingSpaces];

    if (sourceDroppableId === 'available-spaces') {
      // Mover desde espacios disponibles a una zona
      const spaceId = parseInt(draggableId.replace('space-', ''));
      const targetZone = destinationDroppableId;

      // Encontrar si ya existe un item para este espacio
      const existingItemIndex = updatedInventory.findIndex(
        (item) => item.productAdvertisingSpaceId === spaceId
      );

      if (existingItemIndex !== -1) {
        // Actualizar zona del item existente
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          zone: targetZone,
          order: destination.index,
        };
      } else {
        // Crear nuevo item
        const newItem = {
          productAdvertisingSpaceId: spaceId,
          zone: targetZone,
          order: destination.index,
          quantity: 1,
          pageLocation: targetZone === 'interior' ? 'ambas' : null,
          selectedPages: [],
          allPages: targetZone === 'interior' ? true : false,
        };
        updatedInventory.push(newItem);
      }
    } else {
      // Mover entre zonas
      const spaceId = parseInt(draggableId.replace('space-', ''));
      const targetZone =
        destinationDroppableId === 'available-spaces'
          ? null
          : destinationDroppableId;

      const itemIndex = updatedInventory.findIndex(
        (item) => item.productAdvertisingSpaceId === spaceId
      );

      if (itemIndex !== -1) {
        if (targetZone === null) {
          // Mover de vuelta a espacios disponibles
          updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex],
            zone: null,
            order: 0,
          };
        } else {
          // Mover a otra zona
          updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex],
            zone: targetZone,
            order: destination.index,
          };
        }
      }
    }

    // Reordenar elementos en la zona origen si es necesario
    if (sourceDroppableId !== 'available-spaces') {
      updatedInventory
        .filter((item) => item.zone === sourceDroppableId)
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

    // Actualizar el estado
    formikProps.setFieldValue('inventoryAdvertisingSpaces', updatedInventory);
  };

  return (
    <InventoryContainer>
      <FormFieldset title='Inventario de tipos de espacios'>
        <FieldArray
          name='inventoryAdvertisingSpaces'
          render={() => {
            const currentProductAdvertisingSpaces = getProductAdvertisingSpaces(
              formikProps.values.productId
            );

            if (currentProductAdvertisingSpaces.length === 0) {
              return (
                <div className='alert alert-info'>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className='text-info'
                    style={{ fontSize: '1.25rem' }}
                  />{' '}
                  Seleccione un producto para configurar el inventario de sus
                  tipos de espacios
                </div>
              );
            }

            // Espacios que ya están asignados a alguna zona
            const assignedSpaceIds =
              formikProps.values.inventoryAdvertisingSpaces
                .filter((item) => item.zone && item.zone !== null)
                .map((item) => item.productAdvertisingSpaceId);

            // Espacios disponibles para arrastrar
            const availableSpaces = currentProductAdvertisingSpaces.filter(
              (space) => !assignedSpaceIds.includes(space.id)
            );

            // Obtener espacios por zona
            const getSpacesByZone = (zone) => {
              return formikProps.values.inventoryAdvertisingSpaces
                .filter((item) => item.zone === zone)
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  const space = currentProductAdvertisingSpaces.find(
                    (space) => space.id === item.productAdvertisingSpaceId
                  );
                  return { ...space, inventoryItem: item };
                });
            };

            return (
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className='drag-drop-container'>
                  {/* Espacios disponibles */}
                  <div className='available-spaces'>
                    <h5>Tipos de Espacio Disponibles</h5>
                    <Droppable
                      droppableId='available-spaces'
                      direction='horizontal'
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='spaces-grid'
                          style={{
                            backgroundColor: snapshot.isDraggingOver
                              ? '#e3f2fd'
                              : '#f9f9f9',
                          }}
                        >
                          {availableSpaces.map((space, index) => (
                            <Draggable
                              key={space.id}
                              draggableId={`space-${space.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className='space-card'
                                  title={
                                    space.name.length > 12
                                      ? space.name
                                      : undefined
                                  }
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.5 : 1,
                                    transform: snapshot.isDragging
                                      ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                                      : provided.draggableProps.style
                                          ?.transform,
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faGripVertical}
                                    className='drag-handle'
                                  />
                                  <span className='space-name'>
                                    {space.name}
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>

                  {/* Zonas de drop */}
                  <div className='drop-zones'>
                    {['tapa', 'interior', 'contratapa'].map((zone) => (
                      <Droppable key={zone} droppableId={zone}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`drop-zone ${zone}`}
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? '#e3f2fd'
                                : '#f8f9fa',
                            }}
                          >
                            <div className='zone-header'>
                              {zone.charAt(0).toUpperCase() + zone.slice(1)}
                            </div>
                            <div className='cards-container'>
                              {getSpacesByZone(zone).map((space, index) => {
                                const inventoryItem = space.inventoryItem;
                                const inventoryIndex =
                                  formikProps.values.inventoryAdvertisingSpaces.findIndex(
                                    (item) =>
                                      item.productAdvertisingSpaceId ===
                                      space.id
                                  );

                                return (
                                  <Draggable
                                    key={space.id}
                                    draggableId={`space-${space.id}`}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className='space-card'
                                        title={
                                          space.name.length > 12
                                            ? space.name
                                            : undefined
                                        }
                                        style={{
                                          ...provided.draggableProps.style,
                                          opacity: snapshot.isDragging
                                            ? 0.5
                                            : 1,
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          icon={faGripVertical}
                                          className='drag-handle'
                                        />
                                        <span className='space-name'>
                                          {space.name}
                                        </span>

                                        {/* Controles para zona Interior */}
                                        {zone === 'interior' &&
                                          inventoryItem && (
                                            <>
                                              <span className='label-inputs'>
                                                Cantidad
                                              </span>
                                              <InputTextField
                                                name={`inventoryAdvertisingSpaces[${inventoryIndex}].quantity`}
                                                showLabel={false}
                                                disabled={deleteMode}
                                                type='number'
                                                min='0'
                                                withoutFormGroup={true}
                                                customStyles={{
                                                  height: '35px',
                                                  width: '70px',
                                                  fontSize: '12px',
                                                }}
                                              />
                                              <span className='label-inputs'>
                                                Ubicación
                                              </span>
                                              <div className='page-location-select'>
                                                <InputSelectField
                                                  name={`inventoryAdvertisingSpaces[${inventoryIndex}].pageLocation`}
                                                  showLabel={false}
                                                  disabled={deleteMode}
                                                  options={[
                                                    {
                                                      value: 'ambas',
                                                      label: 'Ambas',
                                                    },
                                                    {
                                                      value: 'izquierda',
                                                      label: 'Izquierda',
                                                    },
                                                    {
                                                      value: 'derecha',
                                                      label: 'Derecha',
                                                    },
                                                  ]}
                                                  withoutFormGroup={true}
                                                  onChange={(e) =>
                                                    handlePageLocationChange(
                                                      e,
                                                      inventoryIndex,
                                                      formikProps.setFieldValue
                                                    )
                                                  }
                                                />
                                              </div>

                                              {/* Selección de páginas específicas */}
                                              {!inventoryItem.allPages &&
                                                inventoryItem.pageLocation && (
                                                  <div className='page-selection-container'>
                                                    <InputMultiSelectField
                                                      name={`inventoryAdvertisingSpaces[${inventoryIndex}].selectedPages`}
                                                      showLabel={false}
                                                      disabled={deleteMode}
                                                      options={generateInteriorPageOptions(
                                                        formikProps.values
                                                          .pageCount,
                                                        inventoryItem.pageLocation
                                                      )}
                                                      withoutFormGroup={true}
                                                    />
                                                  </div>
                                                )}

                                              {/* Checkbox para todas las páginas */}
                                              <InputCheckboxField
                                                name={`inventoryAdvertisingSpaces[${inventoryIndex}].allPages`}
                                                label='Todas las páginas'
                                                disabled={deleteMode}
                                                withoutFormGroup={true}
                                                onChange={(e) =>
                                                  handleAllPagesChange(
                                                    e,
                                                    inventoryIndex,
                                                    formikProps.setFieldValue
                                                  )
                                                }
                                              />
                                            </>
                                          )}

                                        {/* Controles para otras zonas */}
                                        {zone !== 'interior' &&
                                          inventoryItem && (
                                            <>
                                              <span className='label-inputs'>
                                                Cantidad
                                              </span>
                                              <InputTextField
                                                name={`inventoryAdvertisingSpaces[${inventoryIndex}].quantity`}
                                                showLabel={false}
                                                disabled={deleteMode}
                                                type='number'
                                                min='0'
                                                withoutFormGroup={true}
                                                customStyles={{
                                                  height: '35px',
                                                  width: '70px',
                                                  fontSize: '12px',
                                                }}
                                              />
                                            </>
                                          )}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </div>
              </DragDropContext>
            );
          }}
        />
      </FormFieldset>
    </InventoryContainer>
  );
};

export default InventorySpacesSection;
