import { format } from 'date-fns';
import jsPDF from 'jspdf';

import 'jspdf-autotable';
import pdfIcon from 'shared/images/iconPdf.png';

const exportPDF = (data) => {
  const unit = 'pt';
  const size = 'A4'; // Use A1, A2, A3 or A4
  const orientation = 'landscape'; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  const title = 'Espacios vendidos por vendedor';

  const headersMain = [
    [
      'Edición',
      'País Prod.',
      'Salida',
      'Pág.',
      'Cliente',
      'Vendedor',
      'N°Cont.',
      'Contrato',
      'Tipo de Espacio',
      'Comisión %',
      'Cant.',
      'Moneda',
      'Importe',
      'Nº Factura',
    ],
  ];

  const pdfDataMain = data.main.map((d) => [
    d.edicion,
    d.productCountry,
    format(d.fechaSalida, 'DD/MM/YYYY'),
    d.pagina,
    `${d.marca} ${d.razonSocial}`,
    d.vendedor,
    d.numero,
    d.contrato,
    d.tipoEspacio,
    `${d.comisionData.comisionAntes.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} --> ${d.comisionData.comisionDespues.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    d.quantity,
    d.moneda,
    d.importe.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    `${d.billingCondition} ${d.invoice}`,
  ]);

  const contentMain = {
    startY: 70,
    head: headersMain,
    body: pdfDataMain,
    headStyles: {
      valign: 'middle',
      cellWidth: 'wrap',
    },
    styles: { fontSize: 8 },
  };

  doc.text(title, marginLeft, 40);
  doc.setFontSize(10);
  doc.autoTable(contentMain);

  const headersResumenVendedor = [
    [
      'Vendedor',
      'Espacios Moneda Local',
      'Comisiones Moneda Local',
      'Espacios Dólares',
      'Comisiones Dólares',
    ],
  ];

  const pdfDataVendedor = data.bySeller.map((v) => [
    v.seller,
    v.totals.spacesLocalCurrency.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.comisionsLocalCurrency.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.spacesDolares.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.comisionDolares.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  ]);

  const contentVendedor = {
    startY: doc.lastAutoTable.finalY + 50,
    head: headersResumenVendedor,
    body: pdfDataVendedor,
    headStyles: {
      valign: 'middle',
      cellWidth: 'wrap',
    },
    styles: { fontSize: 8 },
  };

  doc.text('Resumen por vendedor', marginLeft, doc.lastAutoTable.finalY + 30);
  doc.autoTable(contentVendedor);

  const headersResumenEdition = [
    [
      'Edición',
      'Espacios Moneda Local',
      'Comisiones Moneda Local',
      'Espacios Dólares',
      'Comisiones Dólares',
    ],
  ];

  const pdfDataEdicion = data.byEdition.map((v) => [
    v.productEdition,
    v.totals.spacesLocalCurrency.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.comisionsLocalCurrency.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.spacesDolares.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.comisionDolares.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  ]);

  const contentEdicion = {
    startY: doc.lastAutoTable.finalY + 50,
    head: headersResumenEdition,
    body: pdfDataEdicion,
    headStyles: {
      valign: 'middle',
      cellWidth: 'wrap',
    },
    styles: { fontSize: 8 },
  };

  doc.text('Resumen por edición', marginLeft, doc.lastAutoTable.finalY + 30);
  doc.autoTable(contentEdicion);

  const headerResumenCuenta = [
    [
      'Moneda',
      'IVA',
      'Espacios Moneda Local',
      'Comisiones Moneda Local',
      'Espacios Dólares',
      'Comisiones Dólares',
    ],
  ];

  const pdfDataCuenta = data.byCuenta.map((v) => [
    v.currency,
    v.iva,
    v.totals.spacesLocalCurrency.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.comisionsLocalCurrency.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.spacesDolares.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    v.totals.comisionDolares.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  ]);

  const contentCuenta = {
    startY: doc.lastAutoTable.finalY + 50,
    head: headerResumenCuenta,
    body: pdfDataCuenta,
    headStyles: {
      valign: 'middle',
      cellWidth: 'wrap',
    },
    styles: { fontSize: 8 },
  };

  doc.text('Resumen por cuenta', marginLeft, doc.lastAutoTable.finalY + 30);
  doc.autoTable(contentCuenta);

  doc.save(
    `Espacios publicados por vendedor ${format(
      new Date(),
      'dd-MM-yyyy HH:mm:ss'
    )}
    )}.pdf`
  );
};

export default function PdfExport({ data }) {
  return (
    <button type='button' className='btn' onClick={() => exportPDF(data)}>
      <img src={pdfIcon} width='26' height='32' />
    </button>
  );
}
