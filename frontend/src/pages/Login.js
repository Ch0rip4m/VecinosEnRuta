import { Link as RouterLink } from 'react-router-dom'
import { useState, useEffect} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import axios from 'axios'

export default function Login({setIsLoggedIn}) {
  const [formData, setformData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log('formData',formData);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = ["email","password"];
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
      try {
        const response = await axios.post('http://localhost:8080/auth/token/', formData);
        console.log('Respuesta del backend:', response.data);
        setIsLoggedIn(true)
        window.location.href = '/inicio'
        // Aquí puedes manejar la respuesta del backend, por ejemplo, redirigiendo al usuario a otra página
      } catch (error) {
        console.error('Error al iniciar sesión:', error.response.data);
        // Aquí puedes manejar el error de autenticación, por ejemplo, mostrando un mensaje de error al usuario
      }
    }
  };
  
  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: null });
  };

  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <HolidayVillageIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inicio de sesión VecinosEnRuta
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Correo Electronico"
                  name="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={handleTextChange}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <RouterLink to='/recuperar-pass' variant="body2">
                  ¿Olvidaste tu contraseña?
                </RouterLink>
              </Grid>
              <Grid item>
                <RouterLink to='/register' variant="body2">
                  ¿No tienes cuenta? ¡Registrate aqui!
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}
