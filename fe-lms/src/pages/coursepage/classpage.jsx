import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Tabs,
  Tab,
  Modal,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookIcon from "@mui/icons-material/Book";
import GroupIcon from "@mui/icons-material/Group";
import {
  getMaterials,
  createMaterial,
  deleteMaterial,
  getClassById,
  updateMaterial,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getMembers,
  deleteMember,
  getAssignmentsByUser,
} from "../../api/endpoint";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FileUploadButton from "../../components/FileUploadButton";

const ClassPage = () => {
  const { class_id } = useParams();
  const [value, setValue] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [classDetails, setClassDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalType, setModalType] = useState(""); // "add" or "edit"
  const [modalTarget, setModalTarget] = useState(""); // "materials", "assignments", or "members"
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetType, setDeleteTargetType] = useState(""); // "assignments" or "materials"
  const [materialId, setMaterialId] = useState(null);
  const [assignmentId, setAssignmentId] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [isNetworkPending, setIsNetworkPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState("");

  const fetchMaterials = useCallback(
    async (retryCount = 3) => {
      setIsNetworkPending(true); // Set state ke true saat mulai fetch
      try {
        const response = await getMaterials(class_id);
        const sortedMaterials = (response.data || []).sort((a, b) => {
          if (a.created_at === b.created_at) {
            return b.id - a.id;
          }
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setMaterials(sortedMaterials);
      } catch (error) {
        console.error("Failed to fetch materials", error);
        setMaterials([]);
        if (retryCount > 0) {
          setTimeout(() => fetchMaterials(retryCount - 1), 1000);
        } else {
          setErrorMessage(
            "Failed to fetch materials. Please check your internet connection."
          );
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoading(false);
        setIsNetworkPending(false); // Set state ke false saat fetch selesai
      }
    },
    [class_id]
  );

  const fetchClassDetails = useCallback(
    async (retryCount = 3) => {
      setIsNetworkPending(true); // Set state ke true saat mulai fetch
      try {
        const response = await getClassById(class_id);
        setClassDetails(response.data || {});
      } catch (error) {
        console.error("Failed to fetch class details", error);
        setClassDetails({});
        if (retryCount > 0) {
          setTimeout(() => fetchClassDetails(retryCount - 1), 1000);
        } else {
          setErrorMessage(
            "Failed to fetch class details. Please check your internet connection."
          );
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoading(false);
        setIsNetworkPending(false); // Set state ke false saat fetch selesai
      }
    },
    [class_id]
  );

  const fetchAssignmentsDetails = useCallback(
    async (retryCount = 3) => {
      setIsNetworkPending(true); // Set state ke true saat mulai fetch
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const userRole = decodedToken.role;

          if (userId) {
            let response;
            if (userRole === "Admin" || userRole === "Guru") {
              response = await getAssignments(class_id);
            } else {
              response = await getAssignmentsByUser(class_id, userId);
            }

            if (Array.isArray(response.data)) {
              setAssignments(response.data);
            } else {
              setAssignments([]);
            }
          } else {
            throw new Error("User ID is undefined");
          }
        } else {
          throw new Error("Token is not available");
        }
      } catch (error) {
        console.error("Failed to fetch assignments", error);
        setAssignments([]);
        if (retryCount > 0) {
          setTimeout(() => fetchAssignmentsDetails(retryCount - 1), 1000);
        } else {
          setErrorMessage(
            "Failed to fetch assignments. Please check your internet connection."
          );
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoading(false);
        setIsNetworkPending(false); // Set state ke false saat fetch selesai
      }
    },
    [class_id]
  );

  // ...existing code...

  useEffect(() => {
    fetchAssignmentsDetails();
  }, [fetchAssignmentsDetails]);

  const fetchMembers = useCallback(
    async (retryCount = 3) => {
      setIsNetworkPending(true); // Set state ke true saat mulai fetch
      try {
        console.log("Fetching members for class:", class_id);
        const response = await getMembers(class_id);
        console.log("Members data:", response.data); // Debugging
        if (Array.isArray(response.data.data)) {
          const uniqueMembers = filterUniqueMembers(response.data.data);
          setMembers(uniqueMembers);
        } else {
          console.error(
            "Expected members data to be an array, but got:",
            typeof response.data.data
          );
          setMembers([]);
        }
      } catch (error) {
        console.error("Failed to fetch members", error);
        setMembers([]);
        if (retryCount > 0) {
          setTimeout(() => fetchMembers(retryCount - 1), 1000);
        } else {
          setErrorMessage(
            "Failed to fetch members. Please check your internet connection."
          );
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoading(false);
        setIsNetworkPending(false); // Set state ke false saat fetch selesai
      }
    },
    [class_id]
  );

  const filterUniqueMembers = (members) => {
    const uniqueMembers = [];
    const memberMap = new Map();

    members.forEach((member) => {
      if (!memberMap.has(member.id)) {
        memberMap.set(member.id, true);
        uniqueMembers.push(member);
      }
    });

    return uniqueMembers;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }

    fetchMaterials();
    fetchClassDetails();
    fetchAssignmentsDetails();
    fetchMembers();
  }, [
    class_id,
    fetchMaterials,
    fetchClassDetails,
    fetchAssignmentsDetails,
    fetchMembers,
  ]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenModal = (type, target, data = {}) => {
    setModalType(type);
    setModalTarget(target);
    setModalData(data);
    if (target === "materials") {
      setMaterialId(data.id || null);
    } else if (target === "assignments") {
      setAssignmentId(data.id || null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({});
  };
  const getFileType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "xlsx":
      case "xls":
        return "Excel";
      case "png":
      case "jpg":
      case "jpeg":
        return "Image";
      default:
        return "File";
    }
  };
  const handleSave = async () => {
    try {
      if (modalTarget === "materials") {
        const formData = new FormData();
        formData.append("title", modalData.title);
        formData.append("content", modalData.content);
        if (attachment) {
          formData.append("attachment", attachment);
        }

        if (modalType === "add") {
          await createMaterial(class_id, formData);
          fetchMaterials();
          handleOpenSuccessModal("Materi berhasil ditambahkan!");
        } else if (modalType === "edit") {
          await updateMaterial(class_id, materialId, formData);
          fetchMaterials();
          handleOpenSuccessModal("Materi berhasil diperbarui!");
        }
      } else if (modalTarget === "assignments") {
        const formData = new FormData();
        formData.append("title", modalData.title);
        formData.append("description", modalData.description);
        formData.append("due_date", modalData.due_date);
        if (attachment) {
          formData.append("attachment", attachment);
        }

        if (modalType === "add") {
          await createAssignment(class_id, formData);
          fetchAssignmentsDetails(); // Refresh assignment list
          handleOpenSuccessModal("Tugas berhasil ditambahkan!");
        } else if (modalType === "edit") {
          await updateAssignment(class_id, assignmentId, formData);
          fetchAssignmentsDetails(); // Refresh assignment list
          handleOpenSuccessModal("Tugas berhasil diperbarui!");
        }
      }
    } catch (error) {
      console.error(`Failed to ${modalType} ${modalTarget}`, error);
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (target, id) => {
    if (target === "materials") {
      try {
        await deleteMaterial(id);
        fetchMaterials();
      } catch (error) {
        console.error("Failed to delete material", error);
      }
    } else if (target === "assignments") {
      try {
        await deleteAssignment(id);
        fetchAssignmentsDetails();
      } catch (error) {
        console.error("Failed to delete assignment", error);
      }
    } else if (target === "members") {
      try {
        await deleteMember(class_id, id);
        fetchMembers();
      } catch (error) {
        console.error("Failed to delete member", error);
      }
    }
  };
  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    window.location.reload();
  };
  const handleOpenDeleteModal = (type, id) => {
    console.log(`Opening delete modal for ${type} with ID: ${id}`);
    setDeleteTargetId(id);
    setDeleteTargetType(type);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetType("");
  };

  const handleConfirmDelete = async () => {
    try {
      console.log(`Deleting ${deleteTargetType} with ID: ${deleteTargetId}`);
      if (deleteTargetType === "assignments") {
        await deleteAssignment(deleteTargetId);
        fetchAssignmentsDetails();
      } else if (deleteTargetType === "materials") {
        await deleteMaterial(deleteTargetId);
        fetchMaterials();
      } else if (deleteTargetType === "members") {
        console.log(`Class ID: ${class_id}, Member ID: ${deleteTargetId}`);
        await deleteMember(class_id, deleteTargetId);
        fetchMembers();
      }
    } catch (error) {
      console.error(`Failed to delete ${deleteTargetType}`, error);
    } finally {
      handleCloseDeleteModal();
    }
  };
  const handleOpenSuccessModal = (message) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box
        sx={{ padding: "30px", marginLeft: { xs: 0, md: "120px" }, flex: 1 }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#333", marginBottom: "30px" }}
        >
          Kelas: {classDetails.name || "Loading..."}
        </Typography>

        {/* Sub Navbar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#fff", // Ganti warna background menjadi hijau
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <Toolbar sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="class tabs"
              sx={{
                width: "100%",
                color: "#10AF13", // Ganti warna teks tab menjadi hijau
                "& .MuiTab-root": {
                  "&:hover": {
                    color: "#10AF13", // Ganti warna teks saat hover menjadi hijau
                  },
                },
                "& .Mui-selected": {
                  color: "#10AF13", // Ganti warna teks saat tab dipilih menjadi hijau
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#10AF13", // Ganti warna indikator tab menjadi hijau
                },
              }}
            >
              <Tab label="Materi" icon={<BookIcon />} iconPosition="start" />
              <Tab
                label="Tugas"
                icon={<AssignmentIcon />}
                iconPosition="start"
              />
              <Tab
                label="Anggota Kelas"
                icon={<GroupIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Toolbar>
        </AppBar>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Materi */}
            {value === 0 && (
              <Box sx={{ paddingTop: "20px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  Materi Pembelajaran
                </Typography>
                {userRole !== "Siswa" && (
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    sx={{
                      backgroundColor: "#10AF13",
                      "&:hover": { backgroundColor: "#0e8e11" },
                    }}
                    onClick={() => handleOpenModal("add", "materials")}
                  >
                    Tambah Materi
                  </Button>
                )}
                {materials.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: "20px",
                      color: "#757575",
                      textAlign: "center",
                    }}
                  >
                    Tidak ada materi yang tersedia.
                  </Typography>
                ) : (
                  <Grid container spacing={3} sx={{ marginTop: "20px" }}>
                    {materials.map((material) => (
                      <Grid item xs={12} sm={6} md={4} key={material.id}>
                        <Card
                          sx={{
                            boxShadow: 3,
                            padding: "20px",
                            borderRadius: "15px",
                            backgroundColor: "#fff",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#333" }}
                            >
                              {material.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ marginTop: "10px", color: "#555" }}
                            >
                              {material.content}
                            </Typography>
                            {material.attachment.Valid && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  border: "1px solid #ddd",
                                  borderRadius: "10px",
                                  padding: "10px",
                                  marginTop: "20px",
                                }}
                              >
                                <a
                                  href={material.attachment.String}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: "none",
                                    color: "#10AF13",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={material.attachment.String}
                                    alt="Attachment Preview"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "5px",
                                      objectFit: "cover",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      Lampiran Materi {material.title}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "#999" }}
                                    >
                                      {getFileType(material.attachment.String)}
                                    </Typography>
                                  </Box>
                                </a>
                              </Box>
                            )}
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                marginTop: "10px",
                                display: "block",
                                color: "#999",
                              }}
                            >
                              Dibuat pada:{" "}
                              {new Date(material.created_at).toLocaleString()}
                            </Typography>
                            {userRole !== "Siswa" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  marginTop: "10px",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    handleOpenModal(
                                      "edit",
                                      "materials",
                                      material
                                    )
                                  }
                                  sx={{ color: "#10AF13" }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleOpenDeleteModal(
                                      "materials",
                                      material.id
                                    )
                                  }
                                  sx={{ color: "#f44336" }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Tugas */}
            {value === 1 && (
              <Box sx={{ paddingTop: "20px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  Tugas
                </Typography>

                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  sx={{
                    backgroundColor: "#10AF13",
                    "&:hover": { backgroundColor: "#0e8e11" },
                  }}
                  onClick={() => handleOpenModal("add", "assignments")}
                >
                  Tambahkan Tugasmu!
                </Button>

                {assignments.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: "20px",
                      color: "#757575",
                      textAlign: "center",
                    }}
                  >
                    Tidak ada tugas yang tersedia.
                  </Typography>
                ) : (
                  <Grid container spacing={3} sx={{ marginTop: "20px" }}>
                    {assignments.map((assignment) => (
                      <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                        <Card
                          sx={{
                            boxShadow: 3,
                            padding: "20px",
                            borderRadius: "15px",
                            backgroundColor: "#fff",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#333" }}
                            >
                              {assignment.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ marginTop: "10px", color: "#555" }}
                            >
                              {assignment.description}
                            </Typography>
                            {assignment.attachment.Valid &&
                              assignment.attachment.String && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    marginTop: "20px",
                                  }}
                                >
                                  <a
                                    href={assignment.attachment.String}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      textDecoration: "none",
                                      color: "#10AF13",
                                      fontWeight: "bold",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={assignment.attachment.String}
                                      alt="Attachment Preview"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "5px",
                                        objectFit: "cover",
                                        marginRight: "10px",
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        Attachment - {assignment.title}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#999" }}
                                      >
                                        {getFileType(
                                          assignment.attachment.String
                                        )}
                                      </Typography>
                                    </Box>
                                  </a>
                                </Box>
                              )}
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                marginTop: "10px",
                                display: "block",
                                color: "#999",
                              }}
                            >
                              Dibuat pada:{" "}
                              {new Date(assignment.created_at).toLocaleString()}
                            </Typography>
                            {userRole !== "Siswa" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  marginTop: "10px",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    handleOpenModal(
                                      "edit",
                                      "assignments",
                                      assignment
                                    )
                                  }
                                  sx={{ color: "#10AF13" }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleOpenDeleteModal(
                                      "assignments",
                                      assignment.id
                                    )
                                  }
                                  sx={{ color: "#f44336" }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Anggota Kelas */}
            {value === 2 && (
              <Box sx={{ paddingTop: "20px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "20px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  Anggota Kelas
                </Typography>

                {members.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: "20px",
                      color: "#757575",
                      textAlign: "center",
                    }}
                  >
                    Tidak ada anggota yang tersedia.
                  </Typography>
                ) : (
                  <Box sx={{ marginTop: "20px" }}>
                    {console.log("Rendering members:", members)}
                    {Array.isArray(members) &&
                      members.map((member, index) => (
                        <Box
                          key={index}
                          sx={{
                            padding: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <Typography>
                            {member.username} - {member.role}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleOpenDeleteModal("members", member.id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            width: "400px",
            margin: "auto",
            marginTop: "100px",
            padding: "20px",
            backgroundColor: "#fff",
            boxShadow: 24,
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "20px", fontWeight: "bold" }}
          >
            {modalType === "add" ? "Tambah" : "Edit"}{" "}
            {modalTarget === "materials"
              ? "Materi"
              : modalTarget === "assignments"
              ? "Tugas"
              : "Anggota"}
          </Typography>
          {(modalTarget === "materials" || modalTarget === "assignments") && (
            <>
              <TextField
                label="Judul"
                fullWidth
                variant="outlined"
                value={modalData.title || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, title: e.target.value })
                }
                style={{ marginBottom: "10px" }}
              />
            </>
          )}
          {modalTarget === "materials" && (
            <>
              <TextField
                label="Deskripsi"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={modalData.content || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, content: e.target.value })
                }
                sx={{ marginBottom: "10px" }}
              />
              <FileUploadButton onFileChange={setAttachment} />
            </>
          )}

          {modalTarget === "assignments" && (
            <>
              <TextField
                label="Deskripsi"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={modalData.description || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                sx={{ marginBottom: "10px" }}
              />

              <FileUploadButton onFileChange={setAttachment} />
            </>
          )}
          {modalTarget === "members" && (
            <TextField
              label="Nama"
              fullWidth
              variant="outlined"
              value={modalData.name || ""}
              onChange={(e) =>
                setModalData({ ...modalData, name: e.target.value })
              }
              sx={{ marginBottom: "10px" }}
            />
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#10AF13",
                "&:hover": { backgroundColor: "#0e8e11" },
              }}
              onClick={handleSave}
            >
              Simpan
            </Button>
            <Button
              variant="outlined"
              sx={{ marginLeft: "10px" }}
              onClick={handleCloseModal}
            >
              Batal
            </Button>
            <div></div>
          </Box>
        </Box>
      </Modal>

      {/* Modal Error */}
      <Dialog open={isErrorModalOpen} onClose={handleCloseErrorModal}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>
            Terjadi kesalahan pada server. Halaman akan di-refresh.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorModal} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* modal hapus */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
        >
          Konfirmasi Hapus
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "18px", color: "#555" }}>
            Apakah Anda yakin ingin menghapus{" "}
            {deleteTargetType === "assignments"
              ? "tugas"
              : deleteTargetType === "materials"
              ? "materi"
              : deleteTargetType === "members"
              ? "anggota"
              : ""}{" "}
            ini?
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#f44336",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            Warning: This action cannot be undone!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", marginTop: "20px" }}>
          <Button
            onClick={handleCloseDeleteModal}
            variant="outlined"
            sx={{
              color: "#757575",
              borderColor: "#757575",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              color: "#FFF",
              marginLeft: "10px",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
      {/* modal sukses */}
      <Dialog
        open={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
        >
          Sukses
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "18px", color: "#555" }}>
            {successMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", marginTop: "20px" }}>
          <Button
            onClick={handleCloseSuccessModal}
            variant="contained"
            sx={{
              backgroundColor: "#10AF13",
              color: "#FFF",
              "&:hover": { backgroundColor: "#0e8e11" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassPage;
