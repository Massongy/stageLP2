import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stagelp2.onrender.com/api', // ou juste '/' selon tes routes backend
});

export default api;
