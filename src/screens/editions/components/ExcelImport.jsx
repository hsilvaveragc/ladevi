import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Moment from "moment";
import { toast } from "react-toastify";
import { importEditions } from "../actionCreators";
import { getEditions } from "../reducer";
import { DangerButton } from "shared/components/Buttons";
import Modal from "shared/components/Modal";
import { tryCatch } from "ramda";

export default function ExcelImport() {
  const exampleImportEditions = "/assets/Example_import_editions.xlsx";
  const dispatch = useDispatch();

  // Estados del Redux store
  const editions = useSelector(getEditions);

  // onchange states
  const [open, setOpen] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);

  // Handlers
  const importHandler = data => {
    dispatch(importEditions(data));
  };

  const ExcelDateToJSDate = date => {
    try {
      if (date instanceof Date) {
        return date.toDateString();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // onchange event
  const handleFile = e => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = e => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Por favor seleccione solor archivos de tipo Excel.");
        setExcelFile(null);
      }
    } else {
      console.log("Por favor seleccione su archivo.");
    }
  };

  const downloadTxtFile = texto => {
    const element = document.createElement("a");
    const file = new Blob([texto], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `Error importacion edicion ${Moment(new Date()).format(
      "DD-MM-YYYY HH:mm:ss"
    )}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const validateHeaders = worksheet => {
    let errorMessagge = "La cabecera del archivo es incorrecta:\n";
    [
      { cell: "A1", headerName: "producto" },
      { cell: "B1", headerName: "titulo" },
      { cell: "C1", headerName: "codigo" },
      { cell: "D1", headerName: "edicion cerrada" },
      { cell: "E1", headerName: "fecha salida" },
    ].forEach(element => {
      if (!worksheet[element.cell]) {
        errorMessagge += `* La cabecera no existe en la celda ${element.cell}, debe ser "${element.headerName}".\n`;
      } else if (
        worksheet[element.cell].v.toLowerCase() !== element.headerName
      ) {
        errorMessagge += `* El nombre de la cabecera "${worksheet[
          element.cell
        ].v.toLowerCase()}" en la celda ${
          element.cell
        } es incorrecta, debe ser "${element.headerName}".\n`;
      }
    });

    if (errorMessagge.length > 39) {
      downloadTxtFile(errorMessagge);
      toast.error(
        "Error al importar el archivo, revise el documento descargado para mas detalle.",
        {
          closeButton: true,
        }
      );
      return false;
    }
    return true;
  };

  // submit event
  const handleFileSubmit = e => {
    if (excelFile !== null) {
      setTypeError(null);
      const workbook = XLSX.read(excelFile, {
        type: "buffer",
        cellDates: true,
      });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      if (validateHeaders(worksheet) == true) {
        const data = XLSX.utils
          .sheet_to_json(worksheet, { cellDates: true })
          .map(o => {
            return {
              product: o.Producto,
              title: o.Titulo,
              code: o.Codigo,
              closed: o["Edicion Cerrada"]
                ? o["Edicion Cerrada"].toLowerCase() == "si"
                  ? "true"
                  : o["Edicion Cerrada"].toLowerCase() == "no"
                  ? "false"
                  : null
                : "",
              departureDate: o["Fecha Salida"]
                ? ExcelDateToJSDate(o["Fecha Salida"])
                : "",
            };
          });
        setExcelData(data.slice(0, 10));
        importHandler(data);
      }
    } else {
      setTypeError("Por favor seleccione un archivo.");
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-info ml-2"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
        Importar
      </button>
      <Modal
        shouldClose={true}
        closeHandler={() => setOpen(false)}
        isOpen={open}
      >
        <strong> Seleccione el archivo a importar</strong>
        <br />
        <br />
        <input type="file" onChange={handleFile} />
        <br />
        <br />
        <button className="btn btn-info">
          <a
            href={exampleImportEditions}
            download="Ejemplo de archivo de importacion de ediciones"
            style={{ color: "white" }}
          >
            <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon> &nbsp; Archivo
            de ejemplo
          </a>
        </button>
        &nbsp;
        <button className="btn btn-success btn-md" onClick={handleFileSubmit}>
          Importar ediciones
        </button>
        &nbsp;
        <DangerButton onClickHandler={() => setOpen(false)}>
          Volver
        </DangerButton>
        <br />
        {typeError && (
          <>
            <br />
            <div className="alert alert-danger" role="alert">
              {typeError}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
