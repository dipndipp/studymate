// src/utils/fetchMiddleware.js
import React, { useState, useEffect } from "react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

const FetchMiddleware = ({ isLoading, errorMessage, children }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsAlertOpen(true);
    } else {
      setIsAlertOpen(false);
    }
  }, [isLoading]);

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      {children}
      <Dialog open={isAlertOpen} onClose={handleCloseAlert}>
        <DialogTitle>Loading</DialogTitle>
        <DialogContent>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Mohon tunggu, sedang memproses data. Periksa kembali koneksi
            internet Anda jika proses ini memakan waktu terlalu lama.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FetchMiddleware;
