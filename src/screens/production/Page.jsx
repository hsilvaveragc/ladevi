import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "shared/utils";
// import { CONSTANTS } from "./constants";
// import { initialLoad } from "./actionCreators";
// import {
//   getLoading,
//   getSelectedClient,
//   getEntityType,
//   getSelectedEdition,
// } from "./reducer";
import FullWidthProgressBar from "shared/components/FullWidthProgressBar";
// import SelectorsContainer from "./components/SelectorsContainer";
// import ContractsTable from "./components/ContractsTable";
// import OrdersTable from "./components/OrdersTable";
// import Cart from "./components/Cart";
// import InvoiceContractDialog from "./components/InvoiceContractDialog";
// import InvoiceOrderDialog from "./components/InvoiceOrderDialog";

const ProductionPage = () => {
  const dispatch = useDispatch();

  // const loading = useSelector(getLoading);
  // const entityType = useSelector(getEntityType);
  // const selectedClient = useSelector(getSelectedClient);
  // const selectedEdition = useSelector(getSelectedEdition);

  useEffect(() => {
    // dispatch(initialLoad());
  }, [dispatch]);

  return (
    <>
      {/* <FullWidthProgressBar show={loading} /> */}

      <PageContainer>
        <div className="row" style={{ width: "100%" }}></div>
      </PageContainer>
    </>
  );
};

export default ProductionPage;
