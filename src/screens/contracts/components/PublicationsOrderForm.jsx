import React, { useState } from "react";
import styled from "styled-components";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import InputTextField from "shared/components/InputTextField";
import InputCheckboxField from "shared/components/InputCheckboxField";
import InputSelectField from "shared/components/InputSelectField";
import InputTextAreaField from "shared/components/InputTextAreaField";
import {
  SaveButton,
  DangerButton,
  WarningButton,
} from "shared/components/Buttons";

const PublicationsOrderFormContainer = styled.div`
  .button-container {
    display: flex;
    justify-content: space-around;

    button {
      padding: 0.35rem 3rem;
    }
  }
`;

export default function PublicationsOrderForm() {
  return (
    <PublicationsOrderFormContainer>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          product: "",
          isCurrent: false,
          edition: "",
          client: "",
          salesmen: "",
          contract: "",
          spaceType: "",
          quantity: "",
          billNumber: "",
          isPaid: false,
          page: "",
          location: "",
          observations: "",
        }}
        onSubmit={values => {}}
        validationSchema={Yup.object().shape({
          product: Yup.string().required("Requerido"),
          isCurrent: Yup.bool(),
          edition: Yup.string().required("Requerido"),
          client: Yup.string().required("Requerido"),
          salesmen: Yup.string().required("Requerido"),
          contract: Yup.string().required("Requerido"),
          spaceType: Yup.string().required("Requerido"),
          quantity: Yup.string().required("Requerido"),
          billNumber: Yup.string().required("Requerido"),
          isPaid: Yup.bool(),
          page: Yup.string().required("Requerido"),
          location: Yup.string().required("Requerido"),
          observations: Yup.string(),
        })}
      >
        {formikProps => {
          return (
            <div className="container">
              <Form autoComplete="off">
                <div className="form-row">
                  <div className="col-9">
                    <InputSelectField
                      labelText="Producto"
                      name="product"
                      options={[]}
                    />
                  </div>
                  <div className="col-3">
                    <InputCheckboxField labelText="Latente" name="isCurrent" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12">
                    <InputSelectField
                      labelText="Edition"
                      name="edition"
                      options={[]}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-7">
                    <InputTextField labelText="Cliente" name="client" />
                  </div>
                  <div className="col-5">
                    <InputSelectField
                      labelText="Vendedor"
                      name="salesmen"
                      options={[]}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12">
                    <InputSelectField
                      labelText="Contrato"
                      name="contract"
                      options={[]}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-9">
                    <InputSelectField
                      labelText="Tipo de espacio"
                      name="spaceType"
                      options={[]}
                    />
                  </div>
                  <div className="col-3">
                    <InputTextField labelText="Cantidad" name="quantity" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-9">
                    <InputTextField labelText="Factura" name="billNumber" />
                  </div>
                  <div className="col-3">
                    <InputCheckboxField labelText="Pagada" name="isCurrent" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-6">
                    <InputTextField labelText="Pagina" name="page" />
                  </div>
                  <div className="col-6">
                    <InputSelectField
                      labelText="Tipo de espacio"
                      name="spaceType"
                      options={[]}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12">
                    <InputTextAreaField
                      labelText="Observaciones"
                      name="observations"
                      rows={30}
                      cols={40}
                    ></InputTextAreaField>
                  </div>
                </div>
                <div className="button-container">
                  <DangerButton>Cancelar</DangerButton>
                  <WarningButton>Borrar</WarningButton>
                  <SaveButton>Guardar</SaveButton>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </PublicationsOrderFormContainer>
  );
}
