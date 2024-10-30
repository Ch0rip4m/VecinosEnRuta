import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function SimpleSelectLocation(props) {
  const name = props.name || "";
  const [value, setValue] = React.useState(props.formData[name] || "");

  const handleChange = (event) => {
    const selectedValue = props.values.find(
      (option) => option.value === event.target.value
    );
    setValue(selectedValue.value);
    props.onChange(selectedValue, name); // Enviamos el objeto seleccionado
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
      <TextField
        value={value}
        required
        select
        label={props.label}
        onChange={handleChange}
        fullWidth
      >
        {props.values.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
