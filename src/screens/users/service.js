import axios from "axios";
import { dissoc } from "ramda";
import { sortAlphabetically, sortCaseInsensitive } from "shared/utils";
import { getHeaders } from "shared/services/utils";

const getFilters = payload => {
  let result = null;
  const filters = [];

  if (payload.name) {
    filters.push({
      field: "fullName",
      operator: "contains",
      value: payload.name,
    });
  }

  if (payload.countryId && payload.countryId !== -1) {
    filters.push({
      field: "countryId",
      operator: "eq",
      value: payload.countryId,
    });
  }

  if (payload.email) {
    filters.push({
      field: "email",
      operator: "contains",
      value: payload.email,
    });
  }

  if (payload.applicationRoleId && payload.applicationRoleId !== -1) {
    filters.push({
      field: "applicationRoleId",
      operator: "eq",
      value: payload.applicationRoleId,
    });
  }

  if (filters.length > 0) {
    result = {
      logic: "and",
      filters,
    };
  }
  return result;
};

const getFiltersUsers = () => {
  const filter = [];
  let result = null;

  const isSupervisor = localStorage.getItem("loggedUser") == "Supervisor";

  // if (isSupervisor) {
  //   const countryId = localStorage.getItem("userCountryId");
  //   filter.push({
  //     field: "countryId",
  //     operator: "eq",
  //     value: countryId,
  //   });
  // }

  if (filter.length > 0) {
    result = {
      logic: "and",
      filters: filter,
    };
  }

  return result;
};

export default {
  filterUsers: payload =>
    axios
      .post(
        `ApplicationUsers/search`,
        {
          take: 1000,
          filter: getFilters(payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortAlphabetically(response.data.data, "name")),
  getUsers: () =>
    axios
      .post(
        `ApplicationUsers/search`,
        {
          take: 1000,
          filter: getFiltersUsers(),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => sortCaseInsensitive(response.data.data, "fullName")),
  addUser: payload =>
    axios
      .post(
        `ApplicationUsers/Post`,
        {
          ...dissoc("id", payload),
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  editUser: payload =>
    axios
      .put(
        `ApplicationUsers/Put/${payload.id}`,
        {
          ...payload,
        },
        {
          headers: getHeaders(),
        }
      )
      .then(response => response.data.data),
  deleteUser: payload =>
    axios
      .delete(`ApplicationUsers/Delete/${payload.id}`, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
  changePassword: payload =>
    axios
      .post(`ApplicationUsers/ChangePassword`, payload, {
        headers: getHeaders(),
      })
      .then(response => response.data.data),
  getAllApplicationUserOptions: () =>
    axios
      .get(`ApplicationUsers/Options`, {
        headers: getHeaders(),
      })
      .then(response => sortAlphabetically(response.data, "fullName")),
};
