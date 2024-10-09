import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button"; // Importar botón de MUI

export default function EditList(props) {

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: props.height }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              {/* Agregamos una columna más para las acciones */}
              <TableCell align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row, rowIndex) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code || rowIndex}>
                  {props.columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={`${column.id}-${rowIndex}`} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                  {/* Columna con botones de edición y eliminación */}
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => props.onEdit(row, rowIndex)}
                      sx={{ marginRight: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => props.onDelete(row, rowIndex)}
                    >
                      Eliminar
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
