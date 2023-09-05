import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/userSlice/userSlice";
const baseURL = process.env.REACT_APP_SERVER_URL as string;

interface ErrorData {
  message: string;
}

interface ResponseData {
  message: string;
  accessToken: string;
}

const axiosAuthorized: AxiosInstance = axios.create({
  baseURL: baseURL,
});

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
});

axiosAuthorized.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosAuthorized.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig<unknown> | undefined =
      error.config;
    if (
      error?.response?.status === 403 &&
      (error.response.data as ErrorData)?.message ===
        "Access forbidden, Invalid token"
    ) {
      return axiosInstance
        .post<ResponseData>("/refresh/token", null, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("refreshToken") as string
            }`,
          },
        })
        .then((response: AxiosResponse) => {
          const responseData = response.data as ResponseData;
          const accessToken = responseData?.accessToken;
          localStorage.setItem("accessToken", accessToken);
          if (originalRequest && originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          return axiosAuthorized(originalRequest!);
        })
        .catch((error) => {
          store.dispatch(logout());
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);

export { axiosAuthorized, axiosInstance };
