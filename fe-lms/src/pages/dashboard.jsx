import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Box,
  Grid,
  Typography,
  Card,
  Button,
  Avatar,
  LinearProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ForumIcon from "@mui/icons-material/Forum";
import { jwtDecode } from "jwt-decode";
import { isAuthenticated, redirectToLogin } from "../utils/authMiddleware";
import {
  countUser,
  getClasses,
  getClassesByStudentId,
  countAssignmentByClassID,
} from "../api/endpoint";

const features = [
  {
    label: "e-Rapor",
    icon: <SchoolIcon fontSize="large" />,
    href: "/achievements",
  },
  { label: "Kelas", icon: <MenuBookIcon fontSize="large" />, href: "/classes" },
  { label: "Forum", icon: <ForumIcon fontSize="large" />, href: "/forum" },
];

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [classReminders, setClassReminders] = useState([]);
  const [userCounts, setUserCounts] = useState({
    students: 0,
    teachers: 0,
    admins: 0,
  });
  const [classCount, setClassCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToLogin();
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
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

    fetchUserCounts();
  }, []);

  useEffect(() => {
    const fetchClassReminders = async () => {
      try {
        const response = await getClasses();
        const classes = response.data;

        console.log("Fetched classes:", classes); // Debugging log

        // Filter and sort classes based on the nearest schedule time
        const now = new Date();
        const sortedClasses = classes
          .map((cls) => {
            console.log("Processing class:", cls); // Debugging log
            const [hours, minutes] = cls.jadwal_kelas.split(":");
            const classTime = new Date();
            if (!isNaN(hours) && !isNaN(minutes)) {
              classTime.setHours(hours, minutes, 0, 0);
              console.log("Class time set to:", classTime); // Debugging log
              return { ...cls, classTime };
            } else {
              console.log("Invalid time format for class:", cls); // Debugging log
              return null;
            }
          })
          .filter((cls) => cls && cls.classTime > now)
          .sort((a, b) => a.classTime - b.classTime)
          .slice(0, 4);

        console.log("Sorted classes:", sortedClasses); // Debugging log

        setClassReminders(sortedClasses);
      } catch (error) {
        console.error("Failed to fetch class reminders", error);
      }
    };

    fetchClassReminders();
  }, []);
  const filterUniqueClasses = (classes) => {
    return classes.filter(
      (cls, index, self) =>
        index === self.findIndex((c) => c.class_code === cls.class_code)
    );
  };

  useEffect(() => {
    const fetchClassCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          if (role === "Siswa") {
            const response = await getClassesByStudentId(userId);
            const uniqueClasses = filterUniqueClasses(response.data);
            setClassCount(uniqueClasses.length);
          }
        }
      } catch (error) {
        console.error("Failed to fetch class count", error);
      }
    };

    if (role === "Siswa") {
      fetchClassCount();
    }
  }, [role]);

  useEffect(() => {
    const fetchAssignmentCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          if (role === "Siswa") {
            const response = await getClassesByStudentId(userId);
            const uniqueClasses = filterUniqueClasses(response.data);
            setAssignmentCount(uniqueClasses.length);
          }
        }
      } catch (error) {
        console.error("Failed to fetch assignment count", error);
      }
    };

    if (role === "Siswa") {
      fetchAssignmentCount();
    }
  }, [role]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
        fontFamily: "Poppins",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: "20px",
          marginLeft: { xs: "0", md: "130px" },
          marginTop: { xs: "70px", md: "40px" },
        }}
      >
        {/* Header */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            lineHeight: "1.2",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Hello, <span style={{ color: "#10AF13" }}>{username}</span>
        </Typography>
        <Typography
          sx={{
            marginBottom: "20px",
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          Welcome Back! Lets Continue Your Learning Journey
        </Typography>

        {/* Features */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {features.map((feature, index) => (
            <Button
              key={index}
              component={Link}
              to={feature.href}
              variant="contained"
              startIcon={feature.icon}
              sx={{
                textTransform: "none",
                backgroundColor: "#FFFFFF",
                color: "#333",
                borderRadius: "15px",
                padding: "15px 20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                "&:hover": { backgroundColor: "#10AF13", color: "#FFF" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              {feature.label}
            </Button>
          ))}
        </Box>

        {/* Class Reminder */}
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          Sebentar lagi kelas kamu akan dimulai!
        </Typography>
        <Grid container spacing={2}>
          {classReminders && classReminders.length > 0 ? (
            classReminders.map((reminder, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    padding: "20px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: "5px" }}
                  >
                    {reminder.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#10AF13" }}>
                    {reminder.jadwal_kelas}
                  </Typography>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="caption"
              sx={{
                color: "#757575",
                textAlign: "center",
                width: "100%",
                marginTop: "20px",
              }}
            >
              Tidak ada kelas mendatang
            </Typography>
          )}
        </Grid>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "90%", md: "250px" },
          backgroundColor: "#FFFFFF",
          padding: "20px",
          boxShadow: {
            xs: "0 -2px 10px rgba(0,0,0,0.1)",
            md: "-2px 0 10px rgba(0,0,0,0.1)",
          },
          borderRadius: "20px",
          margin: "20px",
          position: "relative",
          marginTop: { xs: "20px", md: "0" },
          flex: { xs: 1, md: "none" },
          marginBottom: { xs: "80px", md: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <NotificationsIcon />
        </Box>
        <Box sx={{ textAlign: "center", marginY: "20px" }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              margin: "0 auto",
              backgroundColor: "#10AF13",
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginTop: "10px" }}
          >
            {username}
          </Typography>
          <Typography variant="body2" sx={{ color: "#757575" }}>
            {role}
          </Typography>
        </Box>
        {role === "Siswa" && (
          <>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginBottom: "10px" }}
            >
              Statistik
            </Typography>
            <Card
              sx={{
                padding: "20px",
                backgroundColor: "#E3F2FD",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#10AF13" }}
              >
                {classCount}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Kelas diikuti
              </Typography>
            </Card>
            <Card
              sx={{
                padding: "20px",
                backgroundColor: "#E3F2FD",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#10AF13" }}
              >
                {assignmentCount}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Tugas Terkumpul
              </Typography>
            </Card>
          </>
        )}

        {(role === "Admin" || role === "Guru") && (
          <>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                marginBottom: "10px",
                marginTop: "20px",
              }}
            >
              User Counts
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    padding: "20px",
                    backgroundColor: "#F1F8E9",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#10AF13" }}
                  >
                    {userCounts.Siswa}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Students
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{
                    padding: "20px",
                    backgroundColor: "#E3F2FD",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#10AF13" }}
                  >
                    {userCounts.Guru}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Teachers
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{
                    padding: "20px",
                    backgroundColor: "#FFEBEE",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#10AF13" }}
                  >
                    {userCounts.Admin}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Admins
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
