"use client";

import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:3001/auth/register", {
        name,
        email,
        password,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Error occurred");
      } else {
        setMessage("Unexpected error occurred");
      }
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:3001/auth/verify", {
        email,
        code,
      });
      setMessage(res.data.message);

      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Verification failed");
      } else {
        setMessage("Unexpeted verification error");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, sm: "20%", md: "35%" },
        py: { xs: "40%", md: "10%" },
        bgcolor: "lightgray",
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "grey",
            width: { xs: 350, md: 500 },
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {step === 1 ? "Register" : "Enter Verification Code"}
          </Typography>

          {step === 1 ? (
            <>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, bgcolor: "black" }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Verification Code"
                fullWidth
                margin="normal"
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, bgcolor: "black" }}
                onClick={handleVerify}
              >
                Verify Email
              </Button>
            </>
          )}

          {message && (
            <Typography variant="body2" color="white" mt={2}>
              Email Already Register
            </Typography>
          )}

          {step === 1 && (
            <>
              <Typography variant="h6" fontSize={15} py={1}>
                OR
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, bgcolor: "black" }}
                startIcon={<FcGoogle />}
                onClick={() => {
                  window.location.href = "http://localhost:3001/auth/google";
                }}
              >
                Register with Google
              </Button>
              <Typography variant="h6" fontSize={15} py={1}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Login
                </Link>
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
