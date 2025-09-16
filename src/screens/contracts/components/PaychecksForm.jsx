import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputTextField from 'shared/components/InputTextField';
import { SaveButton } from 'shared/components/Buttons';

import { getTotalContract } from '../utils2';

const PaycheckFormContainer = styled.div`
  table {
    text-align: center;
  }
`;

export default function PaychecksForm({
  errors,
  formikProps,
  availableProducts,
  editMode,
}) {
  const [payments, setPayments] = useState([]);
  let totalContract = getTotalContract(formikProps.values, availableProducts);
  totalContract =
    totalContract === 0
      ? 0
      : parseFloat(totalContract.split('.').join('').replace(',', '.'));

  const calculatePayments = ({
    checkQuantity,
    daysToFirstPayment,
    daysBetweenChecks,
  }) => {
    const aux = [];
    for (let i = 0; i < checkQuantity; i++) {
      const actualDate = new Date();
      actualDate.setDate(
        actualDate.getDate() +
          (i * parseFloat(daysBetweenChecks) + parseFloat(daysToFirstPayment))
      );
      aux.push({
        payment: i + 1,
        date:
          actualDate.getDate() +
          '/' +
          (actualDate.getMonth() + 1) +
          '/' +
          actualDate.getFullYear(),
        total: checkQuantity ? totalContract / checkQuantity : 0,
      });
    }
    setPayments(aux);
  };

  const handleSubmit = (values) => {
    calculatePayments(values);
  };

  useEffect(() => {
    if (editMode) {
      calculatePayments(formikProps.values);
    }
  }, []);

  return (
    <PaycheckFormContainer className='container'>
      {/* <Form
        autoComplete="off"
        onSubmit={evt => {
          evt.preventDefault();
          calculatePayments(formikProps.values);
        }}
      > */}
      <div className='form-row'>
        <div className='col-3'>
          <InputTextField
            labelText='Cantidad de Cheques:'
            name='checkQuantity'
            error={errors.checkQuantity}
          />
        </div>
        <div className='col-3'>
          <InputTextField
            labelText='Dias al primero:'
            name='daysToFirstPayment'
            error={errors.daysToFirstPayment}
          />
        </div>
        <div className='col-4'>
          <InputTextField
            labelText='Dias entre cheques:'
            name='daysBetweenChecks'
            error={errors.daysBetweenChecks}
          />
        </div>
        <div className='col-2'>
          <div style={{ paddingTop: '25%' }}>
            <button
              className='btn btn-primary'
              onClick={(evt) => {
                evt.preventDefault();
                calculatePayments(formikProps.values);
              }}
            >
              Generar
            </button>
            {/* <SaveButton type="submit">Generar</SaveButton> */}
          </div>
        </div>
      </div>
      {/* </Form> */}
      <table className='table table-sm table-striped'>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>Pago</th>
            <th scope='col'>Fecha</th>
            <th scope='col'>Monto</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.payment}>
              <th scope='row'>{p.payment}</th>
              <td>{p.date.toString()}</td>
              <td>
                {p.total.toLocaleString('pt-BR', {
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
          {/* <tr>
                  <th scope="row">1</th>
                  <td>17/01/19</td>
                  <td>$100</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>17/01/19</td>
                  <td>$100</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>17/01/19</td>
                  <td>$100</td>
                </tr> */}
        </tbody>
      </table>
    </PaycheckFormContainer>
  );
}
