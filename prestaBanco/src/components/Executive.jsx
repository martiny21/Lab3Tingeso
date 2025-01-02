import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import requestService from "../services/request.services";
import userServices from "../services/user.services";
import { useNavigate } from "react-router-dom";

const Executive = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const init = async () => {
    try {
      const response = await requestService.getAll();
      const requestsData = response.data;

      if (Array.isArray(requestsData)) {
        const requestsWithRut = await Promise.all(
          requestsData.map(async (request) => {
            return {
              id: request.id,
              status: request.status,
              rut: request.user?.rut || "No disponible",
            };
          })
        );
        
        setRequests(requestsWithRut);
      } else {
        console.error("La respuesta de `getAll` no es un array:", requestsData);
      }
    } catch (error) {
      console.log("Se ha producido un error al intentar mostrar listado de todas las solicitudes.", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleEvaluate = async (rut) => {
    const response = await userServices.get(rut);
    const id = response.data.id;
    await requestService.evaluate(id);
  };

  return (
    <TableContainer component={Paper}>
      <br />
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>ID</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Estado</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>RUT</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell align="left">{request.id}</TableCell>
              <TableCell align="left">{request.status}</TableCell>
              <TableCell align="left">{request.rut}</TableCell>
              <TableCell align="center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleEvaluate(request.rut)}
                >
                  Evaluar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Executive;
