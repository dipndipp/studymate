import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Container,
  Modal,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import { register, countUser } from "../api/endpoint";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("Admin");
  const [userCounts, setUserCounts] = useState({
    students: 0,
    teachers: 0,
    admins: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setId(decodedToken.id);
      setUsername(decodedToken.username);
      setRole(decodedToken.role);
    }
  }, []);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await countUser();
        setUserCounts(response.data);
      } catch (error) {
        console.error("Failed to fetch user counts", error);
      }
    };

    if (role === "Admin") {
      fetchUserCounts();
    }
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRegisterOpen = () => setIsRegisterModalOpen(true);
  const handleRegisterClose = () => setIsRegisterModalOpen(false);

  const handleRegister = async () => {
    try {
      await register({
        username: newUsername,
        password: newPassword,
        role: newRole,
      });
      handleRegisterClose();
      alert("User registered successfully!");
    } catch (error) {
      console.error("Failed to register user", error);
      alert("Failed to register user");
    }
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" }}
    >
      <Navbar />
      <Container
        sx={{
          flex: 1,
          padding: "20px",
          marginLeft: { xs: 0, md: "120px" },
          marginTop: { xs: "70px", md: "30px" },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#333", mb: 4 }}
        >
          Pengaturan
        </Typography>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
          >
            Profil Pengguna
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "#10AF13", mr: 2 }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                User Id : {id}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Username : {username}
              </Typography>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                Role : {role}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="outlined"
            sx={{
              color: "#f44336",
              borderColor: "#f44336",
              "&:hover": { backgroundColor: "#fddede" },
              mt: 2,
            }}
            onClick={handleOpen}
          >
            Logout
          </Button>
        </Box>

        {role === "Admin" && (
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
            >
              Admin Console
            </Typography>
            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    padding: "20px",
                    backgroundColor: "#F1F8E9",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Students
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#10AF13" }}
                  >
                    {userCounts.Siswa}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    padding: "20px",
                    backgroundColor: "#E3F2FD",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Teachers
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#10AF13" }}
                  >
                    {userCounts.Guru}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    padding: "20px",
                    backgroundColor: "#FFEBEE",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Admins
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#10AF13" }}
                  >
                    {userCounts.Admin}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#10AF13",
                "&:hover": { backgroundColor: "#0e8e11" },
                mb: 2,
                mt: 2,
              }}
              onClick={handleRegisterOpen}
            >
              Tambahkan User Baru
            </Button>
          </Box>
        )}
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Konfirmasi Logout
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Apakah Anda yakin ingin logout?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#10AF13",
                "&:hover": { backgroundColor: "#0e8e11" },
                mr: 2,
              }}
              onClick={handleLogout}
            >
              Ya
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Tidak
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isRegisterModalOpen}
        onClose={handleRegisterClose}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography id="register-modal-title" variant="h6" component="h2">
            Register New User
          </Typography>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography sx={{ mt: 2 }}>Role:</Typography>
          <RadioGroup
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            sx={{ display: "flex", flexDirection: "row", mt: 1 }}
          >
            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
            <FormControlLabel value="Siswa" control={<Radio />} label="Siswa" />
            <FormControlLabel value="Guru" control={<Radio />} label="Guru" />
          </RadioGroup>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#10AF13",
                "&:hover": { backgroundColor: "#0e8e11" },
                mr: 2,
              }}
              onClick={handleRegister}
            >
              Register
            </Button>
            <Button variant="outlined" onClick={handleRegisterClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SettingsPage;
