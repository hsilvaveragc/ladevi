import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import appDataReducer from "./appData";
import userReducer from "screens/users/reducer";
import loginReducer from "screens/login/reducer";
import clientsReducer from "screens/clients/reducer";
import accountingFieldsReducer from "screens/accounting-fields/reducer";
import editionsReducer from "screens/editions/reducer";
import productsReducer from "screens/products/reducer";
import advertisingSpacesReducer from "screens/ad-spaces/reducer";
import contractsReducer from "screens/contracts/reducer";
import ordersReducer from "screens/orders/reducer";
import ordersForProductionReportReducer from "screens/ordersForProductionReport/reducer";
import publishedOrderBySellerReportReducer from "screens/publishedSpaceBySellerReport/reducer";
import publishedOrderByClientReportReducer from "screens/publishedSpaceByClientReport/reducer";
import pendientContractReportReducer from "screens/pendientContractReport/reducer";
import auditoryReducer from "screens/auditory/reducer";
import currencyReducer from "screens/currency/reducer";
import euroParityReducer from "screens/euro-parity/reducer";

const reducers = {
  appData: appDataReducer,
  login: loginReducer,
  clients: clientsReducer,
  users: userReducer,
  accountingFields: accountingFieldsReducer,
  editions: editionsReducer,
  products: productsReducer,
  advertisingSpaces: advertisingSpacesReducer,
  contracts: contractsReducer,
  orders: ordersReducer,
  ordersForProductionReport: ordersForProductionReportReducer,
  publishedOrderBySellerReport: publishedOrderBySellerReportReducer,
  publishedOrderByClientReport: publishedOrderByClientReportReducer,
  pendientContractReport: pendientContractReportReducer,
  auditory: auditoryReducer,
  currency: currencyReducer,
  euroParity: euroParityReducer,
};

export default function createRootReducer(history) {
  return combineReducers({ router: connectRouter(history), ...reducers });
}
