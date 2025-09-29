import PropTypes from 'prop-types';
import { Field } from 'formik';
import styled from 'styled-components';
import { isNil, head } from 'ramda';

const InputCheckboxContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['inline'].includes(prop),
})`
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  height: ${(props) => (props.inline ? '' : '100%')};
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

export default function InputCheckbox({
  error,
  name,
  labelText = '',
  showLabel = true,
  disabled = false,
  inline = false,
  onChangeHandler = () => {},
}) {
  return (
    <Field name={name}>
      {({ field, form: { touched, errors: formikError, setFieldValue } }) => (
        <InputCheckboxContainer inline={inline}>
          <div className='checkbox-container'>
            {showLabel ? (
              <label className='form-check-label' htmlFor={field.name}>
                {labelText}
              </label>
            ) : null}
            <input
              type='checkbox'
              className={
                (touched[field.name] && formikError[field.name]) || error
                  ? 'is-invalid'
                  : ''
              }
              checked={field.value}
              disabled={disabled}
              onClick={(evt) => {
                setFieldValue(field.name, evt.target.value);
                onChangeHandler(evt);
              }}
              {...field}
            />
          </div>
          <small id={`${field.name}-error`} className='form-text'>
            {isNil(error) ? formikError[field.name] : head(error)}
          </small>
        </InputCheckboxContainer>
      )}
    </Field>
  );
}

InputCheckbox.propTypes = {
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
};
