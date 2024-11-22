import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import VerRuta from "../../components/mapas/VerRuta";
import ListaBotonInfo from "../../components/listas/ListaInfo";
import axios from "axios";
import { BACKEND_URL } from "../../Utils/Variables";
import SelectorSearch from "../../components/selectores/SelectorSearch";
import { useSnackbar } from "../../contexts/SnackbarContext";
import BasicModal from "../../components/modals/InfoModal";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

const columns = [
  { id: "nombre_ruta", label: "Nombre" },
  { id: "dias", label: "Días" },
  { id: "hora_salida", label: "Salida" },
  { id: "cupos", label: "Cupos" },
];

const modalInfo = [
  { id: "marca_vehiculo", label: "Marca" },
  { id: "modelo_vehiculo", label: "Modelo" },
  { id: "tipo_de_vehiculo", label: "Tipo de vehículo" },
  { id: "color_vehiculo", label: "Color" },
  { id: "patente", label: "Patente" },
  { id: "ano_vehiculo", label: "Año" },
];

function GetSelectorData() {
  // función para obtener la data para componentes especificos, retorna una lista de strings
  const [values, setValues] = useState([]);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/db-manager/comunas/", {
        withCredentials: true,
      })
      .then((response) => {
        const getComunas = response.data.map((item) => item.nombre_comuna);
        setValues(getComunas);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);
  return values;
}

export default function Inicio() {
  const [formData, setformData] = useState({});
  const [rutas, setRutas] = useState([]);
  const [ordenTrayectoria, setOrdenTrayectoria] = useState([]);
  const [dataExist, setDataExist] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const comunas = GetSelectorData();
  const snackbar = useSnackbar();

  useEffect(() => {
    console.log("Rutas:", rutas);
  }, [rutas]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/")
        .then((response) => {
          const usuario = response.data.usuario;
          const vehiculo = response.data.vehiculo;
          localStorage.setItem("user_id", usuario.id_usuario);
          if (vehiculo) {
            localStorage.setItem("car_id", vehiculo.id_vehiculo);
          }
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  const handleSelectRow = (row) => {
    console.log(row)
    setSelectedRow(row); // Guardar la fila seleccionada
    setOpenModal(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cerrar el modal
  };

  const hadleSelectRoute = (row) => {
    axios
      .get(BACKEND_URL + "/db-manager/mostrar-ruta/", {
        params: { id_ruta: row.id_ruta },
        withCredentials: true,
      })
      .then((response) => {
        if (response) {
          setOrdenTrayectoria(response.data);
          console.log(ordenTrayectoria);
          if (ordenTrayectoria.length > 0) {
            setDataExist(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la trayectoria:", error);
      });
  };

  const handleRequestRoute = (row) => {
    axios
      .post(
        BACKEND_URL + "/db-manager/solicitar-unirse/",
        {},
        {
          params: {
            id_ruta: row.id_ruta,
            id_solicitante: localStorage.getItem("user_id"),
          },
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        snackbar.success("Solicititud enviada con exito");
        setformData({});
        setRutas([]);
      })
      .catch((error) => {
        console.error("Error al hacer la solicitud", error);
        snackbar.error("Error al enviar la solicitud");
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .get(BACKEND_URL + "/db-manager/buscar-rutas/", {
        params: {
          id_usuario: localStorage.getItem("user_id"),
          origen: formData.origen,
          destino: formData.destino,
        },
        withCredentials: true, // Si necesitas enviar cookies
      })
      .then((response) => {
        console.log(response.data);
        setRutas(response.data);
      })
      .catch((error) => {
        console.error("error al obtener las ruta", error);
      });
  };

  const handleDataChange = (event, name) => {
    setformData({ ...formData, [name]: event });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="overline" sx={{ mt: 1 }}>
          ¡Busca tu ruta!
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, textAlign: "center", width: "100%" }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <SelectorSearch
                required
                fullWidth
                label="Origen"
                name="origen"
                values={comunas}
                onChange={handleDataChange}
                formData={formData}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectorSearch
                required
                fullWidth
                name="destino"
                label="Destino"
                values={comunas}
                onChange={handleDataChange}
                formData={formData}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 1, mb: 2, bgcolor: "var(--navbar-color)" }}
          >
            Buscar
          </Button>
        </Box>
        {dataExist ? (
          <VerRuta
            width="100%"
            height="250px"
            ordenTrayectoria={ordenTrayectoria}
          />
        ) : (
          <VerRuta width="100%" height="320px" />
        )}
        <ListaBotonInfo
          columns={columns}
          rows={rutas}
          height={550}
          buttonLabel="Unirse"
          onClickRowFunction={hadleSelectRoute}
          onClickButtonFunction={handleRequestRoute}
          onClickInfoButton={handleSelectRow}
        />
      </Box>
      {selectedRow && (
        <BasicModal
          open={openModal}
          handleClose={handleCloseModal}
          modalInfo={modalInfo}
          imgURL={selectedRow.id_vehiculo.imagen_perfil}
          title="INFO DEL VEHÍCULO"
          description={selectedRow.id_vehiculo}
        />
      )}
    </Container>
  );
}
