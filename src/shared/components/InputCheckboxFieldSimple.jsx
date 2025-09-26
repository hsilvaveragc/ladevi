import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const InputCheckboxContainer = styled.div`
  display: ${props => (props.inline ? "inline-flex" : "flex")};
  height: ${props => (props.inline ? "" : "100%")};
  margin-bottom: 0rem;
  .checkbox-container {
    display: flex;
    flex: 1;
    height: 100%;
    justify-content: center;
    align-items: center;
    label {
      font-size: 0.8rem;
      font-weight: 500;
    }
    input {
      margin-left: 0.5rem;
    }
  }

  small {
    color: red;
  }
`;

export default function InputCheckboxFieldSimple({
  name,
  checked = false,
  labelText = "",
  showLabel = true,
  disabled = false,
  inline = false,
  error = "",
  onChangeHandler = () => {},
}) {
  return (
    <InputCheckboxContainer inline={inline}>
      <div className="checkbox-container">
        {showLabel && (
          <label className="form-check-label" htmlFor={name}>
            {labelText}
          </label>
        )}
        <input
          id={name}
          name={name}
          type="checkbox"
          className={error ? "is-invalid" : ""}
          checked={checked}
          disabled={disabled}
          onChange={onChangeHandler}
        />
      </div>
      {error && (
        <small id={`${name}-error`} className="form-text">
          {error}
        </small>
      )}
    </InputCheckboxContainer>
  );
}

InputCheckboxFieldSimple.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  labelText: PropTypes.string,
  showLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
  error: PropTypes.string,
  onChangeHandler: PropTypes.func,
};
