import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ForumIcon from "@mui/icons-material/Forum";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const location = useLocation();

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const routes = [
    { label: "Dashboard", href: "/", icon: <HomeIcon /> },
    { label: "Courses", href: "/classes", icon: <MenuBookIcon /> },
    { label: "Achievements", href: "/achievements", icon: <EmojiEventsIcon /> },
    { label: "Forum", href: "/forum", icon: <ForumIcon /> },
    { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
  ];

  // Hide navbar on login page
  if (location.pathname === "/login" || location.pathname === "/404") {
    return null;
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: { xs: "70px", md: "100px" },
          backgroundColor: "#FFFFFF",
          padding: "20px 0",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          position: "fixed",
          height: "90vh",
          borderRadius: "20px",
          margin: "20px",
        }}
      >
        <SchoolIcon
          sx={{ fontSize: "40px", marginBottom: "30px", color: "#10AF13" }}
        />
        {routes.map((route, index) => (
          <IconButton
            key={index}
            href={route.href}
            sx={{ margin: "20px 0", color: "#333" }}
          >
            {route.icon}
          </IconButton>
        ))}
      </Box>

      {/* Mobile Navbar */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          width: "100%",
          position: "fixed",
          zIndex: 10,
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            padding: "10px 20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SchoolIcon
            sx={{ fontSize: "30px", marginRight: "10px", color: "#10AF13" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#333",
              "&:hover": { color: "#10AF13", transition: "color 0.3s" },
            }}
          >
            StudyMate
          </Typography>
        </Box>

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            padding: "10px 0",
            boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)",
            position: "fixed",
            bottom: 0,
            width: "100%",
            borderRadius: "10px 10px 0 0",
          }}
        >
          {routes.map((route, index) => (
            <IconButton key={index} href={route.href} sx={{ color: "#333" }}>
              {route.icon}
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
