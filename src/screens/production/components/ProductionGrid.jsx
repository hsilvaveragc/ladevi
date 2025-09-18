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
  fetchProductionItems,
  moveItem,
  addSlot,
  removeSlot,
  updateObservation,
  markAsEditorial,
  markAsCA,
} from '../actionCreators';
import {
  getProductionItems,
  getProductionItemsByPage,
  getLoading,
  getErrors,
  getTotalPages,
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
      }
    }
  }

  .page-row {
    display: flex;
    border-bottom: 1px solid #dee2e6;
    min-height: 80px;

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
      padding: 8px 12px;
    }
  }

  .page-items-container {
    min-height: 60px;
    border: 2px dashed #ced4da;
    border-radius: 6px;
    background-color: #f8f9fa;
    padding: 8px;
    transition: all 0.2s ease;

    &.drag-over {
      border-color: #28a745;
      background-color: #d4edda;
    }

    .empty-page-message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #6c757d;
      font-style: italic;
      pointer-events: none;
      font-size: 13px;
    }
  }

  .production-item {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 6px;
    transition: all 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &.assigned {
      border-color: #28a745;
      background-color: #f8fff9;
    }

    &.template {
      border-color: #ffc107;
      border-style: dashed;
    }

    /* Estilos específicos de @hello-pangea/dnd */
    .drag-handle {
      color: #6c757d;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    .item-content {
      display: grid;
      grid-template-columns: auto 1fr auto auto auto auto auto;
      gap: 8px;
      align-items: center;
      font-size: 13px;

      .client-info {
        font-weight: 600;
        color: #495057;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .client-name {
          font-size: 12px;
        }

        .contract-name {
          font-size: 11px;
          color: #6c757d;
          font-weight: normal;
        }
      }

      .seller-name {
        color: #6c757d;
        font-size: 12px;
      }

      .space-type {
        background-color: #e9ecef;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        text-align: center;
        font-weight: 500;

        &.editorial {
          background-color: #f8d7da;
          color: #721c24;
        }

        &.ca {
          background-color: #fff3cd;
          color: #856404;
        }

        &.assigned {
          background-color: #d4edda;
          color: #155724;
        }

        &.template {
          background-color: #fff3cd;
          color: #856404;
        }
      }

      .slot-info {
        color: #6c757d;
        font-size: 11px;
        text-align: center;

        .slot-number {
          display: block;
          font-weight: 600;
        }
      }

      .observation {
        min-width: 150px;

        .observation-display {
          color: #6c757d;
          font-style: italic;
          cursor: pointer;
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
          padding: 2px 4px;
          border: 1px solid #ced4da;
          border-radius: 3px;
          font-size: 12px;
          width: 100%;
        }
      }

      .actions {
        display: flex;
        gap: 4px;

        .type-select {
          font-size: 11px;
          padding: 2px 4px;
          border: 1px solid #ced4da;
          border-radius: 3px;
          background: white;
        }

        .btn-sm {
          padding: 2px 6px;
          font-size: 11px;
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
        }
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
    margin-top: 4px;

    &:hover {
      border-color: #007bff;
      color: #007bff;
      background-color: #f8f9fa;
    }
  }

  @media (max-width: 768px) {
    .production-item .item-content {
      grid-template-columns: 1fr;
      gap: 4px;
      text-align: left;
    }
  }
`;

const ProductionGrid = ({ match }) => {
  const dispatch = useDispatch();
  const productEditionId = match?.params?.productEditionId;

  // Estado local para edición de observaciones
  const [editingObservation, setEditingObservation] = useState(null);
  const observationInputRef = useRef(null);

  // Selectores del estado con estructura real del backend
  const productionItems = useSelector(getProductionItems);
  const itemsByPage = useSelector(getProductionItemsByPage);
  const loading = useSelector(getLoading);
  const errors = useSelector(getErrors);
  const totalPages = useSelector(getTotalPages);

  // Cargar elementos al montar el componente
  useEffect(() => {
    if (productEditionId) {
      dispatch(fetchProductionItems(parseInt(productEditionId)));
    }
  }, [dispatch, productEditionId]);

  // Handler principal de drag and drop
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino válido, no hacer nada
    if (!destination) {
      return;
    }

    // Si se soltó en la misma posición, no hacer nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Extraer información de los IDs
    const sourcePageNumber = parseInt(source.droppableId.replace('page-', ''));
    const destinationPageNumber = parseInt(
      destination.droppableId.replace('page-', '')
    );

    // Encontrar el item que se está moviendo
    const draggedItem = productionItems.find(
      (item) =>
        `item-${item.Id}-${item.PageNumber}-${item.Slot}` === draggableId
    );

    if (draggedItem) {
      // Calcular nuevo slot basado en la posición de destino
      const destinationPageItems = itemsByPage[destinationPageNumber] || [];
      const newSlot = destination.index + 1;

      dispatch(
        moveItem(
          draggedItem.Id,
          sourcePageNumber,
          draggedItem.Slot,
          destinationPageNumber,
          newSlot
        )
      );
    }
  };

  // Handlers para observaciones
  const handleObservationClick = (itemId, currentObservation) => {
    setEditingObservation({ itemId, value: currentObservation || '' });
    setTimeout(() => {
      if (observationInputRef.current) {
        observationInputRef.current.focus();
        observationInputRef.current.select();
      }
    }, 0);
  };

  const handleObservationSave = () => {
    if (editingObservation) {
      dispatch(
        updateObservation(editingObservation.itemId, editingObservation.value)
      );
      setEditingObservation(null);
    }
  };

  const handleObservationCancel = () => {
    setEditingObservation(null);
  };

  const handleObservationKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleObservationSave();
    } else if (e.key === 'Escape') {
      handleObservationCancel();
    }
  };

  // Handler para cambio de tipo
  const handleTypeChange = (itemId, newType) => {
    if (newType === 'editorial') {
      dispatch(markAsEditorial(itemId, true));
    } else if (newType === 'ca') {
      dispatch(markAsCA(itemId, true));
    } else {
      dispatch(markAsEditorial(itemId, false));
      dispatch(markAsCA(itemId, false));
    }
  };

  // Handlers para slots
  const handleAddSlot = (pageNumber) => {
    // console.log('Agregar slot en página', pageNumber);
  };

  const handleRemoveSlot = (itemId) => {
    const item = productionItems.find((i) => i.Id === itemId);
    if (item && item.Id === 0) {
      dispatch(removeSlot(itemId));
    }
  };

  // Determinar el tipo visual del item
  const getItemType = (item) => {
    if (item.IsEditorial) return 'editorial';
    if (item.IsCA) return 'ca';
    if (item.PublishingOrderId > 0) return 'assigned';
    return 'template';
  };

  // Determinar el tipo de select
  const getSelectValue = (item) => {
    if (item.IsEditorial) return 'editorial';
    if (item.IsCA) return 'ca';
    return 'publicidad';
  };

  // Renderizar un item individual
  const renderProductionItem = (item, index) => {
    const itemType = getItemType(item);
    const selectValue = getSelectValue(item);
    const isTemplate = item.Id === 0;
    const isAssigned = item.PublishingOrderId > 0;
    const draggableId = `item-${item.Id}-${item.PageNumber}-${item.Slot}`;

    return (
      <Draggable
        key={draggableId}
        draggableId={draggableId}
        index={index}
        isDragDisabled={isAssigned} // No permitir drag de items asignados
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`production-item ${itemType} ${snapshot.isDragging ? 'dragging' : ''}`}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging
                ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                : provided.draggableProps.style?.transform,
            }}
          >
            <div className='item-content'>
              <div className='drag-handle' {...provided.dragHandleProps}>
                <FontAwesomeIcon icon={faGripVertical} />
              </div>

              <div className='client-info'>
                <div className='client-name'>
                  {item.ClientName ||
                    (isAssigned ? 'Sin cliente' : 'Disponible')}
                </div>
                {item.ContractName && (
                  <div className='contract-name'>{item.ContractName}</div>
                )}
              </div>

              <div className='seller-name'>
                {item.SellerName || (isAssigned ? '-' : '')}
              </div>

              <div className={`space-type ${itemType}`}>
                {item.IsEditorial
                  ? 'EDITORIAL'
                  : item.IsCA
                    ? 'CA'
                    : item.ProductAdvertisingSpaceName || '-'}
              </div>

              <div className='slot-info'>
                <span className='slot-number'>#{item.Slot}</span>
              </div>

              <div className='observation'>
                {editingObservation?.itemId === item.Id ? (
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <input
                      ref={observationInputRef}
                      type='text'
                      className='observation-input'
                      value={editingObservation.value}
                      onChange={(e) =>
                        setEditingObservation({
                          ...editingObservation,
                          value: e.target.value,
                        })
                      }
                      onKeyDown={handleObservationKeyPress}
                      onBlur={handleObservationSave}
                      placeholder='Observación...'
                    />
                    <button
                      type='button'
                      className='btn-sm btn-success'
                      onClick={handleObservationSave}
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button
                      type='button'
                      className='btn-sm btn-danger'
                      onClick={handleObservationCancel}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`observation-display ${
                      !item.Observations ? 'empty' : ''
                    }`}
                    onClick={() =>
                      handleObservationClick(item.Id, item.Observations)
                    }
                  >
                    {item.Observations || 'Agregar observación...'}
                  </div>
                )}
              </div>

              <div className='actions'>
                <select
                  className='type-select'
                  value={selectValue}
                  onChange={(e) => handleTypeChange(item.Id, e.target.value)}
                  disabled={isAssigned}
                >
                  <option value='publicidad'>Publicidad</option>
                  <option value='editorial'>Editorial</option>
                  <option value='ca'>CA</option>
                </select>

                {isTemplate && (
                  <button
                    type='button'
                    className='btn-sm btn-danger'
                    onClick={() => {
                      if (window.confirm('¿Eliminar este slot?')) {
                        handleRemoveSlot(item.Id);
                      }
                    }}
                    title='Solo se pueden eliminar slots de template'
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // Renderizar elementos de una página
  const renderPageItems = (pageNumber) => {
    const pageItems = itemsByPage[pageNumber] || [];
    const droppableId = `page-${pageNumber}`;

    return (
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`page-items-container ${
              snapshot.isDraggingOver ? 'drag-over' : ''
            }`}
          >
            {pageItems.length === 0 ? (
              <div className='empty-page-message'>Página sin elementos</div>
            ) : (
              pageItems.map((item, index) => renderProductionItem(item, index))
            )}

            {provided.placeholder}

            {pageNumber > 1 && (
              <button
                type='button'
                className='add-slot-btn'
                onClick={() => handleAddSlot(pageNumber)}
                disabled
              >
                <FontAwesomeIcon icon={faPlus} /> Agregar slot
              </button>
            )}
          </div>
        )}
      </Droppable>
    );
  };

  // Mostrar loading o errores
  if (loading) {
    return (
      <ProductionGridContainer>
        <div className='page-header'>
          <h2>Cargando elementos de producción...</h2>
        </div>
      </ProductionGridContainer>
    );
  }

  if (errors && Object.keys(errors).length > 0) {
    return (
      <ProductionGridContainer>
        <div className='page-header'>
          <h2>Error al cargar elementos</h2>
          <p style={{ color: 'red' }}>
            {errors.general || 'Error desconocido'}
          </p>
        </div>
      </ProductionGridContainer>
    );
  }

  // Generar las filas de páginas
  const pageRows = [];
  for (let i = 1; i <= totalPages; i++) {
    pageRows.push(i);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ProductionGridContainer>
        <div className='page-header'>
          <h2>Organización de Páginas</h2>
          <p
            style={{ color: '#6c757d', fontSize: '14px', margin: '8px 0 0 0' }}
          >
            Total de páginas: {totalPages} | Total de elementos:{' '}
            {productionItems.length}
          </p>
        </div>

        <div className='production-table'>
          <div className='table-header'>
            <div className='header-row'>
              <div className='page-col'>Página</div>
              <div className='content-col'>Contenido</div>
            </div>
          </div>

          {pageRows.map((pageNumber) => (
            <div key={pageNumber} className='page-row'>
              <div className='page-number'>{pageNumber}</div>
              <div className='page-content'>{renderPageItems(pageNumber)}</div>
            </div>
          ))}
        </div>
      </ProductionGridContainer>
    </DragDropContext>
  );
};

export default withRouter(ProductionGrid);
