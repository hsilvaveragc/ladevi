import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { ConnectedRouter } from "connected-react-router";
import { ToastContainer, Zoom } from "react-toastify";
import useUser from "shared/security/useUser";
import { history } from "shared/redux/store/history";
import LoginPage from "../../screens/login";
import ClientsPage from "../../screens/clients";
import ContractsPage from "../../screens/contracts";
import HomePage from "../../screens/home";
import OrdersPage from "../../screens/orders";
import ReportsPage from "../../screens/reports";
import SettingsPage from "../../screens/settings";
import Billing from "../../screens/billing";
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

const Routes = () => {
  const { userRol } = useUser();

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
              routeTitle="Home"
            />
            <Route path="/recuperar-contrasena" component={RetrievePassword} />
            <PrivateRoute path="/clientes" component={ClientsPage} />
            <PrivateRoute
              path="/reportes/reportOPP"
              routeTitle="Órdenes de Publicación para Producción"
              component={OrdersForProductionReport}
            />
            <PrivateRoute
              path="/reportes/reportEPV"
              routeTitle="Espacios publicados por vendedor"
              component={PublishedSpaceBySellerReport}
            />
            <PrivateRoute
              path="/reportes/reportEPC"
              routeTitle="Espacios publicados por cliente"
              component={PublishedSpaceByClientReport}
            />
            <PrivateRoute
              path="/reportes/reporteCPV"
              routeTitle="Contratos pendientes por vendedor"
              component={PendientContractReport}
            />
            <PrivateRoute path="/contratos" component={ContractsPage} />
            <PrivateRoute
              path="/ordenes"
              component={OrdersPage}
              routeTitle="Órdenes de Publicación"
            />
            <PrivateRoute path="/reportes" component={ReportsPage} />
            <PrivateRoute
              path="/facturacion"
              component={Billing}
              routeTitle="Facturación"
            />
            <PrivateRoute
              path="/usuarios"
              component={userRol.isSeller ? HomePage : UsersPage}
            />
            <PrivateRoute
              exact={true}
              path="/configuracion"
              routeTitle={userRol.isSeller ? "Home" : "Configuración"}
              component={userRol.isSeller ? HomePage : SettingsPage}
            />
            <PrivateRoute
              path="/configuracion/contables"
              component={userRol.isSeller ? HomePage : AccountingFields}
              routeTitle={
                userRol.isSeller ? "Home" : "Administración de Campos Contables"
              }
            />
            <PrivateRoute
              path="/configuracion/productos"
              component={userRol.isSeller ? HomePage : Products}
              routeTitle={
                userRol.isSeller ? "Home" : "Administración de Productos"
              }
            />
            <PrivateRoute
              path="/configuracion/espacios"
              component={userRol.isSeller ? HomePage : AdvertisingSpaces}
              routeTitle={
                userRol.isSeller ? "Home" : "Administración de Tipos de espacio"
              }
            />
            <PrivateRoute
              path="/configuracion/ediciones"
              component={userRol.isSeller ? HomePage : Editions}
              routeTitle={
                userRol.isSeller ? "Home" : "Administración de Ediciones"
              }
            />

            <PrivateRoute
              path="/configuracion/monedas"
              component={userRol.isSeller ? HomePage : Moneda}
              routeTitle={
                userRol.isSeller ? "Home" : "Administración de Monedas"
              }
            />

            <PrivateRoute
              path="/auditoria"
              component={userRol.isSeller ? HomePage : Auditory}
              routeTitle={userRol.isSeller ? "Home" : "Auditoría"}
            />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </RoutesContainer>
      </LayoutContainer>
    </ConnectedRouter>
  );
};

export default Routes;
