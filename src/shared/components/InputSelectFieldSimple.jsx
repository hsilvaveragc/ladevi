// InputSelectFieldSimple.jsx
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Select from "react-select";

const InputSelectContainer = styled.div`
  label {
    font-size: 0.8rem;
    font-weight: 500;
  }
  small {
    color: red;
  }
  .is-invalid {
    border: 1px solid red;
    border-radius: 4px;
  }
`;

const InputSelectFieldSimple = ({
  name,
  labelText,
  options = [],
  value,
  error = "",
  placeholderText = "Seleccionar",
  disabled = false,
  isLoading = false,
  showLabel = true,
  onChangeHandler = () => {},
  getOptionLabel = option => option.name,
  getOptionValue = option => option.id,
}) => {
  // Encontrar el objeto seleccionado basado en el valor
  const selectedValue = options.find(
    option => (option.id ?? option.code) === value
  );

  return (
    <InputSelectContainer className="form-group">
      {showLabel && <label htmlFor={name}>{labelText}</label>}
      <Select
        name={name}
        className={error ? "is-invalid" : ""}
        isDisabled={disabled}
        onChange={selected => onChangeHandler(selected)}
        value={selectedValue || null}
        options={options}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        placeholder={isLoading ? "Cargando..." : placeholderText}
        isLoading={isLoading}
        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
      />
      {error && <small className="form-text">{error}</small>}
    </InputSelectContainer>
  );
};

InputSelectFieldSimple.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  placeholderText: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
};

export default InputSelectFieldSimple;
