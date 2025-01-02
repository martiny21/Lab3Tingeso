import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, FormControl } from "@mui/material";
import { CloudUpload, CheckCircle } from "@mui/icons-material";
import { format } from 'date-fns';

import userService from "../services/user.services";
import documentService from "../services/document.services";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [salary, setSalary] = useState("");
  const [errors, setErrors] = useState({});
  const [idFile, setIdFile] = useState(null);
  const [incomeFile, setIncomeFile] = useState(null);
  const [idFileMessage, setIdFileMessage] = useState("");
  const [incomeFileMessage, setIncomeFileMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      if (fileType === "id") {
        setIdFile(file);
        setIdFileMessage("Archivo de identificación cargado correctamente.");
      }
      if (fileType === "income") {
        setIncomeFile(file);
        setIncomeFileMessage("Archivo de comprobante de ingreso cargado correctamente.");
      }
    } else {
      const errorMessage = "Error: El archivo debe ser un PDF.";
      alert("Solo se permiten archivos PDF.");
      if (fileType === "id") setIdFileMessage(errorMessage);
      if (fileType === "income") setIncomeFileMessage(errorMessage);
    }
  };

  const handleRegister = async () => {
    let currentErrors = {};

    if (!name) currentErrors.name = "El nombre es obligatorio.";
    if (!rut) currentErrors.rut = "El RUT es obligatorio.";
    else if (!/^\d{8}-\d$/.test(rut)) currentErrors.rut = "Ingrese un RUT válido en el formato 12345678-9.";
    if (!birthDate) currentErrors.birthDate = "La fecha de nacimiento es obligatoria.";
    if (!salary || salary <= 0) currentErrors.salary = "El salario debe ser mayor a 0.";
    if (!idFile) currentErrors.idFile = "El archivo de identificación es obligatorio.";
    if (!incomeFile) currentErrors.incomeFile = "El archivo de comprobante de ingreso es obligatorio.";

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setErrors({});
    const formattedBirthDate = format(new Date(birthDate), "yyyy-MM-dd");

    const userData = {
      name,
      rut,
      salary: parseFloat(salary),
      birthDate: formattedBirthDate,
    };

    await userService.register(userData)
      .then((response) => {
        console.log("Usuario registrado", response.data);
        alert("Usuario registrado con éxito.");
        return response.data.id; // Retorna el ID del usuario
      })
      .then((userId) => {
        // Subir archivos después de obtener el ID del usuario
        const uploadIdFile = documentService.upload("id", idFile, userId)
          .catch((error) => console.error("Error al subir archivo de identificación", error));

        const uploadIncomeFile = documentService.upload("income", incomeFile, userId)
          .catch((error) => console.error("Error al subir archivo de comprobante de ingreso", error));

        return Promise.all([uploadIdFile, uploadIncomeFile]);
      })
      .catch((error) => {
        console.error("Error en el proceso de registro", error);
      });

  };

  const renderFileUploadButton = (file, setFile, label, message, setMessage) => {
    return (
      <Box>
        <Button
          variant="contained"
          component="label"
          startIcon={file ? <CheckCircle /> : <CloudUpload />}
          sx={{
            backgroundColor: file ? "green" : "primary.main",
            color: "white",
            marginTop: "1rem",
          }}
        >
          {file ? "Archivo cargado" : label}
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, label === "Subir identificación" ? "id" : "income")}
          />
        </Button>
        {message && <Typography variant="body2" color={message.includes("Error") ? "error" : "success"}>{message}</Typography>}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        color: "white",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Typography variant="h4" component="h1" gutterBottom>
          Registro
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            id="nacimiento"
            label="Fecha de nacimiento"
            type="date"
            value={birthDate}
            variant="standard"
            margin="normal"
            onChange={(e) => setBirthDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            sx={{
              backgroundColor: "#333", // Fondo oscuro
              "& .MuiInputBase-root": {
                color: "white", // Color del texto
              },
              "& .MuiInputLabel-root": {
                color: "white", // Color de la etiqueta
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "white", // Línea debajo del campo
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "lightgray", // Línea en hover
              },
            }}
          />
        </FormControl>
        <TextField
          label="Nombre"
          variant="filled"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          sx={{
            backgroundColor: "#333", // Fondo oscuro
            "& .MuiInputBase-root": {
              color: "white", // Color del texto
            },
            "& .MuiInputLabel-root": {
              color: "white", // Color de la etiqueta
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white", // Línea debajo del campo
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "lightgray", // Línea en hover
            },
          }}
        />
        <TextField
          label="RUT"
          variant="filled"
          fullWidth
          margin="normal"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          error={!!errors.rut}
          helperText={errors.rut}
          sx={{
            backgroundColor: "#333", // Fondo oscuro
            "& .MuiInputBase-root": {
              color: "white", // Color del texto
            },
            "& .MuiInputLabel-root": {
              color: "white", // Color de la etiqueta
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white", // Línea debajo del campo
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "lightgray", // Línea en hover
            },
          }}
        />
        <TextField
          label="Salario"
          variant="filled"
          fullWidth
          margin="normal"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          error={!!errors.salary}
          helperText={errors.salary}
          sx={{
            backgroundColor: "#333", // Fondo oscuro
            "& .MuiInputBase-root": {
              color: "white", // Color del texto
            },
            "& .MuiInputLabel-root": {
              color: "white", // Color de la etiqueta
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white", // Línea debajo del campo
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "lightgray", // Línea en hover
            },
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>Subir identificación (PDF)</Typography>
          {renderFileUploadButton(idFile, setIdFile, "Subir identificación", idFileMessage, setIdFileMessage)}
          {errors.idFile && <Typography color="error" variant="body2">{errors.idFile}</Typography>}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>Subir comprobante de ingresos (PDF)</Typography>
          {renderFileUploadButton(incomeFile, setIncomeFile, "Subir comprobante", incomeFileMessage, setIncomeFileMessage)}
          {errors.incomeFile && <Typography color="error" variant="body2">{errors.incomeFile}</Typography>}
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
          sx={{ marginTop: "1rem" }}
        >
          Registrarse
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => navigate("/")}
          sx={{ marginTop: "0.5rem"}}
        >
          Volver a Home
        </Button>
      </Container>
    </Box>
  );
};

export default Register;
