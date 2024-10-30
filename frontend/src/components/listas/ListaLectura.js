import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function ReadList(props) {
  const handleRowClick = (row) => {
    if (props.onClickFunction) {
      props.onClickFunction(row);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: props.height, mb: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {props.columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  sx={{ padding: "4px 8px" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row, rowIndex) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.code || rowIndex}
                  onClick={() => handleRowClick(row)}
                  sx={{ cursor: "pointer" }}
                >
                  {props.columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={`${column.id}-${rowIndex}`}
                        align="center"
                        sx={{ padding: "4px 8px" }}
                      >
                        {Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "object" && value !== null
                          ? value[column.obj_id]
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
