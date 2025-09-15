import { Formik, Form } from "formik";
import { isEmpty } from "ramda";
import React from "react";
import styled from "styled-components";
import * as Yup from "yup";
import Spinner from "shared/components/Spinner";
import InputTextField from "shared/components/InputTextField";
import Logo from "../../../shared/images/newLogo.png";

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
    font-family: "Roboto", sans-serif;

    font-size: 1.2rem;
    text-align: center;
  }
  label {
    font-size: 0.7rem;
    font-family: "Lato", sans-serif;
  }
  button[type="submit"] {
    background-color: #03449e;
    color: #fff;
    width: 100%;
  }
  span {
    font-size: 0.8rem;
    text-align: center;
    margin-top: 1rem;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
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

export default function LoginForm({ error, actions, isLoading, modalHandler }) {
  return (
    <LoginFormContainer>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={values => {
          actions.loginInit({
            username: values.username,
            password: values.password,
          });
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Requerido"),
          password: Yup.string().required("Requerido"),
        })}
      >
        {props => {
          let { errors } = props;
          return (
            <Form className="form">
              <h2>Sistema de ventas</h2>
              <div className="form-group">
                <InputTextField
                  labelText="Nombre de usuario"
                  error={errors.username}
                  name="username"
                />
              </div>
              <div className="form-group">
                <InputTextField
                  type="password"
                  labelText="Contraseña"
                  error={errors.password}
                  name="password"
                />
              </div>
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">
                  Recordar Sesión
                </label>
              </div>
              {isEmpty(error) ? null : (
                <div className="error-container">{error}</div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {!isLoading ? "Ingresar" : <Spinner />}
              </button>
              <span onClick={modalHandler}>Olvidé mi contraseña</span>
            </Form>
          );
        }}
      </Formik>
    </LoginFormContainer>
  );
}
