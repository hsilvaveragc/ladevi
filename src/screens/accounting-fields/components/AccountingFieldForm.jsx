import styled from 'styled-components';
import { isEmpty, not } from 'ramda';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import InputSelectField from 'shared/components/InputSelectField';
import InputTextField from 'shared/components/InputTextField';
import InputCheckboxField from 'shared/components/InputCheckboxField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

const AccountingFieldsFormContainer = styled.div`
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .col-md-3 {
    .button-container {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      .btn {
        padding: 10px;
        font-size: 0.5rem;
        margin: 0 5px;
      }
    }
  }
`;

const AccountingFieldsForm = ({
  selectedItem,
  deleteMode,
  editMode,
  addMode,
  saveHandler,
  closeHandler,
  countries,
  errors,
}) => (
  <Formik
    validateOnChange={false}
    validateOnBlur={false}
    initialValues={{
      id: addMode ? '' : selectedItem.id,
      name: addMode ? '' : selectedItem.name,
      countryId: addMode ? '' : selectedItem.countryId,
      order: addMode ? '' : selectedItem.order,
      options: addMode ? [''] : selectedItem.options,
      isIdentificationField: addMode
        ? false
        : selectedItem.isIdentificationField,
    }}
    onSubmit={(values) => {
      saveHandler({
        ...values,
        options: [...values.options.filter((item) => not(isEmpty(item)))],
        countryId: +values.countryId,
      });
    }}
    validationSchema={Yup.object().shape({
      name: Yup.string().required('Requerido'),
      countryId: Yup.string().required('Requerido'),
      order: Yup.number().required('Requerido'),
    })}
  >
    {(formikProps) => {
      const { values } = formikProps;
      return (
        <AccountingFieldsFormContainer className='container'>
          <h3>
            {addMode ? 'Agregar Campo Contable' : null}
            {editMode ? 'Editar Campo Contable' : null}
            {deleteMode ? 'Eliminar Campo Contable' : null}
          </h3>
          <Form autoComplete='off'>
            <div className='form-row'>
              <div className='col-12'>
                <InputTextField
                  labelText='Nombre'
                  name='name'
                  disabled={deleteMode}
                  error={errors.name}
                />
              </div>
            </div>
            <div className='form-row'>
              <div className='col-12'>
                <InputSelectField
                  labelText='Pais'
                  name='countryId'
                  options={countries}
                  disabled={deleteMode}
                  error={errors.countryId}
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='col-6'>
                <InputTextField
                  labelText='Orden'
                  name='order'
                  disabled={deleteMode}
                  error={errors.order}
                />
              </div>
              <div className='col-4'>
                <InputCheckboxField
                  labelText='Identificacion'
                  name='isIdentificationField'
                  disabled={deleteMode}
                  error={errors.isIdentificationField}
                />
              </div>
            </div>
            <FieldArray
              name='options'
              validateOnChange={false}
              render={({ insert, remove, push }) => (
                <>
                  {values.options.length > 0 &&
                    values.options.map((value, index) => (
                      <div className='form-row' key={index}>
                        <div className='col-md-2'>
                          <InputTextField
                            labelText='Opcion'
                            name={`options.${index}`}
                            disabled={deleteMode}
                          />
                        </div>
                        <div className='col-md-3'>
                          <div className='button-container'>
                            <button
                              className='btn btn-outline-secondary'
                              onClick={(e) => {
                                if (deleteMode) {
                                  e.preventDefault();
                                  return;
                                }
                                e.preventDefault();
                                if (values.options.length !== 1) {
                                  remove(index);
                                }
                                return;
                              }}
                            >
                              <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                            </button>
                            <button
                              className='btn btn-outline-secondary'
                              onClick={(e) => {
                                if (deleteMode) {
                                  e.preventDefault();
                                  return;
                                }
                                e.preventDefault();
                                push('');
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
            />

            <div className='button-container'>
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
        </AccountingFieldsFormContainer>
      );
    }}
  </Formik>
);

export default AccountingFieldsForm;
