import axios from "axios";

const axiosInstance=axios.create({
    baseURL:"http://localhost:8080",
    timeout:30000
})

export default axiosInstance;