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
  type = "text",
  labelText,
  placeholder = "",
  disabled = false,
  displayErrorMsg = true,
  showLabel = true,
  onChangeHandler = () => {},
  onBlurHandler = () => {},
  maxlength,
}) {
  const makeid = length => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <Field name={name}>
      {({ field, form: { touched, errors: formikError, setFieldValue } }) => {
        return (
          <InputTextContainer className="form-group">
            {showLabel ? <label htmlFor={field.name}>{labelText}</label> : null}
            <input
              className={
                (touched[field.name] && formikError[field.name]) || error
                  ? "form-control is-invalid"
                  : "form-control"
              }
              autoComplete={makeid(5)}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              type={type}
              onChange={evt => {
                setFieldValue(field.name, evt.target.value);
                onChangeHandler(evt);
              }}
              onBlur={evt => {
                onBlurHandler(evt);
              }}
              maxLength={maxlength}
            />

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
  labelText: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InputTextField;
