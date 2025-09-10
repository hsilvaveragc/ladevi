import { all } from "redux-saga/effects";

import rootAppData from "../appData/saga";
import rootLoginSaga from "screens/login/saga";
import rootUsersSaga from "screens/users/saga";
import rootClientsSaga from "screens/clients/saga";
import rootAccountingFieldsSaga from "screens/accounting-fields/saga";
import rootEditionsSaga from "screens/editions/saga";
import rootProductsSaga from "screens/products/saga";
import rootProductAdvertisingSaga from "screens/ad-spaces/saga";
import rootContractsSaga from "screens/contracts/saga";
import rootOrdersSaga from "screens/orders/saga";
import rootOrderFPRSaga from "screens/ordersForProductionReport/saga";
import rootOrdersBySeller from "screens/publishedSpaceBySellerReport/saga";
import rootORdersByClient from "screens/publishedSpaceByClientReport/saga";
import rootPendientContract from "screens/pendientContractReport/saga";
import rootAuditory from "screens/auditory/saga";
import rootCurrency from "screens/currency/saga";
import rootEuroParity from "screens/euro-parity/saga";
import rootBillingSaga from "screens/billing/saga";
import rootProductionSaga from "screens/production/saga";

export default function* rootSaga() {
  yield all([
    rootLoginSaga(),
    rootAppData(),
    rootClientsSaga(),
    rootUsersSaga(),
    rootEditionsSaga(),
    rootAccountingFieldsSaga(),
    rootProductsSaga(),
    rootProductAdvertisingSaga(),
    rootContractsSaga(),
    rootOrdersSaga(),
    rootOrderFPRSaga(),
    rootOrdersBySeller(),
    rootORdersByClient(),
    rootPendientContract(),
    rootAuditory(),
    rootCurrency(),
    rootEuroParity(),
    rootBillingSaga(),
    rootProductionSaga(),
  ]);
}
