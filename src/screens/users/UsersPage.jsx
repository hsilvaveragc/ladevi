import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Modal from "shared/components/Modal";
import Table from "shared/components/Table";
import { EditButton, RemoveButton } from "shared/components/Buttons";

import UserForm from "./components/UserForm";
import Filter from "./components/Filter";

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: top;
  align-items: center;
  flex-direction: column;
  padding: 50px 30px 0 30px;
  width: 100%;
  box-sizing: border-box;
  h2 {
    margin-bottom: 3rem;
  }
`;

export default function UsersPage(props) {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const rowClickHandler = (e, selectedItem) => {
    setSelectedItem({ ...selectedItem });
    props.actions.showEditModal();
  };

  const Cell = ({ original }) => {
    const rol = props.availableAppRoles.filter(
      x => x.id === original.applicationRoleId
    )[0];
    return rol.name === "Vendedor Nacional" || rol.name === "Vendedor COMTUR"
      ? `${original.commisionCoeficient.toLocaleString("pt-BR", {
          maximumFractionDigits: 2,
        })} %`
      : "N/A";
  };

  const columns = [
    {
      Header: "Nombre",
      accessor: "fullName",
    },
    {
      Header: "Iniciales",
      accessor: "initials",
    },
    {
      Header: "Rol",
      accessor: "applicationRole.name",
    },
    {
      Header: "País",
      accessor: "country.name",
    },
    {
      Header: "Email",
      accessor: "credentialsUser.email",
    },
    {
      Header: "Multip. comisión",
      accessor: "commisionCoeficient",
      Cell,
    },
    {
      Header: "Borrar",
      filterable: false,
      style: {
        display: "flex",
        justifyContent: "center",
      },
      Cell: row =>
        row.original.canDelete ? (
          <RemoveButton
            onClickHandler={() => {
              setSelectedItem({ ...row.original });
              props.actions.showDeleteModal();
            }}
          />
        ) : (
          <div />
        ),
    },
  ];
  return (
    <PageContainer>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showEditModal}
        isOpen={props.showEditModal}
      >
        <UserForm
          selectedItem={selectedItem}
          saveHandler={props.actions.editUserInit}
          closeHandler={props.actions.showEditModal}
          availableCountries={props.availableCountries}
          availableAppRoles={props.availableAppRoles}
          editMode={true}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showAddModal}
        isOpen={props.showAddModal}
      >
        <UserForm
          saveHandler={props.actions.addUserInit}
          closeHandler={props.actions.showAddModal}
          availableCountries={props.availableCountries}
          availableAppRoles={props.availableAppRoles}
          addMode={true}
          selectedItem={{}}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showDeleteModal}
        isOpen={props.showDeleteModal}
      >
        <UserForm
          selectedItem={selectedItem}
          saveHandler={props.actions.deleteUserInit}
          closeHandler={props.actions.showDeleteModal}
          availableCountries={props.availableCountries}
          availableAppRoles={props.availableAppRoles}
          deleteMode={true}
          errors={props.errors}
        />
      </Modal>
      <Filter
        availableCountries={props.availableCountries}
        filterHandler={props.actions.filterUsers}
        resetFiltersHandler={props.actions.getUsersInit}
        availableRoles={props.availableAppRoles}
        handleChangeParams={setParams}
      />
      <div style={{ width: "100%" }}>
        <Table
          data={props.users}
          columns={columns}
          buttonHandler={props.actions.showAddModal}
          buttonText="Agregar Usuario"
          loading={props.isLoading}
          showButton
          rowClickHandler={rowClickHandler}
        ></Table>
      </div>
    </PageContainer>
  );
}
