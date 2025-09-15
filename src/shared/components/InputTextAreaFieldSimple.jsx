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

function InputTextAreaFieldSimple({
  name,
  value = "",
  error = "",
  labelText,
  placeholder = "",
  disabled = false,
  displayErrorMsg = true,
  showLabel = true,
  rows,
  cols,
  onChangeHandler = () => {},
}) {
  return (
    <InputTextContainer className="form-group">
      {showLabel && <label htmlFor={name}>{labelText}</label>}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        className={error ? "form-control is-invalid" : "form-control"}
        rows={rows}
        cols={cols}
        disabled={disabled}
        value={value}
        onChange={onChangeHandler}
      >
        {value}
      </textarea>
      {displayErrorMsg && error && (
        <small id={`${name}-error`} className="form-text">
          {error}
        </small>
      )}
    </InputTextContainer>
  );
}

InputTextAreaFieldSimple.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  displayErrorMsg: PropTypes.bool,
  showLabel: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
  onChangeHandler: PropTypes.func,
};

export default InputTextAreaFieldSimple;
