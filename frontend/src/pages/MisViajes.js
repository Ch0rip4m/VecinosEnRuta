import { Button, Container, Box, Grid } from "@mui/material";
import ContentListTable from "../components/Lista";
import React from "react";

export default function MisViajes() {
  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid container spacing={5}>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              viajes realizados
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              viajes programados
            </Button>
          </Grid>
        </Grid>
        <ContentListTable />
      </Box>
    </Container>
  );
}
