import axios from "axios";

const api = axios.create({
  baseURL: "http://ec2-3-136-22-22.us-east-2.compute.amazonaws.com:5000",
});

export default api;