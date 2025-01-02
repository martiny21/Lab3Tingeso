import React, { useState, useEffect } from "react";
import {Container, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button} from '@mui/material';
import { Box, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import userServices from "../services/user.services"; 

const ExecutiveNew = () => {
    const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await userServices.getUsers();
            const data = response.data;
            if (Array.isArray(data)) {
            setUsers(data);
            } else {
            console.error('Expected an array but got:', data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        };
        fetchUsers();
    }, []);
  
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.rut.toLowerCase().includes(search.toLowerCase())
    );

    // Function to view user details
    const viewUserDetails = (id) => {
        window.location.href = `/user/${id}`; // Ruta para ver detalles del usuario.
      };
      

    return (
        
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Banner */}
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
                <Button startIcon={ <ArrowBack/>} variant="contained" color="secondary" sx={{ marginRight: 5 }}>Volver
                </Button>
            </Box>
          <h1>Lista de Usuarios</h1>
    
          {/* Search bar */}
          <TextField
            label="Buscar por nombre o RUT"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
                mb: 2,
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
    
          {/* Tabla de usuarios */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>RUT</TableCell>
                  <TableCell>Verificado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.rut}</TableCell>
                    <TableCell>
                      <span style={{ color: user.ready ? 'green' : 'red' }}>
                        {user.ready ? 'Verificado' : 'Sin verificar'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => viewUserDetails(user.id)}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      );
    };
    

    export default ExecutiveNew;