import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppRoles,
  fetchCountries,
  fetchStates,
  fetchDistricts,
  fetchCitiesById,
  setLoggedUser,
} from "./actionCreators";
import {
  appRolesSelector,
  countriesSelector,
  statesGroupedByCountrySelector,
  districtsGroupedByStateSelector,
  loggedUserSelector,
} from "./reducers";

const useAppData = () => {
  const dispatch = useDispatch();

  // Selectores
  const appRoles = useSelector(appRolesSelector);
  const countries = useSelector(countriesSelector);
  const statesGroupedByCountry = useSelector(statesGroupedByCountrySelector);
  const districtsGroupedByState = useSelector(districtsGroupedByStateSelector);
  const loggedUser = useSelector(loggedUserSelector);

  // Acciones
  const actions = {
    fetchAppRoles: () => dispatch(fetchAppRoles()),
    fetchCountries: () => dispatch(fetchCountries()),
    fetchStates: () => dispatch(fetchStates()),
    fetchDistricts: () => dispatch(fetchDistricts()),
    fetchCitiesById: payload => dispatch(fetchCitiesById(payload)),
    setLoggedUser: payload => dispatch(setLoggedUser(payload)),
  };

  // Carga inicial de datos si es necesario
  const loadInitialData = () => {
    if (appRoles.length === 0) actions.fetchAppRoles();
    if (countries.length === 0) actions.fetchCountries();
    if (statesGroupedByCountry.length === 0) actions.fetchStates();
    if (districtsGroupedByState.length === 0) actions.fetchDistricts();
  };

  return {
    // Datos
    appRoles,
    countries,
    statesGroupedByCountry,
    districtsGroupedByState,
    loggedUser,

    // Acciones
    actions,

    // Helpers
    loadInitialData,
  };
};

export default useAppData;
