import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateSlotObservation } from '../actionCreators';

/**
 * Hook personalizado para manejar la edición de observaciones en slots
 */
const useSlotObservations = () => {
  const dispatch = useDispatch();
  const [editingObservation, setEditingObservation] = useState(null);
  const observationInputRef = useRef(null);

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

  const updateObservationValue = (value) => {
    setEditingObservation((prev) => ({ ...prev, value }));
  };

  return {
    editingObservation,
    observationInputRef,
    handleEditObservation,
    handleSaveObservation,
    handleCancelObservation,
    updateObservationValue,
  };
};

export default useSlotObservations;
