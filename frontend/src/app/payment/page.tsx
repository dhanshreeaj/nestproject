"use client";

import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import Script from "next/script";

export default function Payment() {
  const handlePayment = async () => {
    const { data: order } = await axios.post(
      "http://localhost:3001/payment/create-order",
      {
        amount: 500,
      }
    );

    const options = {
      key: "rzp_test_65gklXAz8r96kp", // your Razorpay test key
      amount: order.amount,
      currency: "INR",
      name: "Stallion",
      description: "Test Transaction",
      order_id: order.id,
      handler: function (response: any) {
        alert("Payment successful: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Dhanshree",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
        <Typography variant="h6">Make Payment</Typography>
        <Button
          sx={{ bgcolor: "grey", color: "black" }}
          onClick={handlePayment}
        >
          Pay
        </Button>
      </Box>
    </>
  );
}
