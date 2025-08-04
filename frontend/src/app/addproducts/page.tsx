"use client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import React, { useRef } from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  width: 400,
};

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string | null;
}

export default function ProductPage() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/products");

      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
      await axios.post("http://localhost:3001/products", payload);

      setOpen(false);
      setFormData({
        name: "",
        price: "",
        stock: "",
        description: "",
        imageUrl: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //image uploder
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  //delete product
  const handleDelete = async (productId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/products/${productId}`
      );
      console.log("Product deleted:", response.data);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting Product:", error);
      alert("Failed to delete product");
    }
  };
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingProduct) return;

      const formData = new FormData();
      formData.append("name", editName);
      formData.append("price", editPrice);
      formData.append("stock", editStock);
      formData.append("description", editDescription);

      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      const response = await axios.post(
        `http://localhost:3001/products/${editingProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update UI
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? response.data : p))
      );
      setEditingProduct(null);
      setEditImageFile(null);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // const handleUpdate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     if (!editingProduct) return;
  //     const formData = new FormData();
  //     formData.append("name", editName);
  //     formData.append("price", editPrice);
  //     formData.append("stock", editStock);
  //     formData.append("description", editDescription);
  //     if (editImageFile) {
  //       formData.append("image", editImageFile);
  //     }
  //     const response = await axios.post(
  //       `http://localhost:3001/products/${editingProduct.id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     setProducts((prev) =>
  //       prev.map((u) => (u.id === editingProduct.id ? response.data : u))
  //     );
  //     setEditingProduct(null);
  //     console.log("Product Updated succesfully");
  //   } catch (error) {
  //     console.log("Update failed", error);
  //   }
  // };
  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        sx={{ mb: 3, bgcolor: "black", color: "white" }}
        onClick={() => setOpen(true)}
      >
        Add Product
      </Button>

      {/* Product Form Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Add Product
          </Typography>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <TextField
            label="Stock"
            fullWidth
            margin="normal"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          {/* <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          /> */}
          <Box
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            sx={{
              border: "2px dashed #ccc",
              padding: 2,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#fafafa",
              mt: 2,
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Typography variant="body2">
              Drag & Drop image here or click to select
            </Typography>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="preview"
                style={{ width: "100%", marginTop: 8, maxHeight: 200 }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
          </Box>

          <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Products Display */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              width: 200,
              textAlign: "center",
              boxShadow: 3,
              borderRadius: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {product.imageUrl && (
              <CardMedia
                component="img"
                height="140"
                // image={
                //   product.imageUrl?.startsWith("http")
                //     ? product.imageUrl
                //     : `http://localhost:3001${product.imageUrl}`
                // }
                image={
                  product.imageUrl || product.imageUrl?.startsWith("http")
                    ? product.imageUrl
                    : `http://localhost:3001${product.imageUrl}`
                }
                alt={product.name}
                sx={{ height: 140, objectFit: "contain", mb: 1 }}
              />
            )}
            <Typography variant="h6">{product.name}</Typography>
            <Typography color="text.secondary">₹ {product.price}</Typography>
            <Typography variant="body2">{product.description}</Typography>
            <Typography variant="caption" display="block">
              Stock: {product.stock}
            </Typography>
            {/* <Button
              variant="contained"
              sx={{
                mt: 1,
                bgcolor: "grey.800",
                "&:hover": { bgcolor: "grey.700" },
                borderRadius: 1,
                px: 3,
              }}
            >
              Buy
            </Button> */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setEditingProduct(product);
                  setEditName(product.name);
                  setEditPrice(product.price.toString());
                  setEditStock(product.stock.toString());
                  setEditDescription(product.description);
                }}
              >
                Edit
              </Button>
              {editingProduct && (
                <Modal open={true} onClose={() => setEditingProduct(null)}>
                  <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                      Edit Product: {editingProduct.name}
                    </Typography>
                    <form onSubmit={handleUpdate}>
                      <Box
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file) setEditImageFile(file);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          border: "2px dashed #ccc",
                          padding: 2,
                          textAlign: "center",
                          cursor: "pointer",
                          bgcolor: "#fafafa",
                          mt: 2,
                        }}
                      >
                        <Typography variant="body2">
                          Drag & Drop image here or click to select
                        </Typography>
                        {editImageFile ? (
                          <img
                            src={URL.createObjectURL(editImageFile)}
                            alt="preview"
                            style={{
                              width: "100%",
                              marginTop: 8,
                              maxHeight: 200,
                            }}
                          />
                        ) : editingProduct.imageUrl ? (
                          <img
                            src={`http://localhost:3001/${editingProduct.imageUrl}`}
                            alt="current"
                            style={{
                              width: "100%",
                              marginTop: 8,
                              maxHeight: 200,
                            }}
                          />
                        ) : null}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setEditImageFile(e.target.files[0]);
                            }
                          }}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Price"
                        margin="normal"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Stock"
                        margin="normal"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />

                      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                        <Button type="submit" variant="contained">
                          Update
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Modal>
              )}

              {/* {editingProduct && (
                <Modal open={true} onClose={() => setEditingProduct(null)}>
                  <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                      Edit User: {editingProduct.name}
                    </Typography>
                    <form onSubmit={handleUpdate}>
                      <Box
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                          border: "2px dashed #ccc",
                          padding: 2,
                          textAlign: "center",
                          cursor: "pointer",
                          bgcolor: "#fafafa",
                          mt: 2,
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Typography variant="body2">
                          Drag & Drop image here or click to select
                        </Typography>
                        {formData.imageUrl && (
                          <img
                            src={formData.imageUrl}
                            alt="preview"
                            style={{
                              width: "100%",
                              marginTop: 8,
                              maxHeight: 200,
                            }}
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={fileInputRef}
                          onChange={handleImageSelect}
                        />
                      </Box>

                     
                      <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Price"
                        margin="normal"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Stock"
                        margin="normal"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
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
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Modal>
              )} */}
              {/* Delete details */}
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
