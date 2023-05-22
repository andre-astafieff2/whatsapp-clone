import axios from "axios";

const api = axios.create({
  baseURL: "https://ws-bot-o7sd.onrender.com",
});

export default api;