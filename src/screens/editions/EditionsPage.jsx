import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import Modal from "shared/components/Modal";
import Table from "shared/components/Table";
import { RemoveButton } from "shared/components/Buttons";
import EditionsForm from "./components/EditionsForm";
import FiltersForm from "./components/FiltersForm";
// import ExcelExport from "./components/ExcelExport";
import ExcelImport from "./components/ExcelImport";
import { prop } from "ramda";

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: top;
  align-items: center;
  flex-direction: column;
  padding: 50px 30px 0 30px;
  width: 100%;
  box-sizing: border-box;
`;

const Filter = ({ filter, onChange }) => (
  <>
    <input
      type="text"
      onChange={event => {
        return onChange(event.target.value);
      }}
      placeholder="Filtro"
      style={{ width: "100%" }}
      value={filter ? filter.value : ""}
    />
  </>
);
const Cell = props => format(props.value, "DD-MM-YYYY");

const EditionsPage = props => {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const rowClickHandler = (e, item) => {
    setSelectedItem({ ...item });
    props.actions.showEditModal();
  };

  const columns = [
    {
      Header: "Producto",
      accessor: "product.name",
      Filter,
    },
    {
      Header: "Titulo",
      accessor: "name",
      Filter,
    },
    {
      Header: "Código",
      accessor: "code",
      Filter,
    },
    {
      Header: "Edición Cerrada",
      accessor: "Closed",
      Filter,
      Cell: row => {
        if (row.original.closed) {
          return "Si";
        } else {
          return "No";
        }
      },
    },
    {
      Header: "Fecha Salida",
      accessor: "end",
      Filter,
      Cell,
    },
    {
      Header: "Borrar",
      filterable: false,
      Cell: row => {
        if (row.original.canDelete) {
          return (
            <RemoveButton
              onClickHandler={() => {
                setSelectedItem({ ...row.original });
                props.actions.showDeleteModal();
              }}
            />
          );
        } else {
          return <div />;
        }
      },
    },
  ];

  return (
    <PageContainer>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showAddModal}
        isOpen={props.showAddModal}
      >
        <EditionsForm
          selectedItem={{}}
          addMode={true}
          saveHandler={props.actions.addEdition}
          closeHandler={props.actions.showAddModal}
          productsAvailable={props.productsAvailable}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showEditModal}
        isOpen={props.showEditModal}
      >
        <EditionsForm
          selectedItem={selectedItem}
          editMode={true}
          saveHandler={props.actions.editEdition}
          closeHandler={props.actions.showEditModal}
          productsAvailable={props.productsAvailable}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showDeleteModal}
        isOpen={props.showDeleteModal}
      >
        <EditionsForm
          selectedItem={selectedItem}
          deleteMode={true}
          saveHandler={props.actions.deleteEdition}
          closeHandler={props.actions.showDeleteModal}
          productsAvailable={props.productsAvailable}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <FiltersForm
        filterHandler={props.actions.filterEditions}
        productsAvailable={props.productsAvailable}
        resetFilterHandler={props.actions.getAllEditions}
        handleChangeParams={setParams}
      ></FiltersForm>
      <div style={{ width: "100%" }}>
        <Table
          data={props.editionsAvailable}
          columns={columns}
          buttonHandler={props.actions.showAddModal}
          buttonText="Agregar"
          showButton
          loading={props.isLoading}
          rowClickHandler={rowClickHandler}
          pageDefault={page}
          setPageDefault={setPage}
          pageSizeDefault={pageSize}
          setPageSizeDefault={setPageSize}
          element={
            <ExcelImport
              editions={props.editionsAvailable}
              importHandler={props.actions.importEditions}
              importHandlerFailure={props.actions.importEditionsFailure}
            />
          }
        ></Table>
      </div>
    </PageContainer>
  );
};

export default EditionsPage;
