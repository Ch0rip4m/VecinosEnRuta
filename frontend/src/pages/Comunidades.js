import { Container, Box } from "@mui/material";
import ContentListTable from "../components/Lista";
import Mapa from "../components/Mapas";
import React from "react";

export default function Comunidades() {
  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Mapa width="100%" height="250px" />
        <ContentListTable />
      </Box>
    </Container>
  );
}
