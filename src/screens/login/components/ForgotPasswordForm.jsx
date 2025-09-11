import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import Spinner from 'shared/components/Spinner';
import InputTextField from 'shared/components/InputTextField';

const LoginFormContainer = styled.div`
  width: 100%;
  padding: 2rem;
  border: 1px solid #9aa5b1;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  h2 {
    font-family: 'Roboto', sans-serif;

    font-size: 1.2rem;
    text-align: center;
  }
  label {
    font-size: 0.7rem;
    font-family: 'Lato', sans-serif;
  }
  button[type='submit'] {
    background-color: #03449e;
    color: #fff;
    width: 100%;
  }
  span {
    font-size: 0.8rem;
    text-align: center;
    margin-top: 1rem;
  }
  .error-container {
    display: flex;
    justify-content: center;
    padding: 4px 20px;
    margin: 10px 0;
    background: #e84747;
    color: #fff;
    border-radius: 4px;
    font-size: 0.8rem;
  }
`;

export default function ForgotPasswordForm({
  error,
  forgotPasswordAction,
  isLoading,
}) {
  return (
    <LoginFormContainer>
      <Formik
        initialValues={{
          username: '',
        }}
        onSubmit={(values) => {
          forgotPasswordAction({
            username: values.username,
          });
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required('Required'),
        })}
      >
        {(props) => {
          const { errors } = props;
          return (
            <Form className='form'>
              <h2>Recuperacion de Contraseña</h2>
              <div className='form-group'>
                <InputTextField
                  labelText='Nombre de usuario'
                  error={errors.username}
                  name='username'
                />
              </div>
              {isEmpty(error) ? null : (
                <div className='error-container'>{error}</div>
              )}
              <button
                type='submit'
                className='btn btn-primary'
                disabled={isLoading}
              >
                {!isLoading ? 'Enviar' : <Spinner />}
              </button>
            </Form>
          );
        }}
      </Formik>
    </LoginFormContainer>
  );
}
