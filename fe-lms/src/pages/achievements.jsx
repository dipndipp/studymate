import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import PDFDesigner from "../components/pdfReport";
import { getReports, getClasses, inputNilai } from "../api/endpoint";

const ERapor = () => {
  const [username, setUsername] = useState("");
  const [reportData, setReportData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [classCount, setClassCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [role, setRole] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [grade, setGrade] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.username);
          setRole(decodedToken.role);
          const response = await getReports(decodedToken.id);
          if (response.data.length === 0) {
            setIsErrorModalOpen(true);
          } else {
            setReportData(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch report data", error);
        setErrorMessage("Failed to fetch report data");
        setIsErrorModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchClassData = async () => {
      setIsLoading(true);
      try {
        const classResponse = await getClasses();
        setClassData(classResponse.data);
      } catch (error) {
        console.error("Failed to fetch class data", error);
        setErrorMessage("Failed to fetch class data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, []);

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const getGradeDescription = (grade) => {
    if (grade === 100) {
      return "Sempurna";
    } else if (grade > 90) {
      return "Sangat Baik";
    } else if (grade > 80) {
      return "Baik";
    } else if (grade > 75) {
      return "Kurang";
    } else {
      return "Perlu Peningkatan";
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "selectedClass") {
      setSelectedClass(parseInt(value));
    } else if (name === "grade") {
      setGrade(parseInt(value));
    } else if (name === "userId") {
      setUserId(parseInt(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        user_id: userId,
        class_id: selectedClass,
        grade: grade,
      };
      await inputNilai(data);
      alert("Nilai berhasil dimasukkan.");
    } catch (error) {
      console.error("Failed to input grade", error);
      setErrorMessage("Failed to input grade");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F5F7FA",
        minHeight: "100vh",
        padding: "20px",
        marginLeft: { xs: "0", md: "120px" },
        marginTop: { xs: "70px", md: "30px" }, // Adjust top margin for navbar
        marginBottom: { xs: "70px", md: "30px" }, // Adjust bottom margin for navbar
        fontFamily: "Poppins",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: "20px", color: "#333" }}
      >
        {username} Learning Summary
      </Typography>

      {role === "Admin" || role === "Guru" ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "#FFF",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: 3,
            marginBottom: "30px",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "20px", color: "#333" }}
          >
            Masukkan Nilai Siswa
          </Typography>
          <TextField
            label="User ID"
            name="userId"
            type="number"
            value={userId}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            select
            label="Pilih Kelas"
            name="selectedClass"
            value={selectedClass}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            {classData.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Nilai"
            name="grade"
            type="number"
            value={grade}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "20px" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              backgroundColor: "#10AF13",
              "&:hover": { backgroundColor: "#0e8e11" },
              padding: "10px",
              fontSize: "16px",
            }}
          >
            Masukkan Nilai
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ marginBottom: "30px" }}>
            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card sx={{ backgroundColor: "#E3F2FD" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <SchoolIcon
                        sx={{ fontSize: 40, color: "#10AF13", mr: 2 }}
                      />
                      <Typography>
                        <strong>Kelas diikuti:</strong> <br /> {classCount}{" "}
                        kelas
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card sx={{ backgroundColor: "#FFF4E5" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <AssignmentIcon
                        sx={{ fontSize: 40, color: "#F5A623", mr: 2 }}
                      />
                      <Typography>
                        <strong>Tugas Terkumpul:</strong> <br />{" "}
                        {assignmentCount} tugas
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "20px", color: "#333" }}
          >
            Report
          </Typography>
          <Typography
            variant="p"
            sx={{ fontWeight: "regular", marginBottom: "20px", color: "#333" }}
          >
            PS : Reload beberapa kali jika nilai pada tidak muncul pada pdf ya!
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1E2A38" }}>
                <TableRow>
                  <TableCell sx={{ color: "#FFF" }}>Kelas</TableCell>
                  <TableCell sx={{ color: "#FFF" }}>Nilai</TableCell>
                  <TableCell sx={{ color: "#FFF" }}>Keterangan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((topic, index) => (
                  <TableRow key={index} sx={{ textAlign: "center" }}>
                    <TableCell>{topic.class_name}</TableCell>
                    <TableCell>{topic.grade}</TableCell>
                    <TableCell>{getGradeDescription(topic.grade)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box textAlign="center" sx={{ marginTop: "20px" }}>
            <PDFDesigner />
          </Box>
        </>
      )}

      <Dialog open={isErrorModalOpen} onClose={handleCloseErrorModal}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>
            Nilai kamu belum terinput oleh guru. Silakan hubungi guru untuk
            informasi lebih lanjut.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorModal} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ERapor;
