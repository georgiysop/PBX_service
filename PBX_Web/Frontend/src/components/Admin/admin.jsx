import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MaterialTable from "material-table";
import AddUser from "./header_admin/addUser";
import s from "./admin.module.css";

export default function Admin() {
  const [data, setData] = useState([]);
  const [selectTable, setSelectTable] = useState("Accounts");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let url = "";
    if (selectTable === "Accounts") {
      url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/allAccounts`;
    } else if (selectTable === "Tariffs") {
      url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/allTariffs`;
    } else if (selectTable === "Abonents") {
      url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/allAbonents`;
    }

    if (url) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, [selectTable]);

  const handleChange = (event) => {
    setSelectTable(event.target.value);
  };

  const columns = {
    Accounts: [
      { title: "Login", field: "login" },
      // { title: "Password", field: "password" },
      // { title: "Hash", field: "hash" },
    ],
    Tariffs: [
      { title: "Description", field: "description" },
      { title: "Price", field: "price" },
    ],
    Abonents: [
      { title: "Name", field: "last_name" },
      { title: "Number", field: "abonent_number" },
      { title: "Converted number", field: "convert_number" },
    ],
  };

  const handleRowAdd = async (newData) => {
    try {
      let url = "";
      if (selectTable === "Accounts") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/addAccount`;
      } else if (selectTable === "Tariffs") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/addTariff`;
      } else if (selectTable === "Abonents") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/addAbonent`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        // Обновить данные после успешного добавления
        const updatedData = await response.json();
        setData([...data, updatedData]);
        alert("Запись успешно добавлена");
      } else {
        console.error(
          "Ошибка добавления записи:",
          response.status,
          response.statusText
        );
        alert("Произошла ошибка при добавлении записи");
      }
    } catch (error) {
      console.error("Ошибка добавления записи:", error);
    }
  };

  const handleRowUpdate = async (newData, oldData) => {
    try {
      let url = "";
      if (selectTable === "Accounts") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/updateAccount`;
      } else if (selectTable === "Tariffs") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/updateTariff`;
      } else if (selectTable === "Abonents") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/updateAbonent`;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        // Обновить данные после успешного обновления
        const updatedData = await response.json();
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = updatedData;
        setData([...dataUpdate]);
        alert("Запись успешно обновлена");
      } else {
        console.error(
          "Ошибка обновления записи:",
          response.status,
          response.statusText
        );
        alert("Произошла ошибка при обновлении записи");
      }
    } catch (error) {
      console.error("Ошибка обновления записи:", error);
    }
  };

  const handleRowDelete = async (oldData) => {
    try {
      let url = "";
      if (selectTable === "Accounts") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/deleteAccount`;
      } else if (selectTable === "Tariffs") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/deleteTariff`;
      } else if (selectTable === "Abonents") {
        url = `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/deleteAbonent`;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(oldData),
      });

      if (response.ok) {
        // Обновить данные после успешного удаления
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        alert("Запись успешно удалена");
      } else {
        console.error(
          "Ошибка удаления записи:",
          response.status,
          response.statusText
        );
        alert("Произошла ошибка при удалении записи");
      }
    } catch (error) {
      console.error("Ошибка удаления записи:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: 200, marginTop: 20 }}>
          <Box>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Таблица</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectTable}
                label="Таблица"
                onChange={handleChange}
              >
                <MenuItem value={"Accounts"}>Аккаунты</MenuItem>
                <MenuItem value={"Tariffs"}>Тарифы</MenuItem>
                <MenuItem value={"Abonents"}>Абоненты</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>

        {selectTable === "Accounts" && <AddUser />}
      </div>
      {selectTable !== "Accounts" ? (
        <div className={s.table}>
          <MaterialTable
            title=""
            columns={columns[selectTable]}
            data={data}
            editable={{
              onRowAdd: (newData) => {
                return handleRowAdd(newData).then(() => {
                  fetch(
                    `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/all${selectTable}`
                  )
                    .then((res) => res.json())
                    .then((newData) => setData(newData));
                });
              },

              onRowUpdate: (newData, oldData) => {
                return handleRowUpdate(newData, oldData).then(() => {
                  fetch(
                    `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/all${selectTable}`
                  )
                    .then((res) => res.json())
                    .then((newData, oldData) => setData(newData, oldData));
                });
              },

              onRowDelete: (oldData) => handleRowDelete(oldData),
            }}
            options={{
              search: true,
              padding: true,
              searchAutoFocus: false,
              exportButton: true,
              pageSize: 20,
              pageSizeOptions: [20, 50, 100],
            }}
          />
        </div>
      ) : (
        <div className={s.table}>
          <MaterialTable
            title=""
            columns={columns[selectTable]}
            data={data}
            editable={{
              onRowDelete: (oldData) => handleRowDelete(oldData),
            }}
            options={{
              search: true,
              padding: true,
              searchAutoFocus: false,
              exportButton: true,
              pageSize: 20,
              pageSizeOptions: [20, 50, 100],
            }}
          />
        </div>
      )}
    </div>
  );
}
