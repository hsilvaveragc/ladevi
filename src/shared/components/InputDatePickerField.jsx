import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import { Field } from "formik";
import { isNil, head, length } from "ramda";

const InputDatePickerContainer = styled.div`
  .react-datepicker-wrapper {
    display: flex;
    .react-datepicker__input-container {
      width: 100%;
    }
  }
  .react-datepicker {
  }
  label {
    font-size: 0.8rem;
    font-weight: 500;
  }
  small {
    color: red;
  }
`;

export default function InputDatePicker({
  error,
  name,
  labelText,
  disabled = false,
  onChangeHandler = () => {},
  minDate,
  maxDate,
  popperPlacement,
}) {
  return (
    <Field name={name}>
      {({ field, form }) => {
        return (
          <InputDatePickerContainer>
            <label htmlFor={field.name}>{labelText}</label>
            <DatePicker
              popperPlacement={
                popperPlacement ? popperPlacement : "bottom-start"
              }
              dateFormat="dd/MM/yyyy"
              selected={(field.value && new Date(field.value)) || null}
              minDate={minDate}
              maxDate={maxDate}
              onChange={value => {
                form.setFieldValue(field.name, value);
                onChangeHandler(value);
              }}
              className={
                (form.touched[field.name] && form.errors[field.name]) || error
                  ? "form-control is-invalid"
                  : "form-control "
              }
              id={field.name}
              readOnly={disabled}
              autocomplete={false}
              popperClassName="custom-popper-class"
              popperModifiers={{
                preventOverflow: {
                  enabled: true,
                  escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                  boundariesElement: "viewport",
                },
              }}
            />
            {/*<small id={`${field.name}-error`} className="form-text">
              {isNil(error) ? form.errors[field.name] : head(error)}
            </small>*/}
            <small
              id={`${field.name}-error`}
              className={
                isNil(form.errors[field.name]) ? "inactive" : "form-text"
              }
            >
              {isNil(error)
                ? form.errors[field.name]
                : length(error) > 1
                ? error
                : head(error)}
            </small>
          </InputDatePickerContainer>
        );
      }}
    </Field>
  );
}

InputDatePicker.propTypes = {
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
