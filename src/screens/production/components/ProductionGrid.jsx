import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faGripVertical,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import {
  fetchProductionTemplates,
  moveSlot,
  addSlot,
  removeSlot,
  updateSlotObservation,
  markSlotAsEditorial,
  markSlotAsCA,
} from '../actionCreators';
import {
  getProductionTemplates,
  getLoading,
  getErrors,
  getTotalPages,
  getTotalSlots,
  getSelectedEdition,
} from '../reducer';

const ProductionGridContainer = styled.div`
  padding: 20px 0;

  .page-header {
    margin-bottom: 24px;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 16px;

    h2 {
      margin: 0;
      color: #343a40;
      font-size: 24px;
      font-weight: 600;
    }

    .stats {
      margin-top: 8px;
      color: #6c757d;
      font-size: 14px;
    }
  }

  .production-table {
    width: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #dee2e6;

    .table-header {
      background-color: #f8f9fa;
      padding: 12px 16px;
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
      color: #495057;

      .header-row {
        display: flex;
        align-items: center;

        .page-col {
          width: 80px;
          text-align: center;
        }

        .content-col {
          flex: 1;
          text-align: center;
        }

        .actions-col {
          width: 120px;
          text-align: center;
        }
      }
    }
  }

  .page-row {
    display: flex;
    border-bottom: 1px solid #dee2e6;
    min-height: 120px;

    &:hover {
      background-color: #f8f9fa;
    }

    .page-number {
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e9ecef;
      font-weight: 600;
      font-size: 16px;
      color: #495057;
      border-right: 1px solid #dee2e6;
    }

    .page-content {
      flex: 1;
      padding: 12px;
    }

    .page-actions {
      width: 120px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 12px 8px;
      border-left: 1px solid #dee2e6;
    }
  }

  .slots-container {
    min-height: 80px;
    border: 2px dashed #ced4da;
    border-radius: 6px;
    background-color: #f8f9fa;
    padding: 8px;

    &.drag-over {
      border-color: #007bff;
      background-color: #e7f3ff;
    }

    .empty-message {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      color: #6c757d;
      font-style: italic;
      font-size: 14px;
    }
  }

  .production-slot {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 8px;
    margin-bottom: 6px;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &.is-dragging {
      opacity: 0.5;
    }

    .slot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      .drag-handle {
        color: #6c757d;
        cursor: grab;
      }

      .slot-number {
        font-weight: 600;
        color: #495057;
        font-size: 12px;
      }

      .slot-actions {
        display: flex;
        gap: 4px;
      }
    }

    .slot-content {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      align-items: center;
      font-size: 12px;

      .space-name {
        font-weight: 600;
        color: #495057;
      }

      .assignment-info {
        color: #28a745;
        font-size: 11px;
        font-style: italic;

        &.empty {
          color: #6c757d;
        }
      }

      .type-badge {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;

        &.publicidad {
          background-color: #007bff;
          color: white;
        }

        &.editorial {
          background-color: #28a745;
          color: white;
        }

        &.ca {
          background-color: #ffc107;
          color: #212529;
        }
      }
    }

    .slot-observation {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid #f1f3f4;

      .observation-display {
        color: #6c757d;
        font-style: italic;
        cursor: pointer;
        font-size: 11px;
        padding: 2px 4px;
        border-radius: 3px;

        &:hover {
          background-color: #e9ecef;
        }

        &.empty {
          color: #adb5bd;
        }
      }

      .observation-input {
        width: 100%;
        padding: 2px 4px;
        border: 1px solid #ced4da;
        border-radius: 3px;
        font-size: 11px;
      }
    }
  }

  .add-slot-btn {
    width: 100%;
    padding: 8px;
    border: 2px dashed #6c757d;
    background: transparent;
    border-radius: 4px;
    color: #6c757d;
    cursor: pointer;
    font-size: 12px;
    margin-top: 8px;

    &:hover {
      border-color: #007bff;
      color: #007bff;
      background-color: #f8f9fa;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-sm {
    padding: 2px 6px;
    font-size: 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;

    &.btn-danger {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: #c82333;
      }
    }

    &.btn-success {
      background-color: #28a745;
      color: white;

      &:hover {
        background-color: #218838;
      }
    }

    &.btn-secondary {
      background-color: #6c757d;
      color: white;

      &:hover {
        background-color: #5a6268;
      }
    }
  }

  .page-summary {
    margin-top: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #dee2e6;

    .summary-stats {
      display: flex;
      gap: 24px;

      .stat {
        text-align: center;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #495057;
        }

        .stat-label {
          font-size: 12px;
          color: #6c757d;
          margin-top: 4px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .production-slot .slot-content {
      grid-template-columns: 1fr;
      gap: 4px;
    }

    .page-summary .summary-stats {
      flex-direction: column;
      gap: 12px;
    }
  }
`;

