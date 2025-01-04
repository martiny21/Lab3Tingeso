import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, FormControl } from "@mui/material";
import { CloudUpload, CheckCircle } from "@mui/icons-material";
import { format } from 'date-fns';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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
  const [open, setOpen] = useState(false);
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

    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if(!idFile) currentErrors.idFile = "El archivo de identificación es obligatorio.";
    if(!incomeFile) currentErrors.incomeFile = "El archivo de comprobante de ingreso es obligatorio.";

    if (!name) currentErrors.name = "El nombre es obligatorio.";
    if (!rut) currentErrors.rut = "El RUT es obligatorio.";
    if (!birthDate) {
      currentErrors.birthDate = "La fecha de nacimiento es obligatoria.";
    } else if (birthDateObj > today) {
      currentErrors.birthDate = "La fecha de nacimiento no puede ser en el futuro.";
    } else if (age < 18 || age > 150) {
      currentErrors.birthDate = "La edad debe estar entre 18 y 150 años.";
    }
    if (!salary || salary <= 0) currentErrors.salary = "El salario debe ser mayor a 0.";
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

        return Promise.all([uploadIdFile, uploadIncomeFile]).then(() => { navigate("/"); });
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrors({ rut: "El RUT ya está registrado." });
        } else {
          console.error("Error en el proceso de registro", error);
        }
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    handleRegister();
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
          placeholder="Juan Pérez"
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
          placeholder="12345678-9"
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
          placeholder="500000"
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
          onClick={handleClickOpen}
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
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Confirmar Registro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que los datos que has subido son correctos?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;