import axios from 'axios';
// for production
    const url="https://mysocket-6xmu.onrender.com"  

// for local env
  //  const url="http://localhost:8080"


axios.defaults.withCredentials=true
// axios.defaults.withXSRFToken
const API = axios.create({
  baseURL: url, // 🌐 replace with your backend URL
  withCredentials: true, // ✅ Send cookies and allow CORS credentials
});

export default API;