const ProductionGrid = ({ match }) => {
  const dispatch = useDispatch();

  // Estado local para edición de observaciones
  const [editingObservation, setEditingObservation] = useState(null);
  const observationInputRef = useRef(null);

  // Selectors
  const loading = useSelector(getLoading);
  const errors = useSelector(getErrors);
  const productionTemplates = useSelector(getProductionTemplates);
  const totalPages = useSelector(getTotalPages);
  const totalSlots = useSelector(getTotalSlots);
  const selectedEdition = useSelector(getSelectedEdition);

  // Cargar datos cuando hay una edición seleccionada
  useEffect(() => {
    if (selectedEdition?.id) {
      dispatch(fetchProductionTemplates(selectedEdition.id));
    }
  }, [dispatch, selectedEdition]);

  // Manejar drag and drop
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // No hacer nada si no hay destino
    if (!destination) {
      return;
    }

    // No hacer nada si se soltó en la misma posición
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Extraer información de los IDs
    const sourceTemplateId = parseInt(source.droppableId.split('-')[1]);
    const targetTemplateId = parseInt(destination.droppableId.split('-')[1]);
    const slotId = parseInt(draggableId.split('-')[1]);

    // Dispatch de la acción de mover slot
    dispatch(
      moveSlot(
        slotId,
        sourceTemplateId,
        source.index + 1, // slotNumber empieza en 1
        targetTemplateId,
        destination.index + 1
      )
    );
  };

  // Manejar agregar slot
  const handleAddSlot = (templateId, inventorySpaceId = 1) => {
    dispatch(addSlot(templateId, inventorySpaceId));
  };

  // Manejar remover slot
  const handleRemoveSlot = (slotId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este slot?')) {
      dispatch(removeSlot(slotId));
    }
  };

  // Manejar edición de observación
  const handleEditObservation = (slotId, currentObservation) => {
    setEditingObservation({
      slotId,
      value: currentObservation || '',
    });
  };

  const handleSaveObservation = () => {
    if (editingObservation) {
      dispatch(
        updateSlotObservation(
          editingObservation.slotId,
          editingObservation.value
        )
      );
      setEditingObservation(null);
    }
  };

  const handleCancelObservation = () => {
    setEditingObservation(null);
  };

  // Manejar cambio de tipo
  const handleTypeChange = (slotId, type) => {
    switch (type) {
      case 'editorial':
        dispatch(markSlotAsEditorial(slotId, true));
        dispatch(markSlotAsCA(slotId, false));
        break;
      case 'ca':
        dispatch(markSlotAsCA(slotId, true));
        dispatch(markSlotAsEditorial(slotId, false));
        break;
      case 'publicidad':
      default:
        dispatch(markSlotAsEditorial(slotId, false));
        dispatch(markSlotAsCA(slotId, false));
        break;
    }
  };

  // Obtener tipo de slot
  const getSlotType = (slot) => {
    if (slot.isEditorial) return 'editorial';
    if (slot.isCA) return 'ca';
    return 'publicidad';
  };

  // Renderizar un slot individual
  const renderSlot = (slot, index) => {
    const slotType = getSlotType(slot);
    const isEditingThis = editingObservation?.slotId === slot.id;

    return (
      <Draggable
        key={`slot-${slot.id}`}
        draggableId={`slot-${slot.id}`}
        index={index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`production-slot ${snapshot.isDragging ? 'is-dragging' : ''}`}
          >
            <div className='slot-header'>
              <div {...provided.dragHandleProps} className='drag-handle'>
                <FontAwesomeIcon icon={faGripVertical} />
              </div>
              <div className='slot-number'>Slot #{slot.slotNumber}</div>
              <div className='slot-actions'>
                <select
                  value={slotType}
                  onChange={(e) => handleTypeChange(slot.id, e.target.value)}
                  className='type-select'
                >
                  <option value='publicidad'>Publicidad</option>
                  <option value='editorial'>Editorial</option>
                  <option value='ca'>CA</option>
                </select>
                <button
                  type='button'
                  onClick={() => handleRemoveSlot(slot.id)}
                  className='btn-sm btn-danger'
                  title='Eliminar slot'
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            <div className='slot-content'>
              <div className='space-name'>
                {slot.productAdvertisingSpaceName || 'Espacio no definido'}
              </div>
              <div
                className={`assignment-info ${!slot.publishingOrderId ? 'empty' : ''}`}
              >
                {slot.publishingOrderId
                  ? `Orden: ${slot.publishingOrder?.orderNumber || slot.publishingOrderId}`
                  : 'Sin asignar'}
              </div>
              <div className={`type-badge ${slotType}`}>{slotType}</div>
            </div>

            <div className='slot-observation'>
              {isEditingThis ? (
                <div
                  style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
                >
                  <input
                    ref={observationInputRef}
                    type='text'
                    value={editingObservation.value}
                    onChange={(e) =>
                      setEditingObservation({
                        ...editingObservation,
                        value: e.target.value,
                      })
                    }
                    className='observation-input'
                    placeholder='Agregar observación...'
                    autoFocus
                  />
                  <button
                    type='button'
                    onClick={handleSaveObservation}
                    className='btn-sm btn-success'
                    title='Guardar'
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button
                    type='button'
                    onClick={handleCancelObservation}
                    className='btn-sm btn-secondary'
                    title='Cancelar'
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <div
                  className={`observation-display ${!slot.observations ? 'empty' : ''}`}
                  onClick={() =>
                    handleEditObservation(slot.id, slot.observations)
                  }
                  title='Clic para editar'
                >
                  {slot.observations || 'Clic para agregar observación...'}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // Renderizar slots de una página/template
  const renderTemplateSlots = (template) => {
    return (
      <Droppable droppableId={`template-${template.id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`slots-container ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {template.productionSlots && template.productionSlots.length > 0 ? (
              template.productionSlots.map((slot, index) =>
                renderSlot(slot, index)
              )
            ) : (
              <div className='empty-message'>No hay slots en esta página</div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  // Mostrar loading
  // if (loading) {
  //   return (
  //     <ProductionGridContainer>
  //       <div className='page-header'>
  //         <h2>Cargando plantillas de producción...</h2>
  //       </div>
  //     </ProductionGridContainer>
  //   );
  // }

  // Mostrar errores
  if (errors && Object.keys(errors).length > 0) {
    return (
      <ProductionGridContainer>
        <div className='page-header'>
          <h2>Error al cargar plantillas</h2>
          <p style={{ color: 'red' }}>
            {errors.general || 'Error desconocido'}
          </p>
        </div>
      </ProductionGridContainer>
    );
  }

  // Mostrar mensaje si no hay edición seleccionada
  if (!selectedEdition) {
    return (
      <ProductionGridContainer>
        <div className='page-header'>
          <h2>Organización de Producción</h2>
          <p style={{ color: '#6c757d' }}>
            Selecciona un producto y edición para comenzar.
          </p>
        </div>
      </ProductionGridContainer>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ProductionGridContainer>
        <div className='page-header'>
          <h2>Organización de Producción</h2>
          <div className='stats'>
            Edición: {selectedEdition.name} | Total de páginas: {totalPages} |
            Total de slots: {totalSlots}
          </div>
        </div>

        <div className='production-table'>
          <div className='table-header'>
            <div className='header-row'>
              <div className='page-col'>Página</div>
              <div className='content-col'>Slots de Producción</div>
              <div className='actions-col'>Acciones</div>
            </div>
          </div>

          {productionTemplates.map((template) => (
            <div key={template.id} className='page-row'>
              <div className='page-number'>{template.pageNumber}</div>
              <div className='page-content'>
                {renderTemplateSlots(template)}
              </div>
              <div className='page-actions'>
                <button
                  type='button'
                  className='add-slot-btn'
                  onClick={() => handleAddSlot(template.id)}
                  title='Agregar nuevo slot'
                >
                  <FontAwesomeIcon icon={faPlus} /> Agregar Slot
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='page-summary'>
          <div>Resumen de Producción</div>
          <div className='summary-stats'>
            <div className='stat'>
              <div className='stat-value'>{totalPages}</div>
              <div className='stat-label'>Páginas</div>
            </div>
            <div className='stat'>
              <div className='stat-value'>{totalSlots}</div>
              <div className='stat-label'>Slots Total</div>
            </div>
            <div className='stat'>
              <div className='stat-value'>
                {
                  productionTemplates.filter((t) =>
                    t.productionSlots.some((s) => s.publishingOrderId)
                  ).length
                }
              </div>
              <div className='stat-label'>Páginas con Asignaciones</div>
            </div>
          </div>
        </div>
      </ProductionGridContainer>
    </DragDropContext>
  );
};

export default withRouter(ProductionGrid);
