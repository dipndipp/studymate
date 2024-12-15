import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { IonIcon } from "@ionic/react";
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  schoolOutline,
} from "ionicons/icons";
import { login } from "../../api/endpoint";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await login({ username, password });
      setLoginSuccess(true);
      setLoginFailed(false);
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      setLoginFailed(true);
      setLoginSuccess(false);
    }
  };

  const handleClose = () => {
    setLoginSuccess(false);
    setLoginFailed(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #10AF13, #4CAF50, #81C784)",
        padding: "20px",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          borderRadius: "15px",
          textAlign: "center",
          animation: "fade-in 1s",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#10AF13",
              width: "70px",
              height: "70px",
            }}
          >
            <IonIcon
              icon={schoolOutline}
              style={{ fontSize: "40px", color: "#fff" }}
            />
          </Avatar>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginBottom: "30px",
            color: "#555",
          }}
        >
          Please login to continue to your dashboard.
        </Typography>
        <Box component="form">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IonIcon
                    icon={mailOutline}
                    style={{ fontSize: "20px", color: "#555" }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IonIcon
                    icon={lockClosedOutline}
                    style={{ fontSize: "20px", color: "#555" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      style={{ fontSize: "20px", color: "#555" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#10AF13",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px",
              marginTop: "20px",
              "&:hover": {
                backgroundColor: "#0E9F12",
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{
            marginTop: "20px",
            color: "#555",
          }}
        >
          Don't have an account?{" "}
          <span style={{ color: "#10AF13", fontWeight: "bold" }}>
            Please Contact Admin
          </span>
        </Typography>
      </Paper>

      <Dialog
        open={loginSuccess}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
            background: "linear-gradient(to right, #4CAF50, #81C784)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "24px", fontWeight: "bold" }}>
          Login Successful
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "18px" }}>
            Login Successful! Redirecting...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "#fff",
              color: "#10AF13",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={loginFailed}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
            background: "linear-gradient(to right, #FF5252, #FF1744)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "24px", fontWeight: "bold" }}>
          Login Failed
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "18px" }}>
            Login Failed! Please try again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "#fff",
              color: "#FF1744",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          You are offline. Please check your internet connection.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
