import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar } from "@mui/material";
import { BACKEND_URL } from "../../Utils/Variables";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  flexDirection: "column",
  display: "flex",
  justifyContent: "center",
};

export default function BasicModal({
  open,
  handleClose,
  title,
  description,
  imgURL,
  modalInfo,
}) {
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            {title}
          </Typography>
          <Avatar
            src={BACKEND_URL + imgURL}
            style={{ width: "100px", height: "100px", margin: "10px auto" }}
          />
          {modalInfo.map((item) => {
            const value = description[item.id];
            const label = item.label
            return (
              <Typography sx={{ textAlign: "center" }}>{label}: {value}</Typography>
            );
          })}
        </Box>
      </Modal>
    </div>
  );
}
