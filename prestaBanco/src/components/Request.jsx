import React, { useState} from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, 
    Typography, Container, Box} from '@mui/material';
import { useNavigate, useParams} from 'react-router-dom';
import { ArrowBack, CloudUpload, CheckCircle } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import requestServices from '../services/request.services';
import documentService from "../services/document.services";
import userServices from '../services/user.services';

const Request = () => {
    const { rut } = useParams();
    const [jobStartDate, setJobStartDate] = useState('');
    const [debt, setDebt] = useState('');
    const [loanType, setLoanType] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [years, setYears] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // File certifcate of avaluo
    const [avalFile, setAvalFile] = useState(null);
    const [avalFileMessage, setAvalFileMessage] = useState('');
    const [open, setOpen] = useState(false);



    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
          if (fileType === "aval") {
            setAvalFile(file);
            setAvalFileMessage("Archivo de certificado de avaluo cargado correctamente.");
          }
        } else {
          const errorMessage = "Error: El archivo debe ser un PDF.";
          alert("Solo se permiten archivos PDF.");
          if (fileType === "aval") setAvalFileMessage(errorMessage);
        }
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
                onChange={(e) => handleFileChange(e, "aval")}
              />
            </Button>
            {message && <Typography variant="body2" color={message.includes("Error") ? "error" : "success"}>{message}</Typography>}
          </Box>
        );
      };

    const handleLoanTypeChange = (e) => {
        setLoanType(e.target.value);
        setInterestRate('');
    };

    const validate = () => {
        const newErrors = {};
        if (!jobStartDate) {
            newErrors.jobStartDate = 'La fecha de inicio es obligatoria';
        } else if (new Date(jobStartDate) > new Date()) {
            newErrors.jobStartDate = 'La fecha no puede ser en el futuro';
        }
        if (!debt) {
            newErrors.debt = 'La deuda es obligatoria y numerica';
        } else if (debt < 0) {
            newErrors.debt = 'La deuda debe ser mayor o igual a 0';
        }
        if (!loanType) {
            newErrors.loanType = 'Seleccione un tipo de préstamo';
        } else if(interestRate){
            if (!isInterestRateValid()) {
                newErrors.interestRate = `La tasa de interés debe estar entre ${getLoanAmountRange()}`;
            }
        }
        if (!interestRate) {
            newErrors.interestRate = 'Seleccione una tasa de interés';
        }
        if (!years) {
            newErrors.years = 'Los años son obligatorios';
        } else if (years <= 0) {
            newErrors.years = 'Los años deben ser mayor a 0';
        }
        if (!amount) {
            newErrors.amount = 'El monto es obligatorio';
        } else if (amount <= 0) {
            newErrors.amount = 'El monto debe ser mayor a 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const loanData = {
            jobStartDate,
            debtAmount: parseFloat(debt),
            loanType,
            interestRate: parseFloat(interestRate),
            limitYears: parseInt(years),
            amount: parseFloat(amount),
        };

        try {
            const userResponse = await userServices.get(rut);
            const userId = userResponse.data.id;
            console.log(userId);

            const requestResponse = await requestServices.create(loanData, userId);
            console.log(requestResponse);

            await documentService.upload("Certificado de avaluo", avalFile, userId);

            alert("Solicitud enviada correctamente");
            navigate("/Client");
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Error al enviar la solicitud");
        }

    };

    const getInterestRateOptions = () => {
        switch (loanType) {
            case '1':
                return [3.5, 4.0, 4.5, 5.0];
            case '2':
                return [4.0, 4.5, 5.0, 5.5, 6.0];
            case '3':
                return [5.0, 5.5, 6.0, 6.5, 7.0];
            case '4':
                return [4.5, 5.0, 5.5, 6.0];
            default:
                return [];
        }
    };

    const getLoanAmountRange = () => {
        switch (loanType) {
            case '1':
                return '3.5% - 5.0%';
            case '2':
                return '4.0% - 6.0%';
            case '3':
                return '5.0% - 7.0%';
            case '4':
                return '4.5% - 6.0%';
            default:
                return '';
        }
    };

    const isInterestRateValid = () => {
        const range = getInterestRateOptions();
        const rate = parseFloat(interestRate);
        return rate >= Math.min(...range) && rate <= Math.max(...range);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const handleConfirm = () => {
        setOpen(false);
        handleSubmit();
    };

    const handleInputChange = (e, setState) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
          setState(value);
        }
    };
    
    const handleIntegerInputChange = (e, setState) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setState(value);
        }
    };

      


