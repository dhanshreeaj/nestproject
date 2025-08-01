"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: string;
}
interface Payment {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  email: string;
  amount: number;
  createdAt: string;
}

export default function AdminHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  const fetchUsers = async () => {
    setShowPayments(false);
    if (showUsers) {
      setShowUsers(false);
    } else {
      try {
        const res = await axios.get("http://localhost:3001/auth/users");
        setUsers(res.data);
        setShowUsers(true);
      } catch (err) {
        console.error("Error to fetching users:", err);
      }
    }
  };
  const fetchPayments = async () => {
    setShowUsers(false);
    if (showPayments) {
      setShowPayments(false);
    } else {
      try {
        const res = await axios.get("http://localhost:3001/auth/payments");
        setPayments(res.data);
        setShowPayments(true);
      } catch (err) {
        console.error("Error to fetching payments:", err);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingUser) return;
      const response = await axios.patch(
        `http://localhost:3001/auth/users/${editingUser.id}`,
        {
          name: editName,
          email: editEmail,
        }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? response.data : u))
      );
      setEditingUser(null);
    } catch (error) {
      console.log("Update failed", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/auth/users/${userId}`
      );
      console.log("User deleted:", response.data);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 3,
          px: 3,
          gap: 3,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            onClick={fetchUsers}
            sx={{ mb: 3, bgcolor: "black", color: "white" }}
          >
            {showUsers ? "Hide Users" : "View Users"}
          </Button>
          <br />

          {showUsers && (
            <TableContainer
              component={Paper}
              // sx={{ bgcolor: "grey" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Verified</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Edit</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Delete</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </TableCell>
                      {/* Edit details */}
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setEditingUser(user);
                            setEditName(user.name);
                            setEditEmail(user.email);
                          }}
                        >
                          Edit
                        </Button>
                        {editingUser && (
                          <Paper sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h6" mb={2}>
                              Edit User: {editingUser.name}
                            </Typography>
                            <form onSubmit={handleUpdate}>
                              <input
                                type="text"
                                placeholder="Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                              <input
                                type="email"
                                placeholder="Email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                              />
                              <Button
                                type="submit"
                                variant="contained"
                                sx={{ ml: 2 }}
                              >
                                Update
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ ml: 2 }}
                                onClick={() => setEditingUser(null)}
                              >
                                Cancel
                              </Button>
                            </form>
                          </Paper>
                        )}
                      </TableCell>
                      {/* Delete details */}
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Button
            variant="contained"
            onClick={fetchPayments}
            sx={{ mb: 3, bgcolor: "black", color: "white" }}
          >
            {showPayments ? "Hide payments" : "View Payments"}
          </Button>

          {showPayments && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Order ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Payment ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.razorpayOrderId}</TableCell>
                      <TableCell>{payment.razorpayPaymentId}</TableCell>
                      <TableCell>{payment.email}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </>
  );
}
