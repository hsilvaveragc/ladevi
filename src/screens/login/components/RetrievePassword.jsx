import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputTextField from 'shared/components/InputTextField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';
import Footer from 'shared/components/Footer';

import { resetPassword } from '../actionCreators';
import {
  getIsUserConfirmedLoading,
  getIsUserConfirmed,
  getUserFullName,
  getIsResetSuccessful,
} from '../reducer';
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const MessageBoxContainer = styled.div`
  width: 100%;
  padding: 2rem;
  border: 1px solid #9aa5b1;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  button {
    background-color: #03449e;
    color: #fff;
    width: 100%;
  }
`;

const FormContainer = styled.div`
  width: 30vw;
  h2 {
    margin-bottom: 2rem;
  }
  .row {
    margin-bottom: 1rem;
  }
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2rem;
  }
`;

function ConfirmationPage(props) {
  const { token, email } = queryString.parse(props.location.search);
  return props.isResetSuccessful ? (
    <PageContainer>
      <MessageBoxContainer>
        <h2>Felicitaciones!</h2>
        <p>La contraseña fue cambiada exitosamente!</p>
        <p>Podes empezar a usar la plataforma</p>
        <Link to='/login'>
          <button className='btn btn-primary'>Login</button>
        </Link>
      </MessageBoxContainer>
    </PageContainer>
  ) : (
    <>
      <PageContainer>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            token,
            email,
            currentPassword: '',
            newPassword: '',
            newPassword2: '',
          }}
          onSubmit={(values) => {
            props.actions.resetPassword({
              ...values,
            });
          }}
          validationSchema={Yup.object().shape({
            token: Yup.string().required('Requerido'),
            newPassword: Yup.string().required('Requerido'),
            newPassword2: Yup.string().required('Requerido'),
          })}
        >
          {({ values }) => {
            return (
              <FormContainer className='container'>
                <h2>Cambiar Contraseña</h2>
                <Form autoComplete='off'>
                  <div className='form-group'>
                    <InputTextField
                      labelText='Contraseña Nueva'
                      name='newPassword'
                      type='password'
                    />
                  </div>
                  <div className='form-group'>
                    <InputTextField
                      labelText='Contraseña Nueva Confirmacion'
                      name='newPassword2'
                      type='password'
                    />
                  </div>
                  <div className='button-container'>
                    <SaveButton type='submit'>Cambiar</SaveButton>
                  </div>
                </Form>
              </FormContainer>
            );
          }}
        </Formik>
      </PageContainer>
      <Footer></Footer>
    </>
  );
}

const mapStateToProps = (state) => ({
  isUserConfirmedLoading: getIsUserConfirmedLoading(state),
  isUserConfirmed: getIsUserConfirmed(state),
  userName: getUserFullName(state),
  isResetSuccessful: getIsResetSuccessful(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ resetPassword }, dispatch),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ConfirmationPage
);
