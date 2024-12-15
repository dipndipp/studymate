import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { SaveAlt } from "@mui/icons-material";

// Data laporan per pelajaran
const reportData = {
  math: [
    { name: "Penjumlahan", score: 90, status: "Lulus" },
    { name: "Pengurangan", score: 85, status: "Lulus" },
  ],
  english: [
    { name: "Grammar", score: 80, status: "Lulus" },
    { name: "Vocabulary", score: 75, status: "Lulus" },
  ],
  science: [
    { name: "Fisika", score: 95, status: "Lulus" },
    { name: "Kimia", score: 90, status: "Lulus" },
  ],
};

const Report = () => {
  const { subjectId } = useParams(); // Ambil ID pelajaran dari URL
  const subjectReport = reportData[subjectId] || [];

  const handleDownload = () => {
    alert("Fitur unduh PDF belum diimplementasikan.");
  };

  return (
    <Box
      sx={{
        padding: "30px",
        backgroundColor: "#F2F2F2",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Laporan Progres - {subjectId}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: "#10AF13",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Topik
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Nilai
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjectReport.map((topic, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: "center", color: "#333" }}>
                  {topic.name}
                </TableCell>
                <TableCell sx={{ textAlign: "center", color: "#333" }}>
                  {topic.score}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: topic.status === "Lulus" ? "#10AF13" : "#FF0000",
                  }}
                >
                  {topic.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          startIcon={<SaveAlt />}
          sx={{
            backgroundColor: "#10AF13",
            color: "#FFFFFF",
            textTransform: "none",
            "&:hover": { backgroundColor: "#0e8e11" },
          }}
          onClick={handleDownload}
        >
          Unduh PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Report;
