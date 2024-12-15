import api from "./api";

// Forum APIs
export const getForums = () => api.get("/forums");
export const createForum = (data) => api.post("/forums", data);
export const deleteForum = (id) => api.delete(`/forums/${id}`);

// Comment APIs
export const getComments = (forumId) => api.get(`/forums/${forumId}/comments`);
export const createComment = (forumId, data) =>
  api.post(`/forums/${forumId}/comments`, data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);

// Auth APIs
export const login = (data) => api.post("/login", data);
export const register = (data) => api.post("/register", data);

// JWT Testing API
export const getTokenClaims = () => api.get("/get-token-claims");

// API count user dengan role
export const countUser = () => api.get("/roles/count");

// API kelas
export const getClasses = () => api.get("/classes");
export const createClass = (data) => api.post("/class", data);
export const deleteClass = (id) => api.delete(`/class/${id}`);
export const getClassById = (id) => api.get(`/class/${id}`);
export const updateClass = (id, data) => api.put(`/class/${id}`, data);
export const getClassesByStudentId = (id) => api.get(`/classes/student/${id}`);

// API dalem kelas
// materi
export const getMaterials = (class_id) => api.get(`/materials/${class_id}`);
export const createMaterial = (class_id, formData) => {
  return api.post(`/material/${class_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteMaterial = (id) => api.delete(`/material/${id}`);
export const getMaterialById = (class_id, id) =>
  api.get(`/${class_id}/material/${id}`);
export const updateMaterial = (class_id, id, data) =>
  api.put(`/${class_id}/material/${id}`, data);

// tugas
export const getAssignments = (class_id) => api.get(`/assignments/${class_id}`);
export const getAssignmentsByUser = (class_id, created_by) =>
  api.get(`/assignments/${class_id}/${created_by}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
export const createAssignment = (class_id, formData) =>
  api.post(`/assignment/${class_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteAssignment = (id) => api.delete(`/assignment/${id}`);
export const updateAssignment = (class_id, id, data) =>
  api.put(`/${class_id}/assignment/${id}`, data);
export const handleFileUpload = (e, assignmentId) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignment_id", assignmentId);

    // Ganti URL dengan endpoint yang sesuai untuk mengunggah file tugas
    api
      .post(`http://localhost:8080/upload-assignment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        // Lakukan sesuatu setelah file berhasil diunggah, misalnya menampilkan notifikasi
      })
      .catch((error) => {
        console.error("Failed to upload file:", error);
        // Tangani error, misalnya menampilkan notifikasi error
      });
  }
};

// anggota kelas
export const getMembers = (class_id) => api.get(`/class/${class_id}/members`);
export const joinClass = (class_id, data) =>
  api.post(`/class/${class_id}/join`, data);
export const deleteMember = (class_id, member_id) =>
  api.delete(`/class/${class_id}/members`, { data: { user_id: member_id } });

// count dan kawan kawan
export const countClassByUserID = (id) => api.get(`/classes/count/${id}`);
export const countAssignmentByClassID = (id) =>
  api.get(`/assignments/count/${id}`);

// nilai rapot
export const getReports = (user_id) => api.get(`/rapot/${user_id}`);
export const inputNilai = (data) => api.post("/grades", data);
