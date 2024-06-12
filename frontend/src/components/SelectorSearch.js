import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SelectorSearch(props) {
  const name = props.name || "";
  const [value, setValue] = useState("" || props.formData[name]);
  const [inputValue, setInputValue] = useState("" || props.formData[name]);
  const freeSolo = props.freeSolo || false;

  const handleChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    props.onChange(newInputValue, name);
  };

  return (
    <Box
      component="form"
      sx={{
        flexDirection: "row",
        display: "flex",
      }}
      fullWidth
    >
      <Autocomplete
        fullWidth
        freeSolo={freeSolo}
        value={value || ""}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue || ""}
        onInputChange={(event, newInputValue) => {
          handleChange(event, newInputValue);
        }}
        options={[...props.values, ""]}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />
    </Box>
  );
}
