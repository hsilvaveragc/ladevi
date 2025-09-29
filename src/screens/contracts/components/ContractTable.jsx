import Table from 'shared/components/Table';
import 'shared/utils/extensionsMethods.js';
import { getHeaderStyleTable, createDeleteColumn } from 'shared/utils/index';

const ContractTable = ({
  data,
  isLoading,
  showAddModal,
  onEdit,
  onDelete,
  onDeleteViibility,
}) => {
  const columns = [
    {
      Header: 'Nro',
      accessor: 'number',
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Cliente',
      accessor: 'client.legalName',
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Producto',
      accessor: 'product.name',
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Vendedor',
      accessor: 'seller.fullName',
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Nombre',
      accessor: 'name',
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      id: 'balance',
      Header: 'Saldo',
      accessor: (d) => {
        const saldos = d.soldSpaces.map((s) => s.balance).join(', ');
        return saldos;
      },
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      id: 'end',
      Header: 'F. vto',
      accessor: (d) => {
        const fechaEnd = new Date(d.end);
        return `${fechaEnd.getDate()}/${
          fechaEnd.getMonth() + 1
        }/${fechaEnd.getFullYear()}`;
      },
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    createDeleteColumn(onDelete, 'canDelete', onDeleteViibility),
  ];

  const rowEvents = {
    onClick: (e, selectedItem) => {
      if (e.target.type !== 'button') {
        onEdit(selectedItem);
      }
    },
  };

  return (
    <Table
      data={data}
      columns={columns}
      buttonHandler={showAddModal}
      buttonText='Agregar Contrato'
      loading={isLoading}
      showButton
      rowClickHandler={rowEvents.onClick}
    ></Table>
  );
};

export default ContractTable;
