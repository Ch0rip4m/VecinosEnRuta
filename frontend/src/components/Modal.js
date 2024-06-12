import { React, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { BACKEND_URL } from "../Utils/Variables";
import SimpleSelector from "./SimpleSelector";
import SelectorSearch from "./SelectorSearch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputData, setInputData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleDataSelectorChange = (event, name) => {
    setInputData({ ...inputData, [name]: event });
  };

  useEffect(() => {
    console.log("inputData", inputData);
  }, [inputData]);

  const handleSubmit = () => {
    console.log("inputData", inputData);
    axios
      .post(props.url, inputData)
      .then((response) => {
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        color="primary"
        variant="contained"
        fullWidth
      >
        {props.label}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              component="h1"
              variant="h6"
              sx={{ mb: 3, color: "text.primary" }}
            >
              {props.title}
            </Typography>
          </div>
          <Box component="form" noValidate>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {props.columns.map((column) => {
                if (!column.createable) {
                  return null;
                }
                const Field = getField({ type: column.type });
                return (
                  <Field
                    key={column.header}
                    {...column}
                    inputData={inputData}
                    handleInputChange={handleInputChange}
                    values={column.values}
                    handleDataSelectorChange={handleDataSelectorChange}
                  />
                );
              })}
            </Grid>
          </Box>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              sx={{ mr: 1.5 }}
              color="primary"
              variant="contained"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled
              fullWidth
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export function getField({ type }) {
  switch (type) {
    case "gridFieldText":
      return gridFieldText;
    case "gridFieldForeignKey":
      return gridFieldForeignKey;
    // case "gridFieldSearchSelector":
    //   return gridFieldSearchSelector;
    default:
      return gridFieldText;
  }
}

export function gridFieldText({
  header,
  accessorKey,
  inputData,
  handleInputChange,
}) {
  return (
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        label={header}
        name={accessorKey}
        value={inputData[accessorKey] || null}
        onChange={handleInputChange}
      />
    </Grid>
  );
}

// export function gridFieldSearchSelector({
//   header,
//   accessorKey,
//   inputData,
//   handleDataSelectorChange,
//   requestData,
// }) {
//   const [values, setValues] = React.useState([]);
//   useEffect(() => {
//     axios
//       .get(BACKEND_URL + "/db-manager/" + accessorKey + "/")
//       .then((response) => {
//         const getData = response.data.map((item) => item[requestData]);
//         setValues(getData);
//       })
//       .catch((error) => {
//         console.error("Error al obtener los datos:", error);
//       });
//   }, []);
//   return (
//     <Grid item xs={12}>
//       <SelectorSearch
//         required
//         values={values}
//         label={header}
//         name={accessorKey}
//         onChange={handleDataSelectorChange}
//         formData={inputData}
//       />
//     </Grid>
//   );
//}

export function gridFieldForeignKey({
  header,
  accessorKey,
  values,
  inputData,
  handleDataChange,
}) {
  return (
    <Grid item xs={12}>
      <SimpleSelector
        values={values}
        label={header}
        name={accessorKey}
        formData={inputData}
        onChange={handleDataChange}
      />
    </Grid>
  );
}
