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
  disabled = false,
  displayErrorMsg = true,
  onChangeHandler = () => {},
  getOptionLabel = option => option.name,
  getOptionValue = option => option.id,
}) {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const selectValue = options.find(option => option.id === field.value);
        return (
          <InputSelectContainer className="form-group">
            <label htmlFor={field.name}>{labelText}</label>
            <Select
              {...field}
              className={
                (form.touched[field.name] && form.errors[field.name]) || error
                  ? "is-invalid"
                  : ""
              }
              isDisabled={disabled}
              onChange={e => {
                form.setFieldValue(field.name, e.id);
                onChangeHandler(e.id);
              }}
              value={isNil(selectValue) ? null : selectValue}
              options={options}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              onBlur={e => {
                form.setFieldTouched(field.name, true);
              }}
              placeholder="Seleccionar"
            ></Select>
            {displayErrorMsg ? (
              <small
                id={`${field.name}-error`}
                className={
                  isNil(form.errors[field.name]) ? "inactive" : "form-text"
                }
              >
                {isNil(error) ? form.errors[field.name] : head(error)}
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
