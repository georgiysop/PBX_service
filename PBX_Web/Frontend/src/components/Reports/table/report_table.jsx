import React from "react";
import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import s from "./report_table.module.css";
import Calen from "../header_report/header_report";
import { Pagination } from "@mui/material";

const Table = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [buttonAbonent, setButtonAbonent] = useState(false);
  const [buttonRings, setButtonRings] = useState(true);

  useEffect(() => {
    if (buttonRings && (!startDate || !endDate)) {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/report_rings`
      )
        .then((res) => res.json())
        .then((data) => setData(data));
    }

    if (buttonRings && (startDate || endDate)) {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/report_rings?startDate=${startDate}&endDate=${endDate}`
      )
        .then((res) => res.json())
        .then((data) => setData(data));
    }

    if (buttonAbonent && (!startDate || !endDate)) {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/report_abonent`
      )
        .then((res) => res.json())
        .then((data) => setData(data));
    }

    if (buttonAbonent && (startDate || endDate)) {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/report_abonent?startDate=${startDate}&endDate=${endDate}`
      )
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, [buttonAbonent, buttonRings, startDate, endDate]);

  const columns_1 = [
    { title: "Date start", field: "date_start" },
    { title: "Caller", field: "caller" },
    { title: "Caller name", field: "caller_name" },
    { title: "Called subscriber", field: "called_subscriber" },
    { title: "~Total time(min) ", field: "total_time" },
    { title: "Total price(rub)", field: "total_price" },
  ];

  const columns_2 = [
    { title: "Caller", field: "caller" },
    { title: "Caller name", field: "caller_name" },
    // { title: "Called subscriber", field: "called_subscriber" },
    { title: "~Total time(min) ", field: "total_time" },
    { title: "Total price(rub)", field: "total_price" },
  ];

  const columns = buttonAbonent ? columns_2 : columns_1;

  return (
    <div>
      <div className={s.Calen}>
        <Calen
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setButtonAbonent={setButtonAbonent}
          setButtonRings={setButtonRings}
        />
      </div>
      <div className={s.table}>
        <MaterialTable
          title=""
          columns={columns}
          data={data}
          options={{
            padding: true,
            Pagination: true,
            search: true,
            searchAutoFocus: false,
            exportButton: true,
            pageSize: 30,
            pageSizeOptions: [30, 50, 100],
          }}
        />
      </div>
    </div>
  );
};

export default Table;
