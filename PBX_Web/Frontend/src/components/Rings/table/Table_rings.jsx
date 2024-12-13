import React from "react";
import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Calen from "../Calendar/calendar";
import s from "./Table_rings.module.css";

const Table = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/allRingsdate`
      )
        .then((res) => res.json())
        .then((data) => setData(data));
    } else {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/allRingsdate?startDate=${startDate}&endDate=${endDate}`
      )
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, [startDate, endDate]);

  const columns = [
    // { title: "ring_id", field: "ring_id" },
    { title: "Date start", field: "date_start" },
    { title: "Date end", field: "date_time_start" },
    { title: "~Time (min.)", field: "amount_of_time" },
    { title: "The caller ", field: "number_1" },
    { title: "Called subscriber", field: "number_2" },
    // { title: "Type ring", field: "type_ring" },
  ];

  return (
    <div>
      <div className={s.Calen}>
        <Calen setStartDate={setStartDate} setEndDate={setEndDate} />
      </div>
      <div className={s.table}>
        <MaterialTable
          title=""
          columns={columns}
          data={data}
          options={{
            search: true,
            searchAutoFocus: false,
            padding: true,
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
