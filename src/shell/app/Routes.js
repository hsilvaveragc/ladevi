import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { ConnectedRouter } from "connected-react-router";
import { ToastContainer, Zoom } from "react-toastify";

import { history } from "../../shared/store/history";
import LoginPage from "../../screens/login";
import ClientsPage from "../../screens/clients";
import ContractsPage from "../../screens/contracts";
import HomePage from "../../screens/home";
import OrdersPage from "../../screens/orders";
import ReportsPage from "../../screens/reports";
import SettingsPage from "../../screens/settings";
import UsersPage from "../../screens/users";
import AccountingFields from "../../screens/accounting-fields";
import Editions from "../../screens/editions";
import Products from "../../screens/products";
import AdvertisingSpaces from "../../screens/ad-spaces";
import OrdersForProductionReport from "../../screens/ordersForProductionReport";
import PublishedSpaceBySellerReport from "../../screens/publishedSpaceBySellerReport";
import PublishedSpaceByClientReport from "../../screens/publishedSpaceByClientReport";
import PendientContractReport from "../../screens/pendientContractReport";
import Auditory from "../../screens/auditory";
import Moneda from "../../screens/currency";
import RetrievePassword from "../../screens/login/components/RetrievePassword";

import PrivateRoute from "./PrivateRoute";

const RoutesContainer = styled.main`
  background-color: #f0f4f8;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Routes = props => {
  const userRole = localStorage.getItem("loggedUser"); //.toString();
  const roleName = userRole ? userRole.toString() : "";
  const isSeller =
    roleName == "Vendedor Nacional" || roleName == "Vendedor COMTUR";

  console.log(props);

  return (
    <ConnectedRouter history={history}>
      <LayoutContainer>
        <ToastContainer
          transition={Zoom}
          position="top-right"
          autoClose={2500}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
          closeButton={false}
          bodyClassName={"toaster-container"}
        />
        <RoutesContainer>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              component={HomePage}
              {...props}
              routeTitle="Home"
            />
            <Route
              path="/recuperar-contrasena"
              component={RetrievePassword}
              {...props}
            />
            <PrivateRoute path="/clientes" component={ClientsPage} {...props} />
            <PrivateRoute
              path="/reportes/reportOPP"
              routeTitle="Órdenes de Publicación para Producción"
              component={OrdersForProductionReport}
              {...props}
            />
            <PrivateRoute
              path="/reportes/reportEPV"
              routeTitle="Espacios publicados por vendedor"
              component={PublishedSpaceBySellerReport}
              {...props}
            />
            <PrivateRoute
              path="/reportes/reportEPC"
              routeTitle="Espacios publicados por cliente"
              component={PublishedSpaceByClientReport}
              {...props}
            />
            <PrivateRoute
              path="/reportes/reporteCPV"
              routeTitle="Contratos pendientes por vendedor"
              component={PendientContractReport}
              {...props}
            />
            <PrivateRoute
              path="/contratos"
              component={ContractsPage}
              {...props}
            />
            <PrivateRoute
              path="/ordenes"
              component={OrdersPage}
              routeTitle="Órdenes de Publicación"
              {...props}
            />
            <PrivateRoute path="/reportes" component={ReportsPage} {...props} />

            <PrivateRoute
              path="/usuarios"
              component={isSeller ? HomePage : UsersPage}
              {...props}
            />
            <PrivateRoute
              exact={true}
              path="/configuracion"
              routeTitle={isSeller ? "Home" : "Configuración"}
              component={isSeller ? HomePage : SettingsPage}
              {...props}
            />
            <PrivateRoute
              path="/configuracion/contables"
              component={isSeller ? HomePage : AccountingFields}
              routeTitle={
                isSeller ? "Home" : "Administración de Campos Contables"
              }
              {...props}
            />
            <PrivateRoute
              path="/configuracion/productos"
              component={isSeller ? HomePage : Products}
              routeTitle={isSeller ? "Home" : "Administración de Productos"}
              {...props}
            />
            <PrivateRoute
              path="/configuracion/espacios"
              component={isSeller ? HomePage : AdvertisingSpaces}
              routeTitle={
                isSeller ? "Home" : "Administración de Tipos de espacio"
              }
              {...props}
            />
            <PrivateRoute
              path="/configuracion/ediciones"
              component={isSeller ? HomePage : Editions}
              routeTitle={isSeller ? "Home" : "Administración de Ediciones"}
              {...props}
            />

            <PrivateRoute
              path="/configuracion/monedas"
              component={isSeller ? HomePage : Moneda}
              routeTitle={isSeller ? "Home" : "Administración de Monedas"}
              {...props}
            />

            <PrivateRoute
              path="/auditoria"
              component={isSeller ? HomePage : Auditory}
              routeTitle={isSeller ? "Home" : "Auditoría"}
              {...props}
            />
            <Route path="/login" component={LoginPage} {...props} />
          </Switch>
        </RoutesContainer>
      </LayoutContainer>
    </ConnectedRouter>
  );
};

export default Routes;
