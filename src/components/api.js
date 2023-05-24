import axios from "axios";

const api = axios.create({
  baseURL: "http://ec2-18-222-70-110.us-east-2.compute.amazonaws.com:8080",
});

export default api;