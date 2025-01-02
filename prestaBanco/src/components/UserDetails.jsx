import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userServices from "../services/user.services";
import { Container, Typography, Button, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userServices.getUser(id);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
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
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.35)",
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
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box>
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Detalles del Usuario
        </Typography>
        <Typography variant="body1">
          <strong>Nombre:</strong> {user.name}
        </Typography>
        <Typography variant="body1">
          <strong>RUT:</strong> {user.rut}
        </Typography>
        <Typography variant="body1">
          <strong>Fecha de Nacimiento:</strong> {user.birthDate}
        </Typography>
        <Typography variant="body1">
          <strong>Salario:</strong> {user.salary}
        </Typography>
        <Typography variant="body1">
          <strong>Verificado:</strong> {user.ready ? "Sí" : "No"}
        </Typography>
      </Box>
    </Container>
  );
};

export default UserDetails;