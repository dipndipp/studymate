import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

const OfflineAlert = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineAlert(true);
      setTimeout(() => {
        setShowOnlineAlert(false);
        window.location.reload();
      }, 2000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          You are offline. Please check your internet connection.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showOnlineAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Back to online. The page will refresh shortly.
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineAlert;
