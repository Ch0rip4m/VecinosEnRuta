import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button"; // Importamos Button de Material-UI

export default function TableRequest(props) {
  
  const handleJoinRequest = (routeName) => {
    // Aquí va la lógica cuando el usuario hace clic en el botón para unirse a la ruta
    console.log(`Solicitar unirse a la ruta: ${routeName}`);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableBody>
            {props.rows
              .map((row, rowIndex) => {
                //console.log(row)
                return (
                  <TableRow hover role="checkbox" key={rowIndex}>
                    {props.columns.map((column) => {
                      const value = row[column.id];
                      //console.log(value)
                      return (
                        <TableCell key={`${column.id}-${rowIndex}`} >
                          {value}
                        </TableCell>
                      );
                    })}
                    {/* Aquí agregamos el botón en cada fila */}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleJoinRequest(row.routeName)}
                      >
                        {props.buttonLabel}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
