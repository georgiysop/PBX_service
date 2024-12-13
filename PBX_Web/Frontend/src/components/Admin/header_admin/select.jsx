import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect() {
  const [selectTable, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }} style={{ color: rgb(122, 89, 255) }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">таблица</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectTable}
          label="Age"
          onChange={handleChange}
          style={{ color: rgb(122, 89, 255) }}
        >
          <MenuItem value={"Accounts"}>Аккаунты</MenuItem>
          <MenuItem value={"Tariffs"}>Тарифы</MenuItem>
          <MenuItem value={"Abonents"}>Абоненты</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
