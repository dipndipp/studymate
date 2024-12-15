import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import PortalClass from "./pages/classportal";
import Achievements from "./pages/achievements";
import Forum from "./pages/forum";
import ClassPage from "./pages/coursepage/classpage";
import Report from "./pages/report/report";
import Login from "./pages/auth/login";
import ExpiredTokenModal from "./utils/ExpiredTokenModal";
import { isAuthenticated } from "./utils/authMiddleware";
import OfflineAlert from "./utils/OfflineAlert";
import ErrorBoundaries from "./utils/ErrorBoundaries";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/settingsPage";

import "./App.css";
import "./index.css";

const App = () => {
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      if (!isAuthenticated()) {
        setIsTokenExpired(true);
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <ErrorBoundaries>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<PortalClass />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/class/:class_id" element={<ClassPage />} />
          <Route path="/report/:subjectId" element={<Report />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ExpiredTokenModal
          open={isTokenExpired}
          onClose={() => setIsTokenExpired(false)}
        />
        <OfflineAlert />
      </ErrorBoundaries>
    </Router>
  );
};

export default App;
