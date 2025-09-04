import React from "react";
import Moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import pdfIcon from "shared/images/iconPdf.png";

const exportPDF = (clients, data) => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  const fecha = new Date();

  const title = "Contratos pendientes por vendedor";

  const pdfData = clients.map(d => [d.client]);

  doc.text(title, marginLeft, 40);

  pdfData.forEach(item => {
    const startYText = doc.lastAutoTable ? doc.lastAutoTable.finalY + 25 : 60;
    doc.text(item, marginLeft, startYText);
    const childs = data
      .filter(x => x.client === item[0])
      .map(ch => [
        ch.numero,
        ch.contrato,
        ch.spaceType,
        ch.selledQuantity,
        ch.balance,
        ch.moneda,
        ch.amount.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        ch.moneda,
        ch.pendientAmount.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        `${ch.billingCondition} ${ch.invoice}`,
      ]);

    doc.autoTable({
      head: [
        [
          "N°Cont.",
          "Contrato",
          "Tipo de Espacio",
          "Cant.Publi.",
          "Saldo",
          "Moneda",
          "Importe unitario",
          "Moneda",
          "Imp. no publi.",
          "Factura",
        ],
      ],
      body: childs,
      headStyles: {
        valign: "middle",
        cellWidth: "wrap",
      },
      startY: startYText + 10,
    });
  });

  doc.save(
    `Contratos pendientes por vendedor ${Moment(new Date()).format(
      "DD-MM-YYYY HH:mm:ss"
    )}.pdf`
  );
};

export default function PdfExport({ clients, data }) {
  return (
    <button
      type="button"
      className="btn"
      onClick={() => exportPDF(clients, data)}
    >
      <img src={pdfIcon} width="26" height="32" />
    </button>
  );
}
