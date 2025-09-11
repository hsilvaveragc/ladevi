import PropTypes from 'prop-types';
import { Field } from 'formik';
import styled from 'styled-components';
import { isNil, head } from 'ramda';

const InputRadioContainer = styled.div`
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  height: ${(props) => (props.inline ? '' : '100%')};
  margin-bottom: 0rem;
  .radio-container {
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

export default function InputRadioField({
  error,
  name,
  value,
  labelText = '',
  showLabel = true,
  disabled = false,
  inline = false,
  onChangeHandler = () => {},
  options = [],
}) {
  return (
    <Field name={name}>
      {({ field, form: { touched, errors: formikError, setFieldValue } }) => (
        <div className='mb-3'>
          {showLabel && <label className='form-label'>{labelText}</label>}
          <div>
            {options.map((option) => (
              <InputRadioContainer key={option.value} inline={inline}>
                <div className='radio-container'>
                  <input
                    type='radio'
                    id={`${name}-${option.value}`}
                    name={name}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={(e) => {
                      setFieldValue(field.name, e.target.value);
                      onChangeHandler(e);
                    }}
                    disabled={disabled}
                    className={
                      (touched[field.name] && formikError[field.name]) || error
                        ? 'is-invalid'
                        : ''
                    }
                  />
                  <label
                    className='form-check-label ms-2'
                    htmlFor={`${name}-${option.value}`}
                  >
                    {option.label}
                  </label>
                </div>
              </InputRadioContainer>
            ))}
          </div>
          {((touched[field.name] && formikError[field.name]) || error) && (
            <small id={`${field.name}-error`} className='form-text'>
              {isNil(error) ? formikError[field.name] : head(error)}
            </small>
          )}
        </div>
      )}
    </Field>
  );
}

InputRadioField.propTypes = {
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
