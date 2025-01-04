import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import userServices from "../services/user.services";
import requestServices from "../services/request.services";
import documentServices from "../services/document.services";

import { Container, Typography, Button, Box, CircularProgress, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

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
        setRequest(response);
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
      setUser((prevUser) => ({ ...prevUser, ready: true }));
    }).catch(error => {
      console.error("Error validating user:", error);
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
                      <TableCell>{translateStatus(request.status)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Capacidad de Ahorro:</strong></TableCell>
                      <TableCell sx={{ color: getSavingCapacityColor(request.savingCapacityStatus) }}>
                        {request.savingCapacityStatus}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleMenuOpen}
              >
                Detalles capacidad de ahorro
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Opción 1</MenuItem>
                <MenuItem onClick={handleMenuClose}>Opción 2</MenuItem>
                <MenuItem onClick={handleMenuClose}>Opción 3</MenuItem>
              </Menu>
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