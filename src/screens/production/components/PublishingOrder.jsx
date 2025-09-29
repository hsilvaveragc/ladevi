import { Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledPublishingOrder = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
  }

  &:active {
    cursor: grabbing;
  }

  &.is-dragging {
    opacity: 0.5;
    transform: rotate(3deg);
  }

  .drag-handle {
    cursor: grab;
    color: rgba(255, 255, 255, 0.8);
    font-size: 10px;

    &:hover {
      color: white;
    }
  }

  .order-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0; // Para permitir text-overflow

    .order-number {
      font-weight: 600;
      font-size: 11px;
    }

    .order-details {
      font-size: 10px;
      opacity: 0.9;
      line-height: 1.2;
      display: flex;
      gap: 8px;

      .client-name {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .contract-info {
        color: rgba(255, 255, 255, 0.8);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .space-type {
    font-size: 9px;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 2px 4px;
    border-radius: 2px;
    white-space: nowrap;
  }
`;

const PublishingOrder = ({ order, slot }) => {
  return (
    <Draggable
      key={`order-${order.id}`}
      draggableId={`order-${order.id}`}
      index={0}
    >
      {(provided, snapshot) => (
        <StyledPublishingOrder
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`publishing-order ${snapshot.isDragging ? 'is-dragging' : ''}`}
        >
          <div {...provided.dragHandleProps} className='drag-handle'>
            <FontAwesomeIcon icon={faGripVertical} />
          </div>

          <div className='order-info'>
            <div className='order-number'>Orden #{order.id}</div>
            <div className='order-details'>
              <div
                className='client-name'
                title={order.clientName || 'Cliente no definido'}
              >
                {order.clientName || 'Cliente no definido'}
              </div>
              <div
                className='contract-info'
                title={order.contractName || 'Contrato no definido'}
              >
                {order.contractName || 'Contrato no definido'}
              </div>
            </div>
          </div>

          <div className='space-type'>
            {slot.productAdvertisingSpaceName || 'Espacio'}
          </div>
        </StyledPublishingOrder>
      )}
    </Draggable>
  );
};

export default PublishingOrder;
