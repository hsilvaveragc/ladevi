import React from "react";
import ReactExport from "react-data-export";
import Moment from "moment";
import excelIcon from "shared/images/iconExcel.png";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const haederStyle = {
  font: {
    sz: "12",
    bold: true,
    color: { rgb: "ffffff" },
  },
  alignment: { horizontal: "center" },
  fill: {
    patternType: "solid",
    fgColor: { rgb: "003e6b" },
  },
};
const bodySizeText = "12";

const getReporteExcelfile = data => [
  {
    columns: [
      {
        title: "Cliente".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "Tipo de Espacio".toLocaleUpperCase(),
        width: { wpx: 180 },
        style: haederStyle,
      },
      {
        title: "Ubicación".toLocaleUpperCase(),
        width: { wpx: 180 },
        style: haederStyle,
      },
      {
        title: "B x A".toLocaleUpperCase(),
        width: { wpx: 120 },
        style: haederStyle,
      },
      {
        title: "N°Cont.".toLocaleUpperCase(),
        width: { wpx: 90 },
        style: haederStyle,
      },
      {
        title: "Contrato".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "Cantidad".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Página".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Observaciones".toLocaleUpperCase(),
        width: { wpx: 120 },
        style: haederStyle,
      },
      {
        title: "Vdor".toLocaleUpperCase(),
        width: { wpx: 160 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      {
        value: `${d.brandName} ${d.legalName}`,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.spaceType ? d.spaceType : "",
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.spaceLocation,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.bxA,
        style: { font: { sz: bodySizeText } },
      },
      { value: d.contractId, style: { font: { sz: bodySizeText } } },
      {
        value: d.contractName,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: !d.quantity
          ? ""
          : isNaN(d.quantity)
          ? d.quantity
          : Number(d.quantity),
        style: { font: { sz: bodySizeText } },
      },
      {
        value: !d.pageNumber
          ? ""
          : isNaN(d.pageNumber)
          ? d.pageNumber
          : Number(d.pageNumber),
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.observations,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.seller,
        style: { font: { sz: bodySizeText } },
      },
    ]),
  },
];

export default function ExcelExport({
  addReporteGeneration,
  data,
  productEditionId,
}) {
  return (
    <ExcelFile
      filename={`Órdenes de publicación ${Moment(new Date()).format(
        "DD-MM-YYYY HH:mm:ss"
      )}`}
      element={
        <button
          type="button"
          className="btn"
          onClick={() => addReporteGeneration(productEditionId)}
        >
          <img src={excelIcon} width="26" height="32" />
        </button>
      }
    >
      <ExcelSheet dataSet={getReporteExcelfile(data)} name="Reporte" />
    </ExcelFile>
  );
}