return (
    <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Box
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          color: "white",
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          PrestaBanco
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          variant="contained"
          color="secondary"
          sx={{ marginRight: 5 }}
          onClick={() => navigate("/Client")}
        >
          Volver
        </Button>
      </Box>
        
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            maxWidth="800px" // Contenedor ajustado
            bgcolor="#1c1c1c"
            p={4}
            borderRadius={2}
            boxShadow={3}
            >
            <Typography variant="h5" sx={{ color: "#ffffff", mb: 3 }}>
                Formulario de Préstamo
            </Typography>

            <TextField
                label="Fecha de Inicio de trabajo"
                type="date"
                variant="filled"
                value={jobStartDate}
                onChange={(e) => setJobStartDate(e.target.value)}
                InputLabelProps={{ shrink: true, style: { color: "#b0b0b0" } }}
                InputProps={{ style: { color: "#ffffff" } }}
                sx={{
                backgroundColor: "#333",
                "& .MuiInputBase-root": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "lightgray" },
                width: "100%", // Controla el ancho
                marginBottom: 2,
                }}
                error={!!errors.jobStartDate}
                helperText={errors.jobStartDate}
            />

            <TextField
                label="Total de Deuda (CLP)"
                variant="filled"
                type="number"
                value={debt}
                onChange={(e) => handleIntegerInputChange(e, setDebt)}
                sx={{
                backgroundColor: "#333",
                "& .MuiInputBase-root": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "lightgray" },
                width: "100%", // Controla el ancho
                marginBottom: 2,
                }}
                error={!!errors.debt}
                helperText={errors.debt}
            />

            <FormControl
                sx={{
                backgroundColor: "#333",
                "& .MuiInputBase-root": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "lightgray" },
                width: "100%", // Controla el ancho
                marginBottom: 2,
                }}
            >
                <InputLabel style={{ color: "#b0b0b0" }}>Tipo de Préstamo</InputLabel>
                <Select
                value={loanType}
                onChange={handleLoanTypeChange}
                style={{ color: "#ffffff" }}
                >
                <MenuItem value="1">Primera Vivienda</MenuItem>
                <MenuItem value="2">Segunda Vivienda</MenuItem>
                <MenuItem value="3">Propiedad Comercial</MenuItem>
                <MenuItem value="4">Remodelación</MenuItem>
                </Select>
                <Typography
                variant="body2"
                sx={{ color: loanType ? "green" : "red", marginTop: "8px" }}
                >
                {loanType
                    ? "Tipo de préstamo seleccionado"
                    : "*Seleccione un tipo de préstamo"}
                </Typography>
            </FormControl>

            <TextField
                label="Tasa de Interés (%)"
                variant='filled'
                type="number"
                value={interestRate}
                onChange={(e) => handleInputChange(e, setInterestRate)}
                sx={{
                backgroundColor: "#333",
                "& .MuiInputBase-root": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "lightgray" },
                width: "100%", // Controla el ancho
                marginBottom: 2,
                }}
                error={!!errors.interestRate}
                helperText={errors.interestRate}
            />

            <TextField
                label="Años para Pagar"
                type="number"
                variant='filled'
                value={years}
                onChange={(e) => handleIntegerInputChange(e, setYears)}
                sx={{
                backgroundColor: "#333",
                "& .MuiInputBase-root": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "lightgray" },
                width: "100%", // Controla el ancho
                marginBottom: 2,
                }}
                error={!!errors.years}
                helperText={errors.years}
            />

            <TextField
                label="Monto del Préstamo"
                type="number"
                variant='filled'
                value={amount}
                onChange={(e) => handleIntegerInputChange(e, setAmount)}
                sx={{
                backgroundColor: "#333",
                "& .MuiInputBase-root": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "lightgray" },
                width: "100%", // Controla el ancho
                marginBottom: 2,
                }}
                error={!!errors.amount}
                helperText={errors.amount}
            />

            <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>Subir Certificado de Avaluo (PDF)</Typography>
                {renderFileUploadButton(avalFile, setAvalFile, "Subir Certificado del avaluo", avalFileMessage, setAvalFileMessage)}
                {errors.avalFile && 
                <Typography color="error" variant="body2">{errors.avalFile}</Typography>}
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                width: "50%", // Ajusta el ancho
                alignSelf: "center",
                marginTop: 2,
                }}
                onClick={handleClickOpen}
                onClose={handleClose}
            >
                Enviar
            </Button>
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


    </Container>
);
};

export default Request;