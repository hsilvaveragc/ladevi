import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import Header from "../../shared/components/Header";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <>
            <Header
              {...props}
              logoutHandler={rest.actions.logoutInit}
              routeTitle={rest.routeTitle}
            />
            <Component {...props} />
          </>
        ) : (
          <>
            <Header {...props} />
            <Redirect to={"/login"} />
          </>
        )
      }
    />
  );
};

export default PrivateRoute;
