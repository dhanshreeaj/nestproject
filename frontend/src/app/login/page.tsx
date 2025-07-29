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
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlesubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      router.push("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error?.response?.data?.message || "Login failed.");
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: "20%", md: "35%" },
          py: { xs: "40%", md: "10%" },
          bgcolor: "lightgrey",
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
              bgcolo: "grey",
            }}
          >
            <Typography variant="h5" color="black" fontWeight="bold">
              Login
            </Typography>
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography variant="subtitle2" align="right">
              Forgot Password?
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "black",
              }}
              onClick={handlesubmit}
            >
              Login
            </Button>
            <Typography variant="h6" fontSize={15} py={1}>
              OR
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "black",
              }}
              startIcon={<FcGoogle />}
              onClick={() => {
                window.location.href = "http://localhost:3001/auth/google";
              }}
            >
              Login with Goole
            </Button>
            <Typography variant="h6" fontSize={15} py={1}>
              Don&apos;t have an account?
              <Link
                href="/register"
                style={{ textDecoration: "none", color: "black" }}
              >
                Register
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
