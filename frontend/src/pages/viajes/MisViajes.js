import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container } from "@mui/material";

export default function MisViajes() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Viajes Programados" />
          <Tab label="Viajes Realizados" />
        </Tabs>
      </Box>
    </Container>
  );
}
