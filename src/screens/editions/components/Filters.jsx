import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import { SaveButton, DangerButton } from 'shared/components/Buttons';

import { editionsFilterBy, getAllEditions } from '../actionCreators';
import { getProducts } from '../reducer';

const FiltersContainer = styled.div`
  width: 70vw;
  margin: 2rem 0 4rem;
  .buttons-container {
    display: flex;
    align-items: flex-end;
    height: 82%;
    margin-bottom: 1rem;
    justify-content: space-around;
    button {
      width: 40%;
    }
  }
`;

const Filters = () => {
  const dispatch = useDispatch();

  // Estados del Redux store
  const productsAvailable = useSelector(getProducts);

  // Handlers
  const handleFilter = (payload) => {
    dispatch(editionsFilterBy(payload));
  };

  const handleReset = () => {
    dispatch(getAllEditions());
  };

  const defaultOption = {
    id: -1,
    name: 'Todos',
  };

  const initialValues = {
    code: '',
    name: '',
    productId: -1,
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={handleFilter}
    >
      {(formikProps) => (
        <FiltersContainer>
          <Form>
            <div className='form-row'>
              <div className='col-3'>
                <InputTextField labelText='Título' name='name' />
              </div>
              <div className='col-3'>
                <InputSelectField
                  labelText='Producto'
                  name='productId'
                  options={[defaultOption, ...productsAvailable]}
                />
              </div>
              <div className='col-3'>
                <InputTextField labelText='Código' name='code' />
              </div>
              <div className='col-3'>
                <div className='buttons-container'>
                  <DangerButton
                    onClickHandler={() => {
                      formikProps.resetForm();
                      handleReset();
                    }}
                  >
                    Limpiar
                  </DangerButton>
                  <SaveButton type='submit'>Buscar</SaveButton>
                </div>
              </div>
            </div>
          </Form>
        </FiltersContainer>
      )}
    </Formik>
  );
};

export default Filters;
