import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend de Laravel
  withCredentials: true, // Asegura que las cookies se envíen con las peticiones
});
api.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
export default api;