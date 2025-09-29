import PropTypes from 'prop-types';
import { Field } from 'formik';
import styled from 'styled-components';
import { isNil, head, length } from 'ramda';
import InputMask from 'react-input-mask';

const InputMaskContainer = styled.div`
  label {
    font-size: 0.8rem;
    font-weight: 500;
  }
  small {
    color: red;
  }
`;

function InputMaskField({
  name,
  error,
  mask,
  maskChar = '_',
  labelText,
  placeholder = '',
  disabled = false,
  displayErrorMsg = true,
  showLabel = true,
  onChangeHandler = () => {},
  onBlurHandler = () => {},
  maxlength,
}) {
  const makeid = (length) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <Field name={name}>
      {({ field, form: { touched, errors: formikError, setFieldValue } }) => {
        return (
          <InputMaskContainer className='form-group'>
            {showLabel ? <label htmlFor={field.name}>{labelText}</label> : null}
            <InputMask
              mask={mask}
              maskChar={maskChar}
              className={
                (touched[field.name] && formikError[field.name]) || error
                  ? 'form-control is-invalid'
                  : 'form-control'
              }
              autoComplete={makeid(5)}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value || ''}
              onChange={(evt) => {
                setFieldValue(field.name, evt.target.value);
                onChangeHandler(evt);
              }}
              onBlur={(evt) => {
                field.onBlur(evt); // Importante para que Formik registre el onBlur
                onBlurHandler(evt);
              }}
              maxLength={maxlength}
            />

            {displayErrorMsg ? (
              <small
                id={`${field.name}-error`}
                className={
                  isNil(formikError[field.name]) ? 'inactive' : 'form-text'
                }
              >
                {isNil(error)
                  ? formikError[field.name]
                  : length(error) > 1
                    ? error
                    : head(error)}
              </small>
            ) : null}
          </InputMaskContainer>
        );
      }}
    </Field>
  );
}

InputMaskField.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  mask: PropTypes.string.isRequired,
  maskChar: PropTypes.string,
  labelText: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  displayErrorMsg: PropTypes.bool,
  showLabel: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  onBlurHandler: PropTypes.func,
  maxlength: PropTypes.number,
};

export default InputMaskField;
