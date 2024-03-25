import axios from 'axios';

const clientAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`
});

export default clientAxios;