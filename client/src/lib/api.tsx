import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
        if (!error.response) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh")) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");

                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, { refresh_token: refreshToken });
                const { access_token, refresh_token } = response.data;

                localStorage.setItem("access_token", access_token );
                localStorage.setItem("refresh_token", refresh_token);

                originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${access_token}` };
                return api(originalRequest);
            } catch {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);