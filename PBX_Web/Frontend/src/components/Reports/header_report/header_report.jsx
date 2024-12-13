import React, { useState } from "react";
import DatePicker from "react-datepicker";

// import "react-datepicker/dist/react-datepicker.css";
import Button from "@mui/material/Button";
// import moment from "moment";

export default function ReactDatepicker({
  setStartDate,
  setEndDate,
  setButtonAbonent,
  setButtonRings,
}) {
  const [startDate, setLocalStartDate] = useState(null);
  const [endDate, setLocalEndDate] = useState(null);
  const [buttonAbonent, setLocalButtonAbonent] = useState(false);
  const [buttonRings, setLocalButtonRings] = useState(true);

  const handleStartDateChange = (date) => {
    setLocalStartDate(date);
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setLocalEndDate(date);
    setEndDate(date);
  };

  const handleButtonAbonent = () => {
    setLocalButtonAbonent(true);
    setLocalButtonRings(false);
    setButtonAbonent(true);
    setButtonRings(false);
  };

  const handleButtonRings = () => {
    setLocalButtonRings(true);
    setLocalButtonAbonent(false);
    setButtonRings(true);
    setButtonAbonent(false);
  };

  return (
    <div style={{ display: "flex", marginRight: 20, alignItems: "center" }}>
      <div style={{ marginRight: 20 }}>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          className="calendar"
          placeholderText="Дата начала"
        />
      </div>
      <div style={{ marginRight: 20 }}>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          className="calendar"
          placeholderText="Дата окончания"
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: 10 }}>Сформировать отчёт по:</div>
        <div style={{ marginRight: 10 }}>
          <Button
            variant="contained"
            style={{ paddingLeft: 10, paddingRight: 10 }}
            onClick={handleButtonRings}
          >
            звонкам
          </Button>
        </div>
        <div style={{ marginRight: 10 }}>
          <Button
            variant="contained"
            style={{ paddingLeft: 10, paddingRight: 10 }}
            onClick={handleButtonAbonent}
          >
            номеру
          </Button>
        </div>
      </div>
    </div>
  );
}
