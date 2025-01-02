import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { format } from 'date-fns';
import userServices from '../services/user.services';
import loanServices from '../services/loan.services';
import requestServices from '../services/request.services';
import { useNavigate } from 'react-router-dom';

const LoanForm = () => {
  const [jobStartDate, setJobStartDate] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [loanType, setLoanType] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [limitYears, setLimitYears] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    if (!jobStartDate || jobStartDate > currentDate) {
      newErrors.jobStartDate = 'La fecha debe ser anterior a hoy.';
    }
    if (debtAmount < 0) {
      newErrors.debtAmount = 'La deuda debe ser mayor o igual que 0.';
    }
    if (!loanType || ![1, 2, 3, 4].includes(Number(loanType))) {
      newErrors.loanType = 'El tipo de préstamo debe ser 1, 2, 3 o 4.';
    }
    if (loanType === '1' && (interestRate < 3.5 || interestRate > 5.0)) {
      newErrors.interestRate = 'Para tipo 1, el interés debe estar entre 3.5 y 5.0.';
    } else if (loanType === '2' && (interestRate < 4.0 || interestRate > 6.0)) {
      newErrors.interestRate = 'Para tipo 2, el interés debe estar entre 4.0 y 6.0.';
    } else if (loanType === '3' && (interestRate < 5.0 || interestRate > 7.0)) {
      newErrors.interestRate = 'Para tipo 3, el interés debe estar entre 5.0 y 7.0.';
    } else if (loanType === '4' && (interestRate < 4.5 || interestRate > 6.0)) {
      newErrors.interestRate = 'Para tipo 4, el interés debe estar entre 4.5 y 6.0.';
    }
    if (limitYears <= 0) {
      newErrors.limitYears = 'El plazo en años debe ser mayor que 0.';
    }
    if (amount <= 0) {
      newErrors.amount = 'La cantidad del préstamo debe ser mayor que 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      const userRut = sessionStorage.getItem("userRut");
      if (!userRut) {
        console.log("No se encontró el RUT en sessionStorage");
        navigate('/');
        return;
      }
      try {
        const response = await userServices.get(userRut);
        const id = response.data.id;
      

        const loanData = {
            loanType,
            interestRate: parseFloat(interestRate),
            limitYears,
            amount
        }
        
        await loanServices.create(loanData,id)
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al crear el prestamo", error
          )
        })

        const requestData = {
          jobStartDate,
          debtAmount
        }

        await requestServices.create(requestData,id)
        .then(() => {
            alert('Formulario enviado exitosamente');
            navigate('/');
          }
        )
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al crear la solicitud",error
          )
        })
      }
      catch (error) {
        console.log("Error al obtener usuario:", error);
      }
      
    }
  };

  return (
    <Container maxWidth="sm" style={{ color: '#ffffff', backgroundColor: '#121212', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h5" gutterBottom style={{ color: '#ffffff' }}>
        Solicitud de Préstamo
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Fecha de Inicio de Trabajo"
          type="date"
          value={jobStartDate}
          onChange={(e) => setJobStartDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, style: { color: '#b0b0b0' } }}
          InputProps={{
            style: { color: '#ffffff' },
          }}
          sx={{ backgroundColor: '#333', borderRadius: '4px' }}
          error={!!errors.jobStartDate}
          helperText={errors.jobStartDate}
        />
        <TextField
          label="Monto de Deuda"
          type="number"
          value={debtAmount}
          onChange={(e) => setDebtAmount(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: '#b0b0b0' } }}
          InputProps={{
            style: { color: '#ffffff' },
          }}
          sx={{ backgroundColor: '#333', borderRadius: '4px' }}
          error={!!errors.debtAmount}
          helperText={errors.debtAmount}
        />
        <TextField
          label="Tipo de Préstamo (1, 2, 3, 4)"
          type="number"
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: '#b0b0b0' } }}
          InputProps={{
            style: { color: '#ffffff' },
          }}
          sx={{ backgroundColor: '#333', borderRadius: '4px' }}
          error={!!errors.loanType}
          helperText={errors.loanType}
        />
        <TextField
          label="Tasa de Interés (%)"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: '#b0b0b0' } }}
          InputProps={{
            style: { color: '#ffffff' },
          }}
          sx={{ backgroundColor: '#333', borderRadius: '4px' }}
          error={!!errors.interestRate}
          helperText={errors.interestRate}
        />
        <TextField
          label="Años para el Préstamo"
          type="number"
          value={limitYears}
          onChange={(e) => setLimitYears(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: '#b0b0b0' } }}
          InputProps={{
            style: { color: '#ffffff' },
          }}
          sx={{ backgroundColor: '#333', borderRadius: '4px' }}
          error={!!errors.limitYears}
          helperText={errors.limitYears}
        />
        <TextField
          label="Monto del Préstamo"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: '#b0b0b0' } }}
          InputProps={{
            style: { color: '#ffffff' },
          }}
          sx={{ backgroundColor: '#333', borderRadius: '4px' }}
          error={!!errors.amount}
          helperText={errors.amount}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '16px' }}>
          Enviar
        </Button>
      </Box>
    </Container>
  );
};

export default LoanForm;
