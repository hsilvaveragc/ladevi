import axios from "axios";
import { getHeaders } from "shared/services/utils";
import { sortAlphabetically } from "shared/utils";
import { dissoc } from "ramda";

const setEndDateToEuroParity = start => {
  const endYear = new Date(start).getFullYear() + 30;
  return new Date(endYear, 11, 31);
};

export default {
  getAllEuroParities: () =>
    axios
      .post(
        `EuroParity/Search`,
        { take: 1000 },
        {
          headers: getHeaders(),
        }
      )
      .then(response => {
        console.log(response);
        return response.data.data;
      }),
  addEuroParity: payload =>
    axios
      .post(
        `EuroParity/Post`,
        {
          ...dissoc("id", {
            ...payload,
            end: setEndDateToEuroParity(payload.start),
          }),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  deleteEuroParity: payload =>
    axios
      .delete(`EuroParity/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
};
