import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import styled from "styled-components";
import { isNil } from "ramda";
import Select from "react-select";

const InputMultiSelectContainer = styled.div`
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

function InputMultiSelectField({
  error,
  name,
  labelText,
  options = [],
  disabled = false,
  displayErrorMsg = true,
  showLabel = true,
  allOptionText = "Todas las opciones",
  placeholder = "Seleccionar opciones",
  customStyles = {},
  onChangeHandler = () => {},
  onAllChangeHandler = () => {},
  getOptionLabel = option => option.text,
  getOptionValue = option => option.value,
  isLoading = false,
}) {
  // Agregar la opción "Todas las opciones" al inicio
  const allOption = {
    value: "__ALL__",
    text: allOptionText,
    isAllOption: true,
  };

  const optionsWithAll = [allOption, ...options];

  return (
    <Field name={name}>
      {({ field, form }) => {
        // El value debe ser un array
        const fieldValue = Array.isArray(field.value) ? field.value : [];

        // Verificar si todas las opciones están seleccionadas (excluyendo la opción "Todas")
        const allSelected =
          options.length > 0 &&
          options.every(opt => fieldValue.includes(opt.value));

        // Convertir valores a objetos para react-select
        let selectValue = [];

        if (allSelected) {
          selectValue = [allOption];
        } else {
          selectValue = options.filter(option =>
            fieldValue.includes(option.value)
          );
        }

        const handleChange = selectedOptions => {
          const selectedArray = selectedOptions || [];

          // Verificar si se seleccionó "Todas las opciones"
          const allOptionSelected = selectedArray.some(
            opt => opt.value === "__ALL__"
          );

          let newValues = [];

          if (allOptionSelected) {
            // Si se selecciona "Todas", seleccionar todas las opciones reales
            newValues = options.map(opt => opt.value);
            onAllChangeHandler(true);
          } else {
            // Solo las opciones seleccionadas (sin la opción "Todas")
            newValues = selectedArray
              .filter(opt => opt.value !== "__ALL__")
              .map(opt => opt.value);

            // Si se deseleccionaron todas, llamar onAllChangeHandler(false)
            if (newValues.length === 0 && fieldValue.length > 0) {
              onAllChangeHandler(false);
            }
          }

          form.setFieldValue(field.name, newValues);
          onChangeHandler(newValues, newValues.length === options.length);
        };

        return (
          <InputMultiSelectContainer className="form-group">
            {showLabel && <label htmlFor={field.name}>{labelText}</label>}

            <Select
              {...field}
              styles={customStyles}
              className={
                (form.touched[field.name] && form.errors[field.name]) || error
                  ? "is-invalid"
                  : ""
              }
              isDisabled={disabled}
              isMulti={true}
              onChange={handleChange}
              value={selectValue}
              options={optionsWithAll}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              onBlur={() => {
                form.setFieldTouched(field.name, true);
              }}
              placeholder={isLoading ? "Cargando..." : placeholder}
              isLoading={isLoading}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              // Ocultar los valores seleccionados (chips)
              controlShouldRenderValue={false}
              // Personalizar el placeholder para mostrar la cantidad
              components={{
                Placeholder: ({ children, ...props }) => {
                  const selectedCount = fieldValue.length;
                  let displayText = placeholder;

                  if (allSelected) {
                    displayText = allOptionText;
                  } else if (selectedCount > 0) {
                    displayText = `${selectedCount} opción${
                      selectedCount !== 1 ? "es" : ""
                    } seleccionada${selectedCount !== 1 ? "s" : ""}`;
                  }

                  return (
                    <div
                      {...props.innerProps}
                      style={props.getStyles("placeholder", props)}
                    >
                      {displayText}
                    </div>
                  );
                },
              }}
              // Personalizar cómo se muestran las opciones en el dropdown
              formatOptionLabel={(option, { context }) => {
                if (context === "value" && option.value === "__ALL__") {
                  return allOptionText;
                }
                return option.text;
              }}
            />

            {displayErrorMsg && (
              <small
                id={`${field.name}-error`}
                className={
                  isNil(form.errors[field.name]) && isNil(error)
                    ? "inactive"
                    : "form-text"
                }
                style={{
                  display: form.errors[field.name] || error ? "inline" : "none",
                }}
              >
                {isNil(error) ? form.errors[field.name] : error}
              </small>
            )}
          </InputMultiSelectContainer>
        );
      }}
    </Field>
  );
}

InputMultiSelectField.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  disabled: PropTypes.bool,
  displayErrorMsg: PropTypes.bool,
  showLabel: PropTypes.bool,
  allOptionText: PropTypes.string,
  placeholder: PropTypes.string,
  customStyles: PropTypes.object,
  onChangeHandler: PropTypes.func,
  onAllChangeHandler: PropTypes.func,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default InputMultiSelectField;
