import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/material";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Authenetication",
  description: "Login and register",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
