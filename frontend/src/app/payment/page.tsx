"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color: string;
  };
}

interface RazorpayInstance {
  open(): void;
}

export default function Payment() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    address1: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // async function confirmOrderAndDeliver() {
  //   try {
  //     await axios.post("http://localhost:3001/payment/confirm-order", {
  //       // razorpayPaymentId: response.razorpay_payment_id,
  //       razorpayPaymentId: "fake id",

  //       address: form,
  //     });
  //     // alert("Payment successful: " + response.razorpay_payment_id);
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error(
  //         "Shiprocket Order Failed",
  //         error.response?.data || error.message
  //       );
  //     } else {
  //       console.error("Unexpected error:", error);
  //     }
  //     alert("Payment succeeded but order creation failed");
  //   }
  // }

  const handlePayment = async () => {
    //return confirmOrderAndDeliver();

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
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          await axios.post("http://localhost:3001/payment/verify", {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            address: form,
            amount: order.amount / 100,
            email: form.email,
          });

          alert("Payment successful: " + response.razorpay_payment_id);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Shiprocket Order Failed",
              error.response?.data || error.message
            );
          } else {
            console.error("Unexpected error:", error);
          }
          alert("Payment succeeded but order creation failed");
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
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
        <Typography variant="h6">Order Process</Typography>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
        <TextField
          label="Address"
          name="address1"
          value={form.address1}
          onChange={handleChange}
        />
        <TextField
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
        />
        <TextField
          label="Postal Code"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
        />
        <TextField
          label="Country"
          name="country"
          value={form.country}
          onChange={(e) =>
            setForm({
              ...form,
              country:
                e.target.value.trim().toLowerCase() === "india"
                  ? "India"
                  : e.target.value,
            })
          }
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

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
