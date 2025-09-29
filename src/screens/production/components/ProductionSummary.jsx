import styled from 'styled-components';

const StyledProductionSummary = styled.div`
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

  @media (max-width: 768px) {
    .summary-stats {
      flex-direction: column;
      gap: 12px;
    }
  }
`;

const ProductionSummary = ({
  totalPages,
  totalSlots,
  assignedSlots,
  availableSlots,
}) => {
  return (
    <StyledProductionSummary className='page-summary'>
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
    </StyledProductionSummary>
  );
};

export default ProductionSummary;
