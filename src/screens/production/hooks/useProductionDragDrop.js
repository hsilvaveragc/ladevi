import { useDispatch } from 'react-redux';
import { movePublishingOrderBetweenSlots } from '../actionCreators';

/**
 * Hook personalizado para manejar drag and drop de órdenes entre slots
 */
const useProductionDragDrop = () => {
  const dispatch = useDispatch();

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

  return {
    handleDragEnd,
  };
};

export default useProductionDragDrop;
