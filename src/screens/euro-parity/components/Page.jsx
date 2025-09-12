import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modals from "./Modals";
import EuroTable from "./EuroTable";

const PageContainer = styled.div`
  width: 100%;
`;

export default function(props) {
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    props.actions.initialLoadEuroParity();
  }, [props.actions]);

  const handleDelete = item => {
    setSelectedItem(item);
    props.actions.showDeleteModalEuroParity();
  };

  return (
    <PageContainer>
      <Modals {...props} selectedItem={selectedItem} />
      <h2>Euros</h2>
      <hr />
      <EuroTable
        data={props.dataEuroParity}
        isLoading={props.isLoading}
        showAddModal={props.actions.showAddModalEuroParity}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
