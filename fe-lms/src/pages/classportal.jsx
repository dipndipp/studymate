import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Modal,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import {
  getClasses,
  getClassesByStudentId,
  createClass,
  deleteClass,
  updateClass,
  joinClass,
} from "../api/endpoint";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";

// Fungsi untuk mengenerate kode kelas
const generateClassCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = Math.floor(Math.random() * 2) + 6; // Generate length between 6 and 7
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateUniqueClassCode = (existingCodes) => {
  let newCode;
  do {
    newCode = generateClassCode();
  } while (existingCodes.includes(newCode));
  return newCode;
};

const PortalClass = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [classCode, setClassCode] = useState(generateClassCode());
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [classSchedule, setClassSchedule] = useState("");
  const [classTeacher, setClassTeacher] = useState("");
  const [classToDelete, setClassToDelete] = useState(null);
  const [classToEdit, setClassToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [joinClassCode, setJoinClassCode] = useState("");
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);
  const [isJoinClassError, setIsJoinClassError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
      setUserId(decodedToken.id);
    }
  }, []);

  useEffect(() => {
    console.log("Role:", role, "User ID:", userId); // Debugging
    if (role && userId) {
      fetchClasses();
    }
  }, [role, userId]);

  const fetchClasses = async () => {
    try {
      let response;
      if (role === "Siswa") {
        response = await getClassesByStudentId(userId);
      } else {
        response = await getClasses();
      }
      console.log("API response:", response); // Debugging
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const uniqueClasses = response.data.filter(
          (cls, index, self) =>
            index === self.findIndex((c) => c.class_code === cls.class_code)
        );
        const sortedClasses = uniqueClasses.sort((a, b) => a.id - b.id); // Sort data berdasarkan ID secara ascending
        setClasses(sortedClasses);
      } else {
        console.error(
          "Expected response.data to be a non-empty array, but got:",
          typeof response.data
        );
        setClasses([]);
      }
    } catch (error) {
      console.error("Failed to fetch classes", error);
      setClasses([]);
    }
  };

  const handleOpenModal = () => {
    const existingCodes = classes.map((cls) => cls.class_code);
    setClassCode(generateUniqueClassCode(existingCodes));
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClassToEdit(null);
  };

  const handleOpenDeleteModal = (classId) => {
    setClassToDelete(classId);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleCreateClass = async () => {
    if (!className || !classSchedule || !classTeacher) {
      setIsValidationModalOpen(true);
      return;
    }

    try {
      const newClass = {
        name: className,
        jadwal_kelas: classSchedule,
        teacher: classTeacher,
        class_code: classCode,
      };
      await createClass(newClass);
      fetchClasses();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create class", error);
    }
  };

  const handleEditClass = async () => {
    if (!className || !classSchedule || !classTeacher) {
      setIsValidationModalOpen(true);
      return;
    }

    try {
      const updatedClass = {
        name: className,
        jadwal_kelas: classSchedule,
        teacher: classTeacher,
        class_code: classCode,
      };
      await updateClass(classToEdit.id, updatedClass);
      fetchClasses();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update class", error);
    }
  };

  const handleCloseValidationModal = () => setIsValidationModalOpen(false);

  const handleDeleteClass = async () => {
    try {
      await deleteClass(classToDelete);
      fetchClasses();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete class", error);
    }
  };

  const handleEnterClass = (classId) => {
    navigate(`/class/${classId}`);
  };

  const handleSettingsClick = (event, cls) => {
    setAnchorEl(event.currentTarget);
    setClassToEdit(cls);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setClassName(classToEdit.name);
    setClassSchedule(classToEdit.description); // Menggunakan description dari response
    setClassTeacher(classToEdit.teacher);
    setClassCode(classToEdit.class_code); // Set class code from the class to edit
    setIsModalOpen(true);
    handleSettingsClose();
  };

  const handleDeleteClick = () => {
    handleOpenDeleteModal(classToEdit.id);
    handleSettingsClose();
  };
  const handleJoinClass = async () => {
    if (!joinClassCode) {
      setIsJoinClassError(true);
      return;
    }

    try {
      const response = await getClasses(); // Ambil semua kelas untuk mendapatkan ID kelas berdasarkan kode kelas
      const classData = response.data.find(
        (cls) => cls.class_code === joinClassCode
      );

      if (!classData) {
        setIsJoinClassError(true);
        return;
      }

      const class_id = classData.id; // Gunakan ID kelas yang ditemukan
      await joinClass(class_id, { class_code: joinClassCode });
      fetchClasses();
      handleCloseJoinClassModal();
    } catch (error) {
      console.error("Failed to join class", error);
      setIsJoinClassError(true);
    }
  };
  const handleOpenJoinClassModal = () => {
    setJoinClassCode("");
    setIsJoinClassModalOpen(true);
    setIsJoinClassError(false);
  };

  const handleCloseJoinClassModal = () => {
    setIsJoinClassModalOpen(false);
    setJoinClassCode("");
    setIsJoinClassError(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
        fontFamily: "Poppins",
        marginBottom: { xs: "70px", md: "30px" },
      }}
    >
      <Navbar />

      <Box
        sx={{
          flex: 1,
          padding: { xs: "20px", md: "30px" },
          marginLeft: { xs: "0", md: "130px" },
          marginTop: { xs: "70px", md: "30px" },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              lineHeight: "1.2",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Portal Kelas
          </Typography>
          {(role === "Admin" || role === "Guru") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#10AF13",
                color: "#FFF",
                padding: "10px 20px",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#0D8E10" },
              }}
              onClick={handleOpenModal}
            >
              Tambah Kelas
            </Button>
          )}
          {role === "Siswa" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#10AF13",
                color: "#FFF",
                padding: "10px 20px",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#0D8E10" },
              }}
              onClick={handleOpenJoinClassModal}
            >
              Join Kelas
            </Button>
          )}
        </Box>

        {/* Class Cards */}
        {classes.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              color: "#757575",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Kamu belum terdaftar di kelas manapun.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {classes.map((cls, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#FFF",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                    position: "relative", // Tambahkan posisi relatif untuk card
                  }}
                >
                  {(role === "Admin" || role === "Guru") && (
                    <>
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#757575",
                        }}
                        onClick={(event) => handleSettingsClick(event, cls)}
                      >
                        <SettingsIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleSettingsClose}
                      >
                        <MenuItem onClick={handleEditClick}>
                          <EditIcon sx={{ marginRight: 1 }} /> Edit
                        </MenuItem>
                        <MenuItem onClick={handleDeleteClick}>
                          <DeleteIcon sx={{ marginRight: 1 }} /> Delete
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "20px",
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: "#10AF13",
                        width: 60,
                        height: 60,
                        marginBottom: "15px",
                      }}
                    >
                      <ClassIcon fontSize="large" sx={{ color: "#FFF" }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        textAlign: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {cls.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#757575",
                        textAlign: "center",
                        marginBottom: "5px",
                      }}
                    >
                      Guru: {cls.teacher}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#757575",
                        textAlign: "center",
                        marginBottom: "15px",
                      }}
                    >
                      Jadwal: {cls.jadwal_kelas}{" "}
                      {/* Menggunakan description dari response */}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#757575",
                        textAlign: "center",
                        marginBottom: "15px",
                      }}
                    >
                      Kode Kelas: {cls.class_code}{" "}
                      {/* Menggunakan description dari response */}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#10AF13",
                        borderColor: "#10AF13",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#E8F5E9",
                          borderColor: "#10AF13",
                        },
                        marginBottom: "10px",
                      }}
                      onClick={() => handleEnterClass(cls.id)}
                    >
                      Masuk Kelas
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Modal Buat/Edit Kelas */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {classToEdit ? "Edit Kelas" : "Buat Kelas Baru"}
          </Typography>
          <TextField
            fullWidth
            label="Nama Kelas"
            variant="outlined"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Jadwal Kelas"
            type="time"
            variant="outlined"
            value={classSchedule}
            onChange={(e) => setClassSchedule(e.target.value)}
            sx={{
              mb: 2,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Guru"
            variant="outlined"
            value={classTeacher}
            onChange={(e) => setClassTeacher(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Kode Kelas"
            variant="outlined"
            value={classCode}
            InputProps={{
              readOnly: true,
              style: { color: "gray" }, // Ubah warna teks menjadi abu-abu
            }}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#10AF13",
              "&:hover": { backgroundColor: "#0e8e11" },
            }}
            onClick={classToEdit ? handleEditClass : handleCreateClass}
          >
            {classToEdit ? "Simpan Perubahan" : "Buat Kelas"}
          </Button>
        </Box>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Yakin ingin menghapus kelas ini?
          </Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            Hapus semua file Materials dan Assignments yang ada di dalam kelas
            ini agar kelas benar benar terhapus.
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mr: 2 }}
            onClick={handleDeleteClass}
          >
            Hapus
          </Button>
          <Button variant="outlined" onClick={handleCloseDeleteModal}>
            Batal
          </Button>
        </Box>
      </Modal>

      {/* Modal Join Kelas */}
      <Modal open={isJoinClassModalOpen} onClose={handleCloseJoinClassModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Join Kelas
          </Typography>
          <TextField
            fullWidth
            label="Kode Kelas"
            variant="outlined"
            value={joinClassCode}
            onChange={(e) => setJoinClassCode(e.target.value)}
            sx={{ mb: 2 }}
            error={isJoinClassError}
            helperText={
              isJoinClassError ? "Kode kelas tidak valid, periksa kembali." : ""
            }
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#10AF13",
              "&:hover": { backgroundColor: "#0e8e11" },
            }}
            onClick={handleJoinClass}
          >
            Join
          </Button>
        </Box>
      </Modal>

      {/* Modal Validasi */}
      <Dialog open={isValidationModalOpen} onClose={handleCloseValidationModal}>
        <DialogTitle
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            marginTop: "20px",
          }}
        >
          <WarningAmberIcon sx={{ color: "#FFA726", fontSize: 40 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Peringatan
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ color: "#757575" }}>
            Harap isi semua field sebelum membuat kelas.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseValidationModal}
            variant="contained"
            sx={{
              backgroundColor: "#FFA726",
              color: "#FFF",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#FB8C00" },
              marginBottom: "20px",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortalClass;
