import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import userServices from "../services/user.services";
import requestServices from "../services/request.services";
import documentServices from "../services/document.services";

import { Container, Typography, Button, Box, CircularProgress, Menu, 
  Table, TableBody, TableCell, TableContainer, 
  TableRow, Paper, Dialog, DialogContentText, FormControlLabel, 
  DialogContent, DialogTitle, Checkbox, DialogActions, Select, MenuItem } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [conditions, setConditions] = useState({
    saldoMinimo: false,
    historialAhorro: false,
    depositosPeriodicos: false,
    relacionSaldoAntiguedad: false,
    retirosRecientes: false,
  });

  const handleChange = (event) => {
    setConditions({
      ...conditions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    console.log("Condiciones:", conditions);
    if (window.confirm("¿Está seguro?")) {
      await evaluarCapacidadDeAhorro();
      handleClose();
    }
  };

  const evaluarCapacidadDeAhorro = async () => {
    
    // Logic to evaluate saving capacity
    const { saldoMinimo, historialAhorro, depositosPeriodicos, relacionSaldoAntiguedad, retirosRecientes } = conditions;
    await requestServices.evaluateSavingCapacity(
      id, saldoMinimo, historialAhorro, depositosPeriodicos, relacionSaldoAntiguedad, retirosRecientes)
      .then(() => { alert("Capacidad de ahorro evaluada correctamente. Para ver los cambios recargue la pagina o presione 'F5'"); })
      .catch(error => { console.error("Error evaluating saving capacity:", error); });
    console.log("Evaluando capacidad de ahorro con las condiciones:", conditions);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userServices.getUser(id);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRequest = async () => {
      try {
        const response = await requestServices.getRequestByUserId(id);
        console.log(response);
        if (response.data !== "") {
          setRequest(response);
        }
      } catch (error) {
        console.error("Error fetching user request:", error);
      }
    };

    const fetchDocuments = async () => {
      try {
        const response = await documentServices.getDocuments(id);
        console.log(response);
        setDocuments(response);
      } catch (error) {
        console.error("Error fetching user documents:", error);
        alert('Error al obtener documentos');
      }
    };

    fetchDocuments();
    fetchUser();
    fetchRequest();
  }, [id]);

  const handleVerifyUser = async () => {
    await userServices.validate(id).then(() => {
      setUser((prevUser) => ({ ...prevUser, ready: true }))
      alert("Usuario verificado correctamente");
    }).catch(error => {
      console.error("Error validating user:", error);
    });
  };


  const handleDownload = async (documentId) => {
    const response = await documentServices.download(documentId);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "document.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const translateStatus = (status) => {
    const statusMap = {
      1: "Revisión inicial",
      2: "Faltan documentos",
      3: "Revisión",
      4: "Pre-aprobado",
      5: "Aprobación final",
      6: "Aprobado",
      7: "Rechazado",
      8: "Cancelado",
      9: "Desembolso"
    };
    return statusMap[status] || "Desconocido";
  };

  const handleStatusClickOpen = () => {
    setStatusOpen(true);
  };

  const handleStatusClose = () => {
    setStatusOpen(false);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleStatusConfirm = async () => {
    if (window.confirm("¿Está seguro de actualizar el estado de la solicitud?")) {
      await requestServices.updateStatus(id, selectedStatus)
      .then(() => { alert("Estado de la solicitud actualizado correctamente. Para ver los cambios recargue la pagina o presione 'F5'"); })
      handleStatusClose();
    }
  };

  const getSavingCapacityColor = (savingCapacity) => {
    switch (savingCapacity) {
        case "Sin evaluar":
          return "gray";
        case "Solida":
          return "green";
        case "insuficiente":
          return "red";
        default:
          return "black";
      }
    };

    const handleEvaluation = async () => {
      if (window.confirm("¿Está seguro?")) {
      await requestServices.evaluate(id)
      .then(() => { alert("Solicitud evaluada correctamente, se recomiendo actualizar la pagina"); })
      .catch(error => { console.error("Error evaluating request:", error); });
      }
    };

    const renderEvaluationButton = () => {
      if (request !== null && request.data.savingCapacityStatus !== "Sin evaluar") {
      return (
        <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleEvaluation}
        >
        Evaluar solicitud
        </Button>
      );
      }
    };
  
  

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      {/* Banner superior */}
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
          onClick={() => navigate("/ExecutiveNew")}
        >
          Volver
        </Button>
      </Box>

      <Container maxWidth="sm" sx={{ marginTop: "64px" }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 64px)"
          gap={2}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Detalles del Usuario
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Nombre:</strong></TableCell>
                  <TableCell>{user.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>RUT:</strong></TableCell>
                  <TableCell>{user.rut}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Fecha de Nacimiento:</strong></TableCell>
                  <TableCell>{user.birthDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Salario:</strong></TableCell>
                  <TableCell>{user.salary}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Verificado:</strong></TableCell>
                  <TableCell>{user.ready ? "Sí" : "No"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {!user.ready && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleVerifyUser}
            >
              Verificar Usuario
            </Button>
          )}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Documentos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleDownload(doc.id)}>
                          Descargar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>No hay documentos disponibles.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>


          {request ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Detalles de la Solicitud
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Estado:</strong></TableCell>
                      <TableCell>{translateStatus(request.data.status)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Capacidad de Ahorro:</strong></TableCell>
                      <TableCell sx={{ color: getSavingCapacityColor(request.data.savingCapacityStatus) }}>
                        {request.data.savingCapacityStatus}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Valor prestamo:</strong></TableCell>
                      <TableCell>{request.data.amount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Valor final del prestamo:</strong></TableCell>
                      <TableCell>{request.data.loanAmount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Sueldo:</strong></TableCell>
                      <TableCell>{user.salary}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Deudas acumuladas:</strong></TableCell>
                      <TableCell>{request.data.debtAmount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" flexDirection="row" gap={2} width="100%">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleClickOpen}
                >
                  Evaluar Capacidad de Ahorro
                </Button>
                {renderEvaluationButton()}
              </Box>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Evaluar Capacidad de Ahorro</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Por favor, marque las siguientes condiciones:
                  </DialogContentText>
                  <Box display="flex" flexDirection="column">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={conditions.saldoMinimo}
                          onChange={handleChange}
                          name="saldoMinimo"
                        />
                      }
                      label="Saldo mínimo Requerido"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={conditions.historialAhorro}
                          onChange={handleChange}
                          name="historialAhorro"
                        />
                      }
                      label="Historial de ahorro consistente"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={conditions.depositosPeriodicos}
                          onChange={handleChange}
                          name="depositosPeriodicos"
                        />
                      }
                      label="Depósitos periódicos"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={conditions.relacionSaldoAntiguedad}
                          onChange={handleChange}
                          name="relacionSaldoAntiguedad"
                        />
                      }
                      label="Relación Saldo/Años de antigüedad"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={conditions.retirosRecientes}
                          onChange={handleChange}
                          name="retirosRecientes"
                        />
                      }
                      label="Retiros recientes"
                    />
                  </Box>
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
              <Button variant="contained" color="secondary" onClick={handleStatusClickOpen}
              sx={{ mt: 2 }}>
                Actualizar Estado Solicitud Manualmente
              </Button>
              <Dialog open={statusOpen} onClose={handleStatusClose}>
                <DialogTitle>Actualizar Estado de la Solicitud</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Por favor, seleccione el nuevo estado de la solicitud:
                  </DialogContentText>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    fullWidth
                  >
                    <MenuItem value={1}>Revisión inicial</MenuItem>
                    <MenuItem value={2}>Faltan documentos</MenuItem>
                    <MenuItem value={3}>Revisión</MenuItem>
                    <MenuItem value={4}>Pre-aprobado</MenuItem>
                    <MenuItem value={5}>Aprobación final</MenuItem>
                    <MenuItem value={6}>Aprobado</MenuItem>
                    <MenuItem value={7}>Rechazado</MenuItem>
                    <MenuItem value={8}>Cancelado</MenuItem>
                    <MenuItem value={9}>Desembolso</MenuItem>
                  </Select>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleStatusClose} color="primary">
                    Cancelar
                  </Button>
                  <Button onClick={handleStatusConfirm} color="primary">
                    Confirmar
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mt: 4 }}>
              Sin solicitud de préstamo
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default UserDetails;