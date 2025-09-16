import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export const EditButton = ({ onClickHandler, disable }) => (
  <button
    type='button'
    className='btn btn-warning'
    onClick={onClickHandler}
    style={{ width: '100%' }}
  >
    <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon> Editar
  </button>
);

EditButton.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
};

export const RemoveButton = ({
  onClickHandler,
  children,
  disabled = false,
}) => (
  <button
    type='button'
    className='btn btn-danger'
    onClick={onClickHandler}
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      paddingTop: '2px',
      paddingBottom: '2px',
    }}
    disabled={disabled}
  >
    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon> Borrar
  </button>
);

export const RemoveConfirmButton = ({
  onClickHandler,
  children,
  loading = false,
}) => (
  <DangerButton
    type='button'
    onClickHandler={onClickHandler}
    disabled={loading}
  >
    Eliminar
  </DangerButton>
);

RemoveButton.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
};

export const SaveButton = ({
  children,
  type = 'button',
  onClickHandler,
  disabled,
}) => (
  <button
    className='btn btn-success'
    type={type}
    onClick={onClickHandler}
    disabled={disabled}
  >
    {children}
  </button>
);

export const DangerButton = ({
  onClickHandler,
  children,
  type = 'button',
  disabled,
}) => (
  <button
    type={type}
    className='btn btn-danger'
    onClick={onClickHandler}
    disabled={disabled}
  >
    {children}
  </button>
);

export const WarningButton = ({
  onClickHandler,
  children,
  type = 'button',
}) => (
  <button type={type} className='btn btn-warning' onClick={onClickHandler}>
    {children}
  </button>
);

SaveButton.propTypes = {};
