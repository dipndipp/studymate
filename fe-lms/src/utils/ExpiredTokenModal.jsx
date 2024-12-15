import React, { useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const ExpiredTokenModal = ({ open, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      onClose();
    }
  }, [location, onClose]);

  const handleRedirect = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Modal open={open && location.pathname !== "/login"} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="h2">
          Session Expired
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Your session has expired. Please log in again.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#10AF13",
            "&:hover": { backgroundColor: "#0e8e11" },
          }}
          onClick={handleRedirect}
        >
          Go to Login
        </Button>
      </Box>
    </Modal>
  );
};

export default ExpiredTokenModal;
