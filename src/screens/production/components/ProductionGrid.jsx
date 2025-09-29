import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext } from '@hello-pangea/dnd';

import {
  fetchProductionTemplates,
  addSlot,
  removeSlot,
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
  getAssignedSlots,
  getAvailableSlots,
} from '../reducer';

import useSlotObservations from '../hooks/useSlotObservations';
import useProductionDragDrop from '../hooks/useProductionDragDrop';
import ProductionSlot from './ProductionSlot';
import ProductionSummary from './ProductionSummary';

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

  .add-slot-btn {
    width: 100%;
    border: 1px dashed #6c757d;
    background: transparent;
    color: #6c757d;
    padding: 4px 8px;
    font-size: 11px;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      border-color: #007bff;
      color: #007bff;
      background-color: #f8f9fa;
    }
  }
`;

const ProductionGrid = ({ match }) => {
  const dispatch = useDispatch();

  // Custom hooks
  const {
    editingObservation,
    observationInputRef,
    handleEditObservation,
    handleSaveObservation,
    handleCancelObservation,
    updateObservationValue,
  } = useSlotObservations();

  const { handleDragEnd } = useProductionDragDrop();

  // Selectors
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

  // Métodos helper para gestión de slots
  const handleAddSlot = (templateId, inventorySpaceId = 1) => {
    dispatch(addSlot(templateId, inventorySpaceId));
  };

  const handleRemoveSlot = (slotId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este slot?')) {
      dispatch(removeSlot(slotId));
    }
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

  // Renderizar slots de una página/template
  const renderTemplateSlots = (template) => (
    <div className='slots-container'>
      {template.productionSlots && template.productionSlots.length > 0 ? (
        template.productionSlots.map((slot) => (
          <ProductionSlot
            key={slot.id}
            slot={slot}
            editingObservation={editingObservation}
            observationInputRef={observationInputRef}
            onTypeChange={handleTypeChange}
            onRemoveSlot={handleRemoveSlot}
            onEditObservation={handleEditObservation}
            onSaveObservation={handleSaveObservation}
            onCancelObservation={handleCancelObservation}
            onUpdateObservationValue={updateObservationValue}
          />
        ))
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

  // Estados de carga y error
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

        <ProductionSummary
          totalPages={totalPages}
          totalSlots={totalSlots}
          assignedSlots={assignedSlots}
          availableSlots={availableSlots}
        />
      </ProductionGridContainer>
    </DragDropContext>
  );
};

export default withRouter(ProductionGrid);
