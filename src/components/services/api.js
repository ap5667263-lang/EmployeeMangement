import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true,
});

// Request interceptor — JWT token inject karo
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — 401 pe auto refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post(
                    "http://localhost:4000/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );
                const { accessToken } = refreshResponse.data;
                localStorage.setItem("accessToken", accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
