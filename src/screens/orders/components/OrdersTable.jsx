import Table from 'shared/components/Table';
import 'shared/utils/extensionsMethods.js';
import { getHeaderStyleTable, createDeleteColumn } from 'shared/utils/index';

export const OrdersTable = ({
  data,
  isLoading,
  showAddModal,
  onEdit,
  onDelete,
  tableRef,
}) => {
  const columns = [
    {
      accessor: 'client.brandName',
      Header: 'Cliente',
      width: '20%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: 'contract.number',
      Header: 'N°Contrato',
      width: '5%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: 'contract.name',
      Header: 'Contrato',
      width: '20%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: 'productAdvertisingSpace.name',
      Header: 'Espacio',
      width: '15%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: 'quantity',
      Header: 'Cantidad',
      width: '5%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: 'total',
      Header: 'Importe',
      width: '5%',
      headerStyle: getHeaderStyleTable(),
      Cell: (props) =>
        `${props.original.moneda} ${props.original.total.toLocaleCurrency()}`,
    },
    {
      accessor: 'seller.fullName',
      Header: 'Vendedor',
      width: '15%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: 'invoiceNumber',
      Header: 'Factura',
      width: '5%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      accessor: 'pageNumber',
      Header: 'Pág',
      width: '5%',
      headerStyle: getHeaderStyleTable(),
    },
    createDeleteColumn(onDelete),
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
      buttonText='Agregar Orden de Publicación'
      loading={isLoading}
      showButton
      rowClickHandler={rowEvents.onClick}
      tableRef={tableRef}
    ></Table>
  );
};

export default OrdersTable;
