import React from "react";
import Moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import pdfIcon from "shared/images/iconPdf.png";

const exportPDF = data => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  const fecha = new Date();
  const fechaFormatted = `${fecha.getFullYear()}/${fecha.getMonth() +
    1}/${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

  const title = "Espacios publicados por cliente";

  const headers = [
    [
      "Edición",
      "Salida",
      "Tipo de Espacio",
      "Cant.",
      "Moneda",
      "Importe",
      "Factura",
      "N°Cont.",
      "Contrato",
    ],
  ];

  const pdfData = data.map(d => [
    d.edicion,
    Moment(d.salida).format("DD-MM-YYYY"),
    d.tipoEspacio,
    d.cantidad,
    d.moneda,
    d.importe.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    `${d.billingCondition} ${d.factura}`,
    d.numero,
    d.contrato,
  ]);

  let content = {
    startY: 70,
    head: headers,
    body: pdfData,
    headStyles: {
      valign: "middle",
      cellWidth: "wrap",
    },
    columnStyles: {
      0: { cellWidth: "wrap" },
      1: { cellWidth: "wrap" },
      5: { cellWidth: "wrap" },
    },
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save(
    `Espacios publicados por cliente ${Moment(new Date()).format(
      "DD-MM-YYYY HH:mm:ss"
    )}.pdf`
  );
};

export default function PdfExport({ data }) {
  return (
    <button type="button" className="btn" onClick={() => exportPDF(data)}>
      <img src={pdfIcon} width="26" height="32" />
    </button>
  );
}
