import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "shared/utils";
import { initialLoad } from "./actionCreators";
import { getLoading } from "./reducer";
import FullWidthProgressBar from "shared/components/FullWidthProgressBar";
import SelectorsContainer from "./components/SelectorsContainer";
import ProductionGrid from "./components/ProductionGrid";

const BillingPage = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getLoading);

  useEffect(() => {
    // dispatch(initialLoad());
  }, [dispatch]);

  return (
    <>
      <FullWidthProgressBar show={loading} />

      <PageContainer>
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-12">
            <SelectorsContainer />
          </div>
        </div>
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-12">
            <ProductionGrid />
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default BillingPage;
