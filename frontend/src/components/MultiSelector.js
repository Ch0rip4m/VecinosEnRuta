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

function getStyles(val, label, theme) {
  return {
    fontWeight:
      label.indexOf(val) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props) {
  const theme = useTheme();
  const name = props.name || "";
  const [label, setLabel] = React.useState(props.formData[name] || []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setLabel(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    props.onChange(value, name);
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel required>{props.label}</InputLabel>
        <Select
          multiple
          value={label}
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
          {props.values.map((val) => (
            <MenuItem
              key={val}
              value={val}
              style={getStyles(val, label, theme)}
            >
              {val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
