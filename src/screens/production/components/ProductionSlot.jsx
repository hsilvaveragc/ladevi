import { Droppable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import PublishingOrder from './PublishingOrder';

const StyledProductionSlot = styled.div`
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

  .slot-main-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 50px;
  }

  .slot-info-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 160px;

    .slot-info {
      font-weight: 600;
      color: #495057;
      font-size: 12px;
    }

    .slot-type-selector {
      select {
        font-size: 10px;
        padding: 2px 4px;
        border: 1px solid #ced4da;
        border-radius: 3px;
        width: 100%;
      }
    }
  }

  .slot-content {
    flex: 1;
    min-height: 40px;
    border-radius: 4px;
    padding: 4px;

    &.empty {
      border: 2px dashed #adb5bd;
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6c757d;
      font-style: italic;
      font-size: 11px;
    }

    &.drag-over {
      border-color: #007bff;
      background-color: #e7f3ff;
    }
  }

  .slot-observations {
    min-width: 150px;
    max-width: 200px;

    .observation-display {
      color: #6c757d;
      font-style: italic;
      cursor: pointer;
      font-size: 11px;
      padding: 4px 6px;
      border-radius: 3px;
      border: 1px solid transparent;
      min-height: 32px;
      display: flex;
      align-items: center;

      &:hover {
        background-color: #e9ecef;
        border-color: #ced4da;
      }

      &.empty {
        color: #adb5bd;
      }
    }

    .observation-edit {
      display: flex;
      gap: 4px;
      align-items: center;

      input {
        flex: 1;
        padding: 4px 6px;
        border: 1px solid #ced4da;
        border-radius: 3px;
        font-size: 11px;
      }
    }
  }

  .slot-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 60px;
  }

  .type-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 9px;
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

  .btn-sm {
    padding: 4px 8px;
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
`;

const ProductionSlot = ({
  slot,
  editingObservation,
  observationInputRef,
  onTypeChange,
  onRemoveSlot,
  onEditObservation,
  onSaveObservation,
  onCancelObservation,
  onUpdateObservationValue,
}) => {
  const getSlotType = (slot) => {
    if (slot.isEditorial) return 'editorial';
    if (slot.isCA) return 'ca';
    return 'publicidad';
  };

  const slotType = getSlotType(slot);
  const isEditingThis = editingObservation?.slotId === slot.id;
  const hasOrder = slot.order !== null;

  return (
    <StyledProductionSlot
      className={`production-slot ${hasOrder ? 'has-order' : 'empty'}`}
    >
      <div className='slot-main-row'>
        {/* Columna izquierda: Info del slot y selector de tipo */}
        <div className='slot-info-column'>
          <div className='slot-info'>
            Slot #{slot.slotNumber} -{' '}
            {slot.productAdvertisingSpaceName || 'Espacio no definido'}
          </div>
          <div className='slot-type-selector'>
            <select
              value={slotType}
              onChange={(e) => onTypeChange(slot.id, e.target.value)}
            >
              <option value='publicidad'>Publicidad</option>
              <option value='editorial'>Editorial</option>
              <option value='ca'>CA</option>
            </select>
          </div>
        </div>

        {/* Contenido central: PublishingOrder o slot vacío */}
        <Droppable droppableId={`slot-${slot.id}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`slot-content ${!hasOrder ? 'empty' : ''} ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            >
              {hasOrder ? (
                <PublishingOrder order={slot.order} slot={slot} />
              ) : (
                'Arrastrar orden aquí'
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Observaciones */}
        <div className='slot-observations'>
          {isEditingThis ? (
            <div className='observation-edit'>
              <input
                ref={observationInputRef}
                type='text'
                value={editingObservation.value}
                onChange={(e) => onUpdateObservationValue(e.target.value)}
                placeholder='Observación...'
                autoFocus
              />
              <button
                type='button'
                onClick={onSaveObservation}
                className='btn-sm btn-success'
                title='Guardar'
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button
                type='button'
                onClick={onCancelObservation}
                className='btn-sm btn-secondary'
                title='Cancelar'
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ) : (
            <div
              className={`observation-display ${!slot.observations ? 'empty' : ''}`}
              onClick={() => onEditObservation(slot.id, slot.observations)}
              title='Clic para editar'
            >
              {slot.observations || 'Clic para agregar observación...'}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className='slot-actions'>
          <button
            type='button'
            onClick={() => onRemoveSlot(slot.id)}
            className='btn-sm btn-danger'
            title='Eliminar slot'
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <div className={`type-badge ${slotType}`}>{slotType}</div>
    </StyledProductionSlot>
  );
};

export default ProductionSlot;
