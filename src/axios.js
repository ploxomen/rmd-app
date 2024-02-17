import Axios from 'axios';
const apiAxios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
    headers:{
        'Content-Type' : 'application/json',
        'Accept':'application/json'
    }
})
export default apiAxios;