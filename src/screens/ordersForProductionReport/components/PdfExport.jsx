import React from "react";
import Moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import pdfIcon from "shared/images/iconPdf.png";

const exportPDF = (addReporteGeneration, data, productEditionId) => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  const fecha = new Date();
  const fechaFormatted = `${fecha.getFullYear()}/${fecha.getMonth() +
    1}/${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

  const title = "Órdenes de publicación para producción";
  const subTitulo = `Producto: ${data[0].product}, Edición: ${data[0].productEdition}, Fecha Emisión: ${fechaFormatted}`;

  const headers = [
    [
      "Cliente",
      "Tipo de Espacio",
      "Ubicación",
      "B x A",
      "N°Cont.",
      "Contrato",
      "Cant.",
      "Pág.",
      "Observaciones",
      "Vend.",
    ],
  ];

  const pdfData = data.map(d => [
    `${d.brandName} ${d.legalName}`,
    d.spaceType,
    d.spaceLocation,
    d.bxA,
    d.contractId,
    d.contractName,
    d.quantity,
    d.pageNumber,
    d.observations,
    d.seller,
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
      3: { cellWidth: "wrap" },
      4: { cellWidth: "wrap" },
      6: { cellWidth: "wrap" },
      7: { cellWidth: "wrap" },
      9: { cellWidth: "wrap" },
    },
  };

  doc.text(title, marginLeft, 40);
  doc.setFontSize(10);
  doc.text(subTitulo, marginLeft, 55);
  doc.autoTable(content);
  doc.save(
    `Ordenes de publicación ${Moment(new Date()).format(
      "DD-MM-YYYY HH:mm:ss"
    )}.pdf`
  );

  addReporteGeneration(productEditionId);
};

export default function PdfExport({
  addReporteGeneration,
  data,
  productEditionId,
}) {
  return (
    <button
      type="button"
      className="btn"
      onClick={() => exportPDF(addReporteGeneration, data, productEditionId)}
    >
      <img src={pdfIcon} width="26" height="32" />
    </button>
  );
}
