import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function SimpleSelector(props) {
  const name = props.name || '';
  const [value, setValue] = React.useState(props.formData[name] || '');

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue(value);
    props.onChange(value, name);
  }

  return (
    <Box
      component="form"
      sx={{
        flexDirection: 'row',
        display : 'flex'
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
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}