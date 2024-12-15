import React, { useState } from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";

const FileUploadButton = ({ onFileChange }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const handleClearFile = () => {
    setFileName("");
    onFileChange(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      <input
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <div style={{ display: "flex", alignItems: "center", paddingTop: "5px" }}>
        {" "}
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{
              backgroundColor: "#10AF13",
              "&:hover": { backgroundColor: "#0e8e11" },
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            Upload File
          </Button>
        </label>
      </div>

      {fileName && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography variant="body2" sx={{ color: "#555" }}>
            {fileName}
          </Typography>
          <IconButton
            onClick={handleClearFile}
            sx={{
              border: "1px solid #f44336",
              color: "#f44336",
              "&:hover": { backgroundColor: "#fddede" },
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadButton;
