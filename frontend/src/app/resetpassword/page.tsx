"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:3001/auth/resetpassword", {
        email,
        code,
        newPassword,
      });
      alert("Pasword reset Successful");
      router.push("/home");
    } catch (error) {
      alert("Failed to reset password");
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
              display: "flex",
              flexDirection: "column",
              p: 4,
              borderRadius: 3,
              gap: 3,
              textAlign: "center",
              bgcolor: "grey",
              width: { xs: 350, md: 500 },
              bgcolo: "grey",
            }}
          >
            <Typography variant="h6" fontWeight="bold" fontSize={15}>
              OTP Sent to {email}
            </Typography>
            <Typography variant="h5">Reset Password</Typography>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="OTP"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <TextField
              label="New Password"
              fullWidth
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleReset}
              sx={{
                mt: 2,
                bgcolor: "black",
              }}
            >
              Reset Password
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
