import React, { useState, useEffect } from "react";
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
        title: "Contrato".toLocaleUpperCase(),
        width: { wpx: 400 },
        style: haederStyle,
      },
      {
        title: "Espacio".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "Cant.".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Moneda".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Importe".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Vendedor".toLocaleUpperCase(),
        width: { wpx: 180 },
        style: haederStyle,
      },
      {
        title: "Factura".toLocaleUpperCase(),
        width: { wpx: 100 },
        style: haederStyle,
      },
      {
        title: "Pág.".toLocaleUpperCase(),
        width: { wpx: 100 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      { value: d.brandName, style: { font: { sz: bodySizeText } } },
      {
        value: d.contractName,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.productAdvertisingSpace,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.quantity,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.currency,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.total,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.seller,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.invoiceNumber,
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
    ]),
  },
];

export default function ExcelExport({ tableRef }) {
  const [excelD, setExcelD] = React.useState([]);

  React.useEffect(() => {
    if (Array.isArray(excelD) && excelD.length > 0) {
      const button = window.document.getElementById("excelButton");
      button.click();
    }
  }, [excelD]);

  const getExcelData = () => {
    const data = (
      tableRef?.current?.paginationContext?.props?.data ||
      tableRef?.current ||
      []
    ).map(d => ({
      brandName: d.client.brandName,
      contractName: d.contract ? d.contract.name : "",
      productAdvertisingSpace: d.productAdvertisingSpace.name,
      quantity: d.quantity,
      currency: d.moneda,
      total: d.total,
      seller: d.seller.fullName,
      invoiceNumber: d.invoiceNumber,
      pageNumber: d.pageNumber,
    }));
    return data;
  };

  const handleClickExcel = () => {
    setExcelD(getExcelData());
  };

  return (
    <>
      <button type="button" className="btn" onClick={handleClickExcel}>
        <img src={excelIcon} width="26" height="32" />
      </button>
      <ExcelFile
        filename={`Órdenes de publicación ${Moment(new Date()).format(
          "DD-MM-YYYY HH:mm:ss"
        )}`}
        element={
          <button
            type="button"
            className="btn"
            id="excelButton"
            style={{ display: "none" }}
          >
            <img src={excelIcon} width="26" height="32" />
          </button>
        }
      >
        <ExcelSheet dataSet={getReporteExcelfile(excelD)} name="Reporte" />
      </ExcelFile>
    </>
  );
}
