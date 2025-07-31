import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import styled from "styled-components";
import { isNil, head } from "ramda";
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
  .inactive {
    display: none;
  }
`;

function InputSelect({
  error,
  name,
  labelText,
  options = [],
  placeholderText = "",
  disabled = false,
  displayErrorMsg = true,
  onChangeHandler = () => {},
  getOptionLabel = option => option.name,
  getOptionValue = option => option.id,
  isLoading,
}) {
  return (
    <Field name={name}>
      {({
        field,
        form: { touched, errors: formikError, setFieldValue, setFieldTouched },
      }) => {
        const optionsLocal = options || [];
        const selectValue = optionsLocal.filter(
          option => (option.id ?? option.code) === field.value
        )[0];
        return (
          <InputSelectContainer className="form-group">
            <label htmlFor={field.name}>{labelText}</label>
            <Select
              {...field}
              className={
                (touched[field.name] && formikError[field.name]) || error
                  ? "is-invalid"
                  : ""
              }
              isDisabled={disabled}
              onChange={option => {
                setFieldValue(field.name, option.id ?? option.code);
                onChangeHandler(option);
              }}
              value={isNil(selectValue) ? null : selectValue}
              options={optionsLocal}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              onBlur={e => {
                setFieldTouched(field.name, true);
              }}
              placeholder={
                isLoading
                  ? "Cargando"
                  : placeholderText == ""
                  ? "Seleccionar"
                  : placeholderText
              }
              isLoading={isLoading}
            ></Select>
            {displayErrorMsg ? (
              <small
                id={`${field.name}-error`}
                className={
                  isNil(formikError[field.name]) ? "inactive" : "form-text"
                }
                style={{ display: formikError[field.name] ? "inline" : "none" }}
              >
                {isNil(error) ? formikError[field.name] : head(error)}
              </small>
            ) : null}
          </InputSelectContainer>
        );
      }}
    </Field>
  );
}

InputSelect.propTypes = {
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.array.isRequired,
};

export default InputSelect;
