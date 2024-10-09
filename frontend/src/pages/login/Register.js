import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import SimpleSelector from "../../components/selectores/SimpleSelector";
import MultipleSelectChip from "../../components/selectores/MultiSelector";
import SelectorSearch from "../../components/selectores/SelectorSearch";
import LogoRedondoVER from "../../styles/LogoRedondo";

function GetSelectorData() {
  // función para obtener la data para componentes especificos, retorna una lista de strings
  const [values, setValues] = useState([]);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/db-manager/comunas/", { withCredentials: true })
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

export default function Register() {
  const [formData, setformData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const comunas = GetSelectorData();

  useEffect(() => {
    console.log("formData: ", formData);
    console.log("profileImage:", profileImage);
  }, [formData, profileImage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = [
      "nombre_usuario",
      "apellido_usuario",
      "edad",
      "telefono",
      "email",
      "password",
      "sexo",
      "nombre_rol",
      "comuna",
      "descripcion_usuario",
    ];
    const errors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "Este campo es obligatorio";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFormErrors(errors);
    } else {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'comuna') {
          formDataToSend.append(key, [formData[key]])
        }
        formDataToSend.append(key, formData[key]);
      });
      if (profileImage) {
        formDataToSend.append("imagen_perfil", profileImage);
        console.log("formatDataToSend", formDataToSend.get('comuna'));
        console.log("formatDataToSend", formDataToSend.get('nombre_rol'));
      }

      await axios
        .post(BACKEND_URL + "/db-manager/usuarios/", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("formulario enviado", response.data);
        })
        .catch((error) => {
          console.error("Error al enviar formulario", error);
        });
    }
  };

  const handleDataChange = (event, name) => {
    setformData({ ...formData, [name]: event });
    setFormErrors({ ...formErrors, [name]: null });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: null });
  };

  const handleNumericText = (event) => {
    const { name, value } = event.target;
    const inputValue = value.replace(/[^0-9]/g, "");
    setformData((currentData) => ({ ...currentData, [name]: inputValue }));
    setFormErrors({ ...formErrors, [name]: null });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LogoRedondoVER width="100px" height="100px" />
        <Typography component="h1" variant="overline" sx={{ mt: 1 }}>
          ¡Registro de nuevo vecino!
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.nombre_usuario || null}
                name="nombre_usuario"
                required
                fullWidth
                onChange={handleTextChange}
                label="Nombre(s)"
                error={Boolean(formErrors.nombre_usuario)}
                helperText={formErrors.nombre_usuario}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.apellido_usuario || null}
                required
                fullWidth
                onChange={handleTextChange}
                label="Apellidos"
                name="apellido_usuario"
                error={Boolean(formErrors.apellido_usuario)}
                helperText={formErrors.apellido_usuario}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.edad || ""}
                required
                fullWidth
                onChange={handleNumericText}
                label="Edad"
                name="edad"
                error={Boolean(formErrors.edad)}
                helperText={formErrors.edad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SimpleSelector
                values={["Masculino", "Femenino", "Prefiero no decir"]}
                formData={formData}
                onChange={handleDataChange}
                required
                fullWidth
                label="Sexo"
                name="sexo"
                error={Boolean(formErrors.sexo)}
                helperText={formErrors.sexo}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.telefono || ""}
                required
                fullWidth
                onChange={handleNumericText}
                label="Celular"
                name="telefono"
                error={Boolean(formErrors.telefono)}
                helperText={formErrors.telefono}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectorSearch
                values={comunas}
                required
                fullWidth
                formData={formData}
                onChange={handleDataChange}
                label="Comuna"
                name="comuna"
                error={Boolean(formErrors.comuna)}
                helperText={formErrors.comuna}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.email || null}
                required
                fullWidth
                onChange={handleTextChange}
                label="Correo Electrónico"
                name="email"
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.password || null}
                required
                fullWidth
                onChange={handleTextChange}
                name="password"
                label="Contraseña"
                type="password"
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <MultipleSelectChip
                values={["Pasajero", "Conductor"]}
                formData={formData}
                onChange={handleDataChange}
                required
                fullWidth
                label="¿Qué rol(es) tomarias en la app?"
                name="nombre_rol"
                error={Boolean(formErrors.nombre_rol)}
                helperText={formErrors.nombre_rol}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.descripcion_usuario || null}
                required
                fullWidth
                onChange={handleTextChange}
                multiline
                maxRows="5"
                name="descripcion_usuario"
                label="¡Describe como eres! (lo que te gusta y no)"
                error={Boolean(formErrors.descripcion_usuario)}
                helperText={formErrors.descripcion_usuario}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="profile-image-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="profile-image-upload">
                <Button
                  variant="contained"
                  color={profileImage ? "success" : "primary"}
                  component="span"
                  fullWidth
                  sx={{bgcolor:"var(--navbar-color)"}}
                >
                  {profileImage ? "Imagen Lista" : "Subir Foto de Perfil"}
                </Button>
              </label>
              {imagePreviewUrl && (
                <Box mt={2} textAlign="center">
                  <img
                    src={imagePreviewUrl}
                    alt="Vista previa de la imagen"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "var(--navbar-color)"}}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
