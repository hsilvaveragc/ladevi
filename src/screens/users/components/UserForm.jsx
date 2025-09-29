import React from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

const NewUserFormContainer = styled.div`
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2rem;
  }
`;

const NewUserForm = ({
  selectedItem,
  availableCountries,
  availableAppRoles,
  deleteMode,
  editMode,
  addMode,
  saveHandler,
  closeHandler,
  errors,
  params,
}) => {
  const [disableEditPassword, setDisableEditPassword] = React.useState(true);

  return (
    <Formik
      enableReinitialize={true}
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        id: addMode ? '' : selectedItem.id,
        fullName: addMode ? '' : selectedItem.fullName,
        email: addMode ? '' : selectedItem.credentialsUser.email,
        password: addMode ? '' : selectedItem.password,
        initials: addMode ? '' : selectedItem.initials,
        applicationRoleId: addMode ? '' : selectedItem.applicationRoleId,
        countryId: addMode ? '' : selectedItem.countryId,
        commisionCoeficient: addMode
          ? 100
          : `${selectedItem.commisionCoeficient.toLocaleString('pt-BR', {
              maximumFractionDigits: 2,
            })}`,
      }}
      onSubmit={(values) => {
        if (!disableEditPassword && !values.password) {
          toast.error('La contraseña no puede estar vacia');
          return;
        }

        saveHandler({
          ...values,
          params: params,
        });
      }}
      validationSchema={Yup.object().shape({
        fullName: Yup.string().required('Requerido'),
        email: Yup.string()
          .email('Email invalido')
          // .matches(
          //   /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
          //   {
          //     message:
          //       "El nombre de usuario solo puede contener letras, números y puntos (no contiguos, no al inicio ni al final).",
          //     excludeEmptyString: true,
          //   }
          // )
          .required('El correo electrónico es obligatorio'),
        password: Yup.string(),
        initials: Yup.string().required('Requerido'),
        applicationRoleId: Yup.string().required('Requerido'),
        countryId: Yup.number().required('Requerido'),
        //commisionCoeficient: Yup.string(),
      })}
    >
      {(formikProps) => {
        const rol = availableAppRoles.filter(
          (x) => x.id === formikProps.values.applicationRoleId
        )[0];
        const rolName = rol ? rol.name : '';
        return (
          <NewUserFormContainer className='container'>
            <h3>
              {addMode ? 'Agregar Usuario' : null}
              {editMode ? 'Editar Usuario' : null}
              {deleteMode ? 'Eliminar Usuario' : null}
            </h3>
            <Form autoComplete='off'>
              <div className='form-row'>
                <div className='col-md-6'>
                  <InputTextField
                    labelText='Nombre Completo'
                    errors={errors.fullName}
                    name='fullName'
                    disabled={deleteMode}
                  />
                </div>
                <div className='col-md-6'>
                  <InputTextField
                    labelText='Iniciales'
                    error={errors.initials}
                    name='initials'
                    disabled={deleteMode}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='col-md-6'>
                  <InputSelectField
                    labelText='Rol'
                    error={errors.applicationRoleId}
                    name='applicationRoleId'
                    options={availableAppRoles}
                    disabled={deleteMode}
                    onChangeHandler={(rol) => {
                      if (
                        rol.name !== 'Vendedor Nacional' &&
                        rol.name !== 'Vendedor COMTUR'
                      ) {
                        formikProps.setFieldValue('commisionCoeficient', 0);
                      } else {
                        formikProps.setFieldValue('commisionCoeficient', 100);
                      }
                      //rolName === "Vendedor Nacional" || rolName === "Vendedor COMTUR"
                    }}
                  ></InputSelectField>
                </div>
                <div className='col-md-6'>
                  <InputSelectField
                    labelText='País'
                    error={errors.countryId}
                    name='countryId'
                    options={availableCountries}
                    disabled={deleteMode}
                  ></InputSelectField>
                </div>
              </div>
              <div className='form-row'>
                <div className='col-md-6'>
                  <InputTextField
                    // type="email"
                    labelText='Email'
                    error={errors.email}
                    name='email'
                    disabled={deleteMode || editMode}
                  />
                </div>
                <div className='col-md-6'>
                  <InputTextField
                    labelText='Contraseña'
                    error={errors.password}
                    name='password'
                    disabled={deleteMode || (editMode && disableEditPassword)}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='col-md-6'>
                  {rolName === 'Vendedor Nacional' ||
                  rolName === 'Vendedor COMTUR' ? (
                    <InputTextField
                      labelText='Multiplicador de comisión'
                      error={errors.commisionCoeficient}
                      name='commisionCoeficient'
                      disabled={deleteMode}
                    />
                  ) : null}
                </div>
              </div>
              <div className='button-container'>
                {editMode && (
                  <button
                    type='button'
                    onClick={() => setDisableEditPassword(false)}
                    className='btn btn-primary'
                  >
                    Cambiar Contraseña
                  </button>
                )}
                {deleteMode ? (
                  <>
                    <SaveButton onClickHandler={closeHandler}>
                      Cancelar
                    </SaveButton>
                    <DangerButton type='submit'>Eliminar</DangerButton>
                  </>
                ) : (
                  <>
                    <DangerButton onClickHandler={closeHandler}>
                      Cancelar
                    </DangerButton>
                    <SaveButton type='submit'>
                      {addMode ? 'Agregar' : null}
                      {editMode ? 'Guardar' : null}
                    </SaveButton>
                  </>
                )}
              </div>
            </Form>
          </NewUserFormContainer>
        );
      }}
    </Formik>
  );
};

NewUserForm.propTypes = {
  saveHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
};

export default NewUserForm;
