"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 5,
          py: 15,
        }}
      >
        <Typography>Home Page</Typography>
        <br />

        <Link href="/payment">
          <Button sx={{ bgcolor: "grey", color: "black" }}>Payment</Button>
        </Link>
      </Box>
    </>
  );
}
