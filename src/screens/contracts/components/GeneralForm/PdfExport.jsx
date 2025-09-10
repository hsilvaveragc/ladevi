import React from "react";
import Moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { enhanceWordBreak } from "../../../../shared/utils/index.jsx";
import pdfIcon from "shared/images/iconPdf.png";

const exportPDF = (
  data,
  availableProducts,
  productId,
  availableClients,
  clientId,
  contractName,
  availableSalesmens
) => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  const fecha = new Date();
  const fechaFormatted = `${fecha.getFullYear()}/${fecha.getMonth() +
    1}/${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

  const producto = availableProducts.find(x => x.id === productId).name;
  const cliente = availableClients.find(x => x.id === clientId).brandName;
  const title = "Órdenes de publicación";
  const subTitulo1 = `Contrato: ${contractName}`;
  const subTitulo2 = `Producto: ${producto}, Cliente: ${cliente}, Fecha Emisión: ${fechaFormatted}`;

  const headers = [
    [
      "Edición",
      "Espacio",
      "Ubicación",
      "Cant.",
      "Observaciones",
      "Vend.",
      "Factura",
      "Pág.",
    ],
  ];

  const pdfData = data.map(d => [
    d.productEdition.name,
    d.productAdvertisingSpace.name,
    d.advertisingSpaceLocationType.name,
    d.quantity,
    d.observations,
    availableSalesmens.find(x => x.id === d.sellerId).fullName,
    d.invoiceNumber,
    d.pageNumber,
  ]);

  let content = {
    startY: 90,
    head: headers,
    body: pdfData,
    headStyles: {
      valign: "middle",
      cellWidth: "wrap",
    },
    didParseCell: enhanceWordBreak,
  };

  doc.text(title, marginLeft, 40);
  doc.setFontSize(10);
  doc.text(subTitulo1, marginLeft, 55);
  doc.setFontSize(10);
  doc.text(subTitulo2, marginLeft, 70);
  doc.autoTable(content);
  doc.save(
    `Órdenes de publicación ${Moment(new Date()).format(
      "DD-MM-YYYY HH:mm:ss"
    )}.pdf`
  );
};

export default function PdfExport({
  data,
  availableProducts,
  productId,
  availableClients,
  clientId,
  contractName,
  availableSalesmens,
}) {
  return (
    <button
      type="button"
      className="btn"
      style={{ paddingRight: 0 }}
      onClick={() =>
        exportPDF(
          data,
          availableProducts,
          productId,
          availableClients,
          clientId,
          contractName,
          availableSalesmens
        )
      }
    >
      <img src={pdfIcon} width="26" height="32" />
    </button>
  );
}
