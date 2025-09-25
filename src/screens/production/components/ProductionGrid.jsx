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
  addSlot,
  removeSlot,
  updateSlotObservation,
  markSlotAsEditorial,
  markSlotAsCA,
  movePublishingOrderBetweenSlots,
} from '../actionCreators';
import {
  getProductionTemplates,
  getLoading,
  getErrors,
  getTotalPages,
  getTotalSlots,
  getSelectedEdition,
  getAssignedSlots,
  getAvailableSlots,
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
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 80px;
  }

  .production-slot {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 8px;
    position: relative;

    &.has-order {
      border-left: 4px solid #007bff;
    }

    &.empty {
      border: 2px dashed #ced4da;
      background-color: #f8f9fa;
    }

    .slot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      .slot-info {
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
      min-height: 60px;
      border-radius: 4px;
      padding: 8px;

      &.empty {
        border: 2px dashed #adb5bd;
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6c757d;
        font-style: italic;
        font-size: 12px;
      }

      &.drag-over {
        border-color: #007bff;
        background-color: #e7f3ff;
      }
    }

    .publishing-order {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      padding: 8px;
      border-radius: 4px;
      cursor: grab;
      user-select: none;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
      }

      &:active {
        cursor: grabbing;
      }

      &.is-dragging {
        opacity: 0.5;
        transform: rotate(5deg);
      }

      .order-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;

        .order-number {
          font-weight: 600;
          font-size: 12px;
        }

        .drag-handle {
          cursor: grab;
          color: rgba(255, 255, 255, 0.8);

          &:hover {
            color: white;
          }
        }
      }

      .order-details {
        font-size: 11px;
        opacity: 0.9;
        line-height: 1.3;

        .client-name {
          font-weight: 500;
          margin-bottom: 2px;
        }

        .contract-info {
          color: rgba(255, 255, 255, 0.8);
        }

        .space-type {
          font-size: 10px;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 3px;
          margin-top: 4px;
          display: inline-block;
        }
      }
    }

    .type-badge {
      position: absolute;
      top: 4px;
      right: 4px;
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

    .slot-observation {
      margin-top: 8px;
      padding-top: 8px;
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

  .add-slot-btn,
  .btn-sm {
    padding: 4px 8px;
    font-size: 11px;
    border: none;
    border-radius: 3px;
    cursor: pointer;

    &.add-slot-btn {
      width: 100%;
      border: 1px dashed #6c757d;
      background: transparent;
      color: #6c757d;

      &:hover {
        border-color: #007bff;
        color: #007bff;
        background-color: #f8f9fa;
      }
    }

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

    .summary-title {
      font-weight: 600;
      color: #495057;
      margin-bottom: 12px;
    }

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

  // Selectors - usando los del reducer
  const loading = useSelector(getLoading);
  const errors = useSelector(getErrors);
  const productionTemplates = useSelector(getProductionTemplates);
  const totalPages = useSelector(getTotalPages);
  const totalSlots = useSelector(getTotalSlots);
  const selectedEdition = useSelector(getSelectedEdition);
  const assignedSlots = useSelector(getAssignedSlots);
  const availableSlots = useSelector(getAvailableSlots);

  // Cargar datos cuando hay una edición seleccionada
  useEffect(() => {
    if (selectedEdition?.id) {
      dispatch(fetchProductionTemplates(selectedEdition.id));
    }
  }, [dispatch, selectedEdition]);

  // Manejar drag and drop de órdenes entre slots
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Solo permitir movimiento entre slots
    if (
      source.droppableId.startsWith('slot-') &&
      destination.droppableId.startsWith('slot-')
    ) {
      const sourceSlotId = parseInt(source.droppableId.split('-')[1]);
      const targetSlotId = parseInt(destination.droppableId.split('-')[1]);
      const publishingOrderId = parseInt(draggableId.split('-')[1]);

      if (sourceSlotId !== targetSlotId) {
        dispatch(
          movePublishingOrderBetweenSlots(
            publishingOrderId,
            sourceSlotId,
            targetSlotId
          )
        );
      }
    }
  };

  // Métodos helper para gestión de slots
  const handleAddSlot = (templateId, inventorySpaceId = 1) => {
    dispatch(addSlot(templateId, inventorySpaceId));
  };

  const handleRemoveSlot = (slotId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este slot?')) {
      dispatch(removeSlot(slotId));
    }
  };

  // Métodos para edición de observaciones
  const handleEditObservation = (slotId, currentObservation) => {
    setEditingObservation({ slotId, value: currentObservation || '' });
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

  // Métodos para cambio de tipos
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

  const getSlotType = (slot) => {
    if (slot.isEditorial) return 'editorial';
    if (slot.isCA) return 'ca';
    return 'publicidad';
  };

  // Renderizar una orden de publicación individual
  const renderPublishingOrder = (order, slot) => (
    <Draggable
      key={`order-${order.id}`}
      draggableId={`order-${order.id}`}
      index={0}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`publishing-order ${snapshot.isDragging ? 'is-dragging' : ''}`}
        >
          <div className='order-header'>
            <div className='order-number'>Orden #{order.id}</div>
            <div {...provided.dragHandleProps} className='drag-handle'>
              <FontAwesomeIcon icon={faGripVertical} />
            </div>
          </div>
          <div className='order-details'>
            <div className='client-name'>
              {order.clientName || 'Cliente no definido'}
            </div>
            <div className='contract-info'>
              {order.contractName || 'Contrato no definido'}
            </div>
            <div className='space-type'>
              {slot.productAdvertisingSpaceName || 'Espacio no definido'}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  // Renderizar un slot individual
  const renderSlot = (slot, templateId) => {
    const slotType = getSlotType(slot);
    const isEditingThis = editingObservation?.slotId === slot.id;
    const hasOrder = slot.order !== null;

    return (
      <div
        key={slot.id}
        className={`production-slot ${hasOrder ? 'has-order' : 'empty'}`}
      >
        <div className='slot-header'>
          <div className='slot-info'>
            Slot #{slot.slotNumber} -{' '}
            {slot.productAdvertisingSpaceName || 'Espacio no definido'}
          </div>
          <div className='slot-actions'>
            <select
              value={slotType}
              onChange={(e) => handleTypeChange(slot.id, e.target.value)}
              style={{ fontSize: '10px', padding: '2px 4px' }}
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

        <Droppable droppableId={`slot-${slot.id}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`slot-content ${!hasOrder ? 'empty' : ''} ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            >
              {hasOrder
                ? renderPublishingOrder(slot.order, slot)
                : 'Slot vacío - Arrastrar orden aquí'}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className={`type-badge ${slotType}`}>{slotType}</div>

        {/* Observaciones */}
        <div className='slot-observation'>
          {isEditingThis ? (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
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
              onClick={() => handleEditObservation(slot.id, slot.observations)}
              title='Clic para editar'
            >
              {slot.observations || 'Clic para agregar observación...'}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar slots de una página/template
  const renderTemplateSlots = (template) => (
    <div className='slots-container'>
      {template.productionSlots && template.productionSlots.length > 0 ? (
        template.productionSlots.map((slot) => renderSlot(slot, template.id))
      ) : (
        <div
          style={{
            color: '#6c757d',
            fontStyle: 'italic',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          No hay slots en esta página
        </div>
      )}
    </div>
  );

  // Mostrar loading, errores, o mensaje si no hay edición
  if (loading) {
    return (
      <ProductionGridContainer>
        <div className='page-header'>
          <h2>Cargando plantillas de producción...</h2>
        </div>
      </ProductionGridContainer>
    );
  }

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
            Total de slots: {totalSlots} | Slots asignados:{' '}
            {assignedSlots.length}
          </div>
        </div>

        {/* Tabla principal de producción */}
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
                  <FontAwesomeIcon icon={faPlus} /> Slot
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen usando selectores del reducer */}
        <div className='page-summary'>
          <div className='summary-title'>Resumen de Producción</div>
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
              <div className='stat-value'>{assignedSlots.length}</div>
              <div className='stat-label'>Slots Asignados</div>
            </div>
            <div className='stat'>
              <div className='stat-value'>{availableSlots.length}</div>
              <div className='stat-label'>Slots Vacíos</div>
            </div>
          </div>
        </div>
      </ProductionGridContainer>
    </DragDropContext>
  );
};

export default withRouter(ProductionGrid);
