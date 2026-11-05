import axios from "axios";

export const BASE_URL = "http://localhost:5000";
const api = axios.create({ baseURL: `${BASE_URL}/api/tasks` });

export const getTasks = () => api.get("/");
export const getTask = (id) => api.get(`/${id}`);
export const addTask = (formData) => api.post("/", formData);
export const updateTask = (id, formData) => api.put(`/${id}`, formData);
export const deleteTask = (id) => api.delete(`/${id}`);
