import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(val, selectedValues, theme) {
  return {
    fontWeight:
      selectedValues.indexOf(val) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props) {
  const theme = useTheme();
  const name = props.name || "";
  
  // Inicializamos el estado con los valores de selección que sean proporcionados en props
  const [selectedValues, setSelectedValues] = React.useState(props.formData[name] || []);

  // Usamos useEffect para actualizar el estado si los valores de props cambian
  React.useEffect(() => {
    setSelectedValues(props.formData[name] || []);
  }, [props.formData, name]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    
    // Eliminamos duplicados utilizando Set para cualquier tipo de valores
    const uniqueValues = [...new Set(typeof value === "string" ? value.split(",") : value)];

    // Actualizamos el estado local con los valores únicos
    setSelectedValues(uniqueValues);

    // Enviamos los valores únicos al componente padre
    props.onChange(uniqueValues, name);
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }} disabled={props.disabled}>
        <InputLabel>{props.label}</InputLabel>
        <Select
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput label={props.label} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {/* Mapeamos todos los posibles valores */}
          {props.values.map((val) => (
            <MenuItem
              key={val}
              value={val}
              style={getStyles(val, selectedValues, theme)}
            >
              {val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
