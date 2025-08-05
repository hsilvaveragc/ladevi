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
  fontSize = "16px", // Nuevo prop para controlar el tamaño de letra
  onChangeHandler = () => {},
  getOptionLabel = option => option.name,
  getOptionValue = option => option.id,
}) => {
  // Encontrar el objeto seleccionado basado en el valor
  const selectedValue = options.find(
    option => (option.id ?? option.code) === value
  );

  // Estilos personalizados para react-select con tamaño de letra configurable
  const customStyles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      fontSize: fontSize,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: fontSize,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: fontSize,
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: fontSize,
    }),
    input: (provided, state) => ({
      ...provided,
      fontSize: fontSize,
    }),
  };

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
        styles={customStyles}
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
  fontSize: PropTypes.string, // Nuevo PropType
  onChangeHandler: PropTypes.func,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
};

export default InputSelectFieldSimple;
