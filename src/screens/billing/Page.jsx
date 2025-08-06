import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "shared/utils";
import { initialLoad } from "./actionCreators";
import {
  getLoading,
  getErrors,
  getSelectedClient,
  getEntityType,
} from "./reducer";
import ContractsTable from "./components/ContractsTable";
import OrdersTable from "./components/OrdersTable";
import Cart from "./components/Cart";
import ContractDialog from "./components/ContractDialog";
import OrderDialog from "./components/OrderDialog";
import InvoiceDialog from "./components/InvoiceDialog";
import SelectorsContainer from "./components/SelectorsContainer";

// Componente para el progress bar que se renderiza fuera del PageContainer
const FullWidthProgressBar = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50px", // Ajusta esto según la altura de tu header principal
        left: 0,
        right: 0,
        zIndex: 1030,
        height: "6px",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        className="progress"
        style={{
          height: "100%",
          borderRadius: 0,
        }}
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
          role="progressbar"
          style={{ width: "100%" }}
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

const BillingPage = () => {
  const dispatch = useDispatch();

  // Usando useSelector con los selectores definidos en reducer.js
  const loading = useSelector(getLoading);
  const errors = useSelector(getErrors);
  const selectedClient = useSelector(getSelectedClient);
  const entityType = useSelector(getEntityType);

  useEffect(() => {
    // Cargar los datos iniciales cuando el componente se monta
    dispatch(initialLoad());
  }, [dispatch]);

  return (
    <>
      {/* Progress bar a ancho completo de la página */}
      <FullWidthProgressBar show={loading} />

      <PageContainer>
        {/* {errors.general && (
          <div className="alert alert-danger">{errors.general}</div>
        )} */}

        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-8">
            <SelectorsContainer />
            {selectedClient && entityType === "CONTRACTS" && <ContractsTable />}
            {selectedClient && entityType === "EDITIONS" && <OrdersTable />}
          </div>

          <div className="col-md-4">
            <Cart />
          </div>
        </div>

        <ContractDialog />
        <OrderDialog />
        <InvoiceDialog />
      </PageContainer>
    </>
  );
};

export default BillingPage;
