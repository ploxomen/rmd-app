import Axios from 'axios';
import Router from 'next/router';
const apiAxios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
    headers:{
        'Content-Type' : 'application/json',
        'Accept':'application/json'
    }
})
apiAxios.interceptors.response.use(
    response => response,
    error => {
        if(error.response && error.response.status === 401){
            Router.push('/login');
        }
        return Promise.reject(error);
    }
)
export default apiAxios;