import { useEffect, useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  getForums,
  createForum,
  deleteForum,
  getComments,
  createComment,
  deleteComment,
} from "../api/endpoint";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { jwtDecode } from "jwt-decode";

const Forum = () => {
  const [forums, setForums] = useState([]);
  const [newForumTitle, setNewForumTitle] = useState("");
  const [newForumContent, setNewForumContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [forumToDelete, setForumToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [authorRole, setAuthorRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.username);
      setAuthorRole(decodedToken.role);
    }
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await getForums();
      const forumsData = response.data.data || [];
      const forumsWithComments = await Promise.all(
        forumsData.map(async (forum) => {
          const commentsResponse = await getComments(forum.id);
          return { ...forum, comments: commentsResponse.data };
        })
      );
      setForums(forumsWithComments);
    } catch (error) {
      console.error("Failed to fetch forums", error);
      setForums([]); // Set forums to an empty array on error
    }
  };

  const handleCreateForum = async () => {
    if (!newForumTitle || !newForumContent) {
      setErrorMessage("Harap isi kedua kolom Title dan Content.");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await createForum({
        title: newForumTitle,
        content: newForumContent,
        author: loggedInUserId,
        author_role: authorRole,
      });
      fetchForums();
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 2000); // Close modal after 2 seconds
    } catch (error) {
      console.error("Failed to create forum", error);
    }
  };

  const handleOpenDeleteModal = (id) => {
    setForumToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setForumToDelete(null);
  };

  const handleConfirmDeleteForum = async () => {
    try {
      await deleteForum(forumToDelete);
      fetchForums();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete forum", error);
    }
  };

  const handleCreateComment = async (forumId) => {
    try {
      await createComment(forumId, {
        content: newCommentContent[forumId],
        author: loggedInUserId,
      });
      setNewCommentContent((prev) => ({ ...prev, [forumId]: "" }));
      fetchForums();
    } catch (error) {
      console.error("Failed to create comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchForums();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const handleCommentChange = (forumId, content) => {
    setNewCommentContent((prev) => ({ ...prev, [forumId]: content }));
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8F8F8" }}
    >
      <Box
        sx={{
          flex: 1,
          padding: { xs: "20px", md: "40px" },
          marginLeft: { md: "100px" },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#333",
          }}
        >
          Forum Diskusi
        </Typography>
        <Card
          sx={{
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#FFFFFF",
            border: `2px solid #10AF13`,
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            value={newForumTitle}
            onChange={(e) => setNewForumTitle(e.target.value)}
            sx={{ borderRadius: "5px" }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Tulis konten forum Anda..."
            value={newForumContent}
            onChange={(e) => setNewForumContent(e.target.value)}
            sx={{
              marginBottom: "10px",
              "& .MuiInputBase-root": {
                borderColor: "#10AF13",
                borderRadius: "5px",
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#10AF13",
              borderRadius: "5px",
            }}
            onClick={handleCreateForum}
          >
            Kirim
          </Button>
        </Card>
        <Box>
          {forums.length > 0 ? (
            forums.map((forum, index) => (
              <Card
                key={index}
                sx={{
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: "#FFFFFF",
                  border: `2px solid #10AF13`,
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {forum.title}
                  </Typography>
                  {forum.author === loggedInUserId && (
                    <IconButton onClick={() => handleOpenDeleteModal(forum.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {forum.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                    fontSize: "0.8rem",
                    color: "#757575",
                  }}
                >
                  <Avatar
                    src={forum.author_avatar} // tambahkan properti avatar dari API
                    alt={forum.author}
                    sx={{ width: 24, height: 24, marginRight: "8px" }}
                  />
                  <Box sx={{ display: "inline" }}>
                    Created by{" "}
                    <span style={{ fontWeight: "bold", color: "#333" }}>
                      {forum.author}
                    </span>
                    {" - "}
                    <span style={{ color: "#10AF13", fontWeight: "500" }}>
                      {forum.author_role}
                    </span>{" "}
                    on {new Date(forum.created_at).toLocaleString()}
                  </Box>
                </Typography>

                <Box sx={{ marginTop: "10px" }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Tulis komentar Anda..."
                    value={newCommentContent[forum.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(forum.id, e.target.value)
                    }
                    sx={{
                      marginBottom: "10px",
                      "& .MuiInputBase-root": {
                        borderColor: "#10AF13",
                        borderRadius: "5px",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#10AF13",
                      borderRadius: "5px",
                      "&:hover": { backgroundColor: "#0e8e11" },
                    }}
                    onClick={() => handleCreateComment(forum.id)}
                  >
                    Kirim Komentar
                  </Button>
                </Box>
                <Box sx={{ marginTop: "10px" }}>
                  {forum.comments &&
                    forum.comments.map((comment, index) => (
                      <Card
                        key={index}
                        sx={{
                          padding: "10px",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#FFFFFF",
                          border: `1px solid #10AF13`,
                          borderRadius: "10px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Avatar
                          src={comment.avatar}
                          sx={{ marginRight: "10px" }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", color: "#333" }}
                          >
                            {comment.author}
                            {" - "}
                            <span
                              style={{ color: "#10AF13", fontWeight: "500" }}
                            >
                              {comment.author_role}
                            </span>
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#757575" }}>
                            {comment.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#757575",
                              display: "block",
                              marginTop: "5px",
                            }}
                          >
                            Created at:{" "}
                            {new Date(comment.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        {comment.author === loggedInUserId && (
                          <IconButton
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Card>
                    ))}
                </Box>
              </Card>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{ color: "#757575", textAlign: "center" }}
            >
              Tidak ada forum yang tersedia.
            </Typography>
          )}
        </Box>
      </Box>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: "#10AF13" }} />
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            Forum Created
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Your forum has been created successfully.
          </Typography>
        </Box>
      </Modal>
      <Modal open={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <ErrorIcon sx={{ fontSize: 50, color: "#f44336" }} />
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            Error
          </Typography>
          <Typography sx={{ mt: 2 }}>{errorMessage}</Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
            onClick={() => setIsErrorModalOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
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
            Konfirmasi Hapus
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ color: "#757575" }}>
            Anda yakin ingin menghapus forum ini? Semua data yang terkait dalam
            forum ini akan dihapus.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", marginBottom: "20px" }}>
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
            onClick={handleConfirmDeleteForum}
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              color: "#FFF",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Forum;
