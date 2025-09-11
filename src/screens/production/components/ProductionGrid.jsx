import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faGripVertical,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

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
    position: relative;

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
    cursor: grab;
    transition: all 0.2s ease;

    &:hover {
      border-color: #007bff;
      box-shadow: 0 2px 4px rgba(0, 123, 255, 0.25);
    }

    &:active {
      cursor: grabbing;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &.dragging {
      opacity: 0.5;
      transform: rotate(2deg);
    }

    .item-content {
      display: grid;
      grid-template-columns: auto 1fr auto auto auto auto auto;
      gap: 8px;
      align-items: center;
      font-size: 13px;

      .drag-handle {
        color: #6c757d;
        cursor: grab;
      }

      .anunciante {
        font-weight: 600;
        color: #495057;
      }

      .vendedor {
        color: #6c757d;
      }

      .medida {
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
      }

      .ubicacion {
        color: #6c757d;
        text-transform: capitalize;
      }

      .observacion {
        min-width: 150px;

        .observacion-display {
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

        .observacion-input {
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

const ProductionGrid = () => {
  const dispatch = useDispatch();
  const { editionId } = 1; //useParams();

  // Estado local para drag & drop y edición
  const [editingObservation, setEditingObservation] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverPage, setDragOverPage] = useState(null);
  const observationInputRef = useRef(null);

  // Selectores del estado
  const productionItems = useSelector(getProductionItems);
  const loading = useSelector(getLoading);
  const errors = useSelector(getErrors);
  const totalPages = useSelector(getTotalPages);

  // Para demo, usar un ID fijo si no está disponible en la URL
  const currentEditionId = editionId || 'edition-1';

  // Cargar elementos al montar el componente
  useEffect(() => {
    if (currentEditionId) {
      dispatch(fetchProductionItems(currentEditionId));
    }
  }, [dispatch, currentEditionId]);

  // Handlers para drag & drop
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, pageNumber) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPage(pageNumber);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverPage(null);
    }
  };

  const handleDrop = (e, pageNumber) => {
    e.preventDefault();
    setDragOverPage(null);

    if (draggedItem && draggedItem.pageNumber !== pageNumber) {
      dispatch(moveItem(draggedItem.id, pageNumber));
    }
    setDraggedItem(null);
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
    dispatch(addSlot(currentEditionId, pageNumber));
  };

  const handleRemoveSlot = (itemId) => {
    dispatch(removeSlot(itemId));
  };

  // Renderizar elementos de una página
  const renderPageItems = (pageNumber) => {
    const pageItems = productionItems.filter(
      (item) => item.pageNumber === pageNumber
    );

    return (
      <div
        className={`page-items-container ${
          dragOverPage === pageNumber ? 'drag-over' : ''
        }`}
        onDragOver={(e) => handleDragOver(e, pageNumber)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, pageNumber)}
      >
        {pageItems.length === 0 ? (
          <div className='empty-page-message'>Arrastrar elementos aquí</div>
        ) : (
          pageItems.map((item) => {
            const isDragging = draggedItem?.id === item.id;
            const itemType = item.isEditorial
              ? 'editorial'
              : item.isCA
                ? 'ca'
                : 'publicidad';

            return (
              <div
                key={item.id}
                className={`production-item ${isDragging ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                <div className='item-content'>
                  <div className='drag-handle'>
                    <FontAwesomeIcon icon={faGripVertical} />
                  </div>

                  <div className='anunciante'>{item.anunciante || '-'}</div>

                  <div className='vendedor'>{item.vendedor || '-'}</div>

                  <div className={`medida ${itemType}`}>
                    {item.isEditorial
                      ? 'EDITORIAL'
                      : item.isCA
                        ? 'CA'
                        : item.medida || '-'}
                  </div>

                  <div className='ubicacion'>{item.ubicacion || '-'}</div>

                  <div className='observacion'>
                    {editingObservation?.itemId === item.id ? (
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <input
                          ref={observationInputRef}
                          type='text'
                          className='observacion-input'
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
                        className={`observacion-display ${
                          !item.observacion ? 'empty' : ''
                        }`}
                        onClick={() =>
                          handleObservationClick(item.id, item.observacion)
                        }
                      >
                        {item.observacion || 'Agregar observación...'}
                      </div>
                    )}
                  </div>

                  <div className='actions'>
                    <select
                      className='type-select'
                      value={itemType}
                      onChange={(e) =>
                        handleTypeChange(item.id, e.target.value)
                      }
                    >
                      <option value='publicidad'>Publicidad</option>
                      <option value='editorial'>Editorial</option>
                      <option value='ca'>CA</option>
                    </select>

                    {!item.isOriginalSlot && (
                      <button
                        type='button'
                        className='btn-sm btn-danger'
                        onClick={() => {
                          if (window.confirm('¿Eliminar este slot?')) {
                            handleRemoveSlot(item.id);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {pageNumber > 1 && (
          <button
            type='button'
            className='add-slot-btn'
            onClick={() => handleAddSlot(pageNumber)}
          >
            <FontAwesomeIcon icon={faPlus} /> Agregar slot
          </button>
        )}
      </div>
    );
  };

  // Generar las filas de páginas
  const pageRows = [];
  for (let i = 1; i <= totalPages; i++) {
    pageRows.push(i);
  }

  return (
    <ProductionGridContainer>
      <div className='page-header'>
        <h2> Organización de Páginas</h2>
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
  );
};

export default ProductionGrid;
