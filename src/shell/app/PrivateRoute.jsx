import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from 'shared/components/Header';

import useUser from 'shared/security/useUser';
import useAppData from 'shared/appData/useAppData';

import { logoutInit } from '../../screens/login/actionCreators';

const PrivateRoute = ({ component: Component, routeTitle, ...rest }) => {
  const { isAuthenticated } = useUser();
  const dispatch = useDispatch();

  const {
    appRoles,
    countries,
    statesGroupedByCountry,
    districtsGroupedByState,
    actions,
    loadInitialData,
  } = useAppData();

  // Función para logout
  const handleLogout = () => dispatch(logoutInit());

  // Cargar datos iniciales cuando el componente se monta
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <>
            <Header
              {...props}
              logoutHandler={handleLogout}
              routeTitle={routeTitle}
            />
            <Component
              {...props}
              // Pasamos los datos y acciones como props para mantener compatibilidad
              appRoles={appRoles}
              countries={countries}
              statesGroupedByCountry={statesGroupedByCountry}
              districtsGroupedByState={districtsGroupedByState}
              actions={{
                ...actions,
                logoutInit: handleLogout,
              }}
            />
          </>
        ) : (
          <>
            <Header {...props} />
            <Redirect to={'/login'} />
          </>
        )
      }
    />
  );
};

export default PrivateRoute;
