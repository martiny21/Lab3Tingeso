import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, TextField } from "@mui/material";

import requestServices from "../services/request.services";
import userServices from "../services/user.services";

const Request = () => {
    const { rut } = useParams();
    const [request, setRequest] = useState(null);
    const [user, setUser] = useState(null);
    const [jobStartDate, setJobStartDate] = useState('');
    const [debtAmount, setDebtAmount] = useState('');
    const [loanType, setLoanType] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [limitYears, setLimitYears] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // Aquí puedes añadir la lógica para manejar el envío del formulario
        alert('Formulario enviado');
    };

    useEffect(() => {
        const fetchRequestAndUser = async () => {
            try {
                const userResponse = await userServices.get(rut);
                setUser(userResponse);
                console.log(userResponse.data);

                const id = userResponse.data.id;
                const response = await requestServices.getRequestByUserId(id);
                console.log(response);
            } catch (error) {
                console.error("Error fetching user request:", error);
            }
        };

        fetchRequestAndUser();
    }, [rut]);

    const goHome = () => {
        navigate("/Client");
    };

    if (request === null) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{
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
                    }}>
                    <Typography variant="h6" sx={{ marginLeft: 2 }}>
                        PrestaBanco
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, marginRight: 5 }}>
                        <Button startIcon={<ArrowBack />} variant="contained" color="secondary" onClick={navigate("/Client")}>
                            Volver
                        </Button>
                    </Box>
                </Box>
            
            </Container>
          );
    }

};

export default Request;