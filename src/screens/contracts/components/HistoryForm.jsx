import React from "react";
import styled from "styled-components";

const HistoryFormContainer = styled.div`
  margin-top: 10px;
  table {
    text-align: center;
  },
`;

export default function HistoryForm({ historicalData }) {
  return (
    <HistoryFormContainer className="container">
      <table className="table table-sm table-striped">
        <thead className="thead-light">
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Usuario</th>
            <th scope="col">Cambios</th>
          </tr>
        </thead>
        <tbody>
          {historicalData.map((h, index) => {
            //const fecha = new Date(h.date);
            //const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
            return (
              <tr key={h.id || index}>
                <td>{h.date}</td>
                <td>{h.user}</td>
                <td>{h.changes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </HistoryFormContainer>
  );
}
