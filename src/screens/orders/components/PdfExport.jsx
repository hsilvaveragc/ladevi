import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { enhanceWordBreak, formatDateTimeForPDF } from 'shared/utils';
import pdfIcon from 'shared/images/iconPdf.png';

const exportPDF = (tableRef, filtersUsed, dataToExport) => {
  // const dataOriginal =
  //   tableRef.current.paginationContext.props.data || dataToExport;

  const dataOriginal = tableRef.current || dataToExport;

  const unit = 'pt';
  const size = 'A4'; // Use A1, A2, A3 or A4
  const orientation = 'portrait'; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  const fecha = new Date();
  const fechaFormatted = `${fecha.getFullYear()}/${
    fecha.getMonth() + 1
  }/${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

  const { producto, edicion, vendedor, cliente } = filtersUsed;

  const title = 'Órdenes de publicación';
  const subTitulo = `Producto: ${producto}, Edición: ${edicion}, Vendedor: ${vendedor}, Cliente: ${cliente}, Fecha Emisión: ${fechaFormatted}`;

  const headers = [
    [
      'Cliente',
      'Contrato',
      'Espacio',
      'Cant.',
      'Importe',
      'Vendedor',
      'Factura',
      'Pág.',
    ],
  ];

  const pdfData = dataOriginal.map((d) => [
    d.client.brandName,
    d.contract ? d.contract.name : '',
    d.productAdvertisingSpace.name,
    d.quantity,
    `${d.moneda} ${d.total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    d.seller.fullName,
    d.invoiceNumber,
    d.pageNumber,
  ]);

  const content = {
    startY: 70,
    head: headers,
    body: pdfData,
    headStyles: {
      valign: 'middle',
      cellWidth: 'wrap',
    },
    columnStyles: {
      1: { cellWidth: 150 },
    },
    didParseCell: enhanceWordBreak,
  };

  doc.text(title, marginLeft, 40);
  doc.setFontSize(10);
  doc.text(subTitulo, marginLeft, 55);
  doc.autoTable(content);
  doc.save(`Órdenes de publicación ${formatDateTimeForPDF(new Date())}.pdf`);
};

export default function PdfExport({ tableRef, filtersUsed, dataToExport }) {
  return (
    <button
      type='button'
      className='btn'
      onClick={() => exportPDF(tableRef, filtersUsed, dataToExport)}
    >
      <img src={pdfIcon} width='26' height='32' />
    </button>
  );
}
