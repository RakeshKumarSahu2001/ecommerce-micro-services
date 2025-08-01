import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 30000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("originam req",originalRequest)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.config.url !== "/customer/v1/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        console.log("##########")
        await axiosInstance.post("customer/v1/refresh-token");
        console.log("*************")
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh failed", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
