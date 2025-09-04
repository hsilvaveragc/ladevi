import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import styled from "styled-components";
import { isNil, head, length } from "ramda";

const InputTextContainer = styled.div`
  label {
    font-size: 0.8rem;
    font-weight: 500;
  }
  small {
    color: red;
  }
`;

function InputTextField({
  name,
  error,
  labelText,
  disabled = false,
  displayErrorMsg = true,
  showLabel = true,
  rows,
  cols,
}) {
  return (
    <Field name={name}>
      {({ field, form: { touched, errors: formikError } }) => {
        return (
          <InputTextContainer className="form-group">
            {showLabel ? <label htmlFor={field.name}>{labelText}</label> : null}
            <textarea
              name={field.name}
              className={
                (touched[field.name] && formikError[field.name]) || error
                  ? "form-control is-invalid"
                  : "form-control"
              }
              rows={rows}
              cols={cols}
              disabled={disabled}
              {...field}
            >
              {field.value}
            </textarea>
            {displayErrorMsg ? (
              <small
                id={`${field.name}-error`}
                className={
                  isNil(formikError[field.name]) ? "inactive" : "form-text"
                }
              >
                {isNil(error)
                  ? formikError[field.name]
                  : length(error) > 1
                  ? error
                  : head(error)}
              </small>
            ) : null}
          </InputTextContainer>
        );
      }}
    </Field>
  );
}

InputTextField.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InputTextField;
