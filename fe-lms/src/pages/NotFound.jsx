import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: "#f44336" }} />
      <Typography
        variant="h1"
        sx={{ fontWeight: "bold", color: "#333", mt: 2 }}
      >
        404
      </Typography>
      <Typography variant="h6" sx={{ color: "#757575", mt: 1 }}>
        Oops! Halaman yang Anda cari tidak ditemukan.
      </Typography>
      <Button
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: "#10AF13",
          "&:hover": { backgroundColor: "#0e8e11" },
        }}
        onClick={handleGoBack}
      >
        Kembali ke Beranda
      </Button>
    </Box>
  );
};

export default NotFound;
