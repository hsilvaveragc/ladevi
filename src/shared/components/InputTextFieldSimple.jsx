import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const InputTextContainer = styled.div`
  label {
    font-size: 0.8rem;
    font-weight: 500;
  }
  small {
    color: red;
  }
`;

function InputTextFieldSimple({
  name,
  error,
  type = "text",
  labelText,
  placeholder = "",
  disabled = false,
  displayErrorMsg = true,
  showLabel = true,
  value,
  onChangeHandler = () => {},
  onBlurHandler = () => {},
  maxlength,
}) {
  // Generar un ID único para evitar el autocompletado
  const generateRandomId = length => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <InputTextContainer className="form-group">
      {showLabel ? <label htmlFor={name}>{labelText}</label> : null}
      <input
        className={error ? "form-control is-invalid" : "form-control"}
        autoComplete={generateRandomId(5)}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        id={name}
        type={type}
        value={value}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        maxLength={maxlength}
      />

      {displayErrorMsg && error ? (
        <small id={`${name}-error`} className="form-text">
          {error}
        </small>
      ) : null}
    </InputTextContainer>
  );
}

InputTextFieldSimple.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  labelText: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  displayErrorMsg: PropTypes.bool,
  showLabel: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChangeHandler: PropTypes.func,
  onBlurHandler: PropTypes.func,
  maxlength: PropTypes.number,
};

export default InputTextFieldSimple;
