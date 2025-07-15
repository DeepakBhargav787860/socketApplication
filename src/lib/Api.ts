import axios from 'axios';
// for production



//    const url="https://mysocket-6xmu.onrender.com"  

// export function CreateWebSocketConnection(endpoint) {
//   const base = "wss://mysocket-6xmu.onrender.com";
//   const fullURL = `${base}${endpoint}`;
//   return new WebSocket(fullURL);
// }




//for local env

 const url="http://localhost:8080"
 export function CreateWebSocketConnection(endpoint) {
  const base = "ws://localhost:8080";
  const fullURL = `${base}${endpoint}`;
  return new WebSocket(fullURL);
}








//cloud info
//cloud email deepak.bhargav787860@gmail.com
 //uploadPreset := "deepak_audio"
// cloudname-dvn5f0ho7
// apikey-552691569815268
// apisecret-HpqUVajwjxeRkLsrEbym3mMsQVI
// api env variable-CLOUDINARY_URL=cloudinary://552691569815268:****@dvn5f0ho7


axios.defaults.withCredentials=true
// axios.defaults.withXSRFToken
const API = axios.create({
  baseURL: url, // 🌐 replace with your backend URL
  withCredentials: true, // ✅ Send cookies and allow CORS credentials
});

export default API;