"use client";

import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
// interface Product {
//   id: number;
//   src: string;
//   name: string;
//   price: number;
// }
// const products: Product[] = [
//   { id: 1, src: "/assets/facewash.png", name: "Facewash", price: 199 },
//   { id: 2, src: "/assets/shampoo.png", name: "Shampoo", price: 199 },
//   { id: 3, src: "/assets/hair_wax.png", name: "Hair wax", price: 149 },
// ];
// function ProductCard({ product }: { product: Product }) {
//   const theme = useTheme();
//   return (
//     <Box
//       key={product.id}
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         bgcolor: "background.paper",
//         boxShadow:
//           theme.palette.mode === "dark"
//             ? "0px 4px 10px rgba(255, 255, 255, 0.3)"
//             : theme.shadows[3],
//         p: 2,
//         borderRadius: 2,
//         alignItems: "center",
//         color: "text.secondary",
//       }}
//     >
//       <Image
//         src={product.src}
//         alt={product.name}
//         width={180}
//         height={180}
//         style={{ objectFit: "cover", borderRadius: 8 }}
//       />
//       <Typography variant="subtitle1" fontWeight="bold" mt={2}>
//         {product.name}
//       </Typography>
//       <Typography variant="body1" fontWeight="bold">
//         ₹{product.price}
//       </Typography>
//       <Link href="/payment" passHref>
//         <Button sx={{ bgcolor: "grey", color: "black" }}>Buy</Button>
//       </Link>
//     </Box>
//   );
//}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;
}

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://api.stalliongrooming.com"
      : "http://localhost:3001";

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);

      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
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
                  image={product.imageUrl}
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
              <Link href="/payment" passHref>
                <Button
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
                </Button>
              </Link>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}
