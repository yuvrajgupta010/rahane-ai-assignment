import axios from "axios";
import restfulUrls from "./restfulUrls.js";

const StatusCode = {
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  TooManyRequests: 429,
  InternalServerError: 500,
};

const headers = {
  "Content-Type": "application/json; charset=utf-8",
};

class Interceptor {
  instance = null;

  get axiosInstance() {
    return this.instance != null ? this.instance : this.initInterceptor();
  }

  initInterceptor() {
    const createInstance = axios.create({
      baseURL: restfulUrls.BASE_URL,
      headers,
      withCredentials: true,
    });

    // Request Interceptor
    createInstance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    createInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        return this.handleError(response);
      }
    );

    this.instance = createInstance;
    return createInstance;
  }

  request(config) {
    return this.axiosInstance.request(config);
  }

  get(url, config) {
    return this.axiosInstance.get(url, config);
  }

  post(url, data, config) {
    return this.axiosInstance.post(url, data, config);
  }

  put(url, data, config) {
    return this.axiosInstance.put(url, data, config);
  }

  patch(url, data, config) {
    return this.axiosInstance.patch(url, data, config);
  }

  putFormData(url, formData, config) {
    // Use FormData and set "multipart/form-data" headers
    const formDataConfig = {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    };
    return this.axiosInstance.put(url, formData, formDataConfig);
  }

  delete(url, config) {
    return this.axiosInstance.delete(url, config);
  }

  handleLogout() {
    // Optional cleanup on refresh token failure
    window.localStorage.clear(); // Only if you store non-auth data
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  async handleError(error) {
    const status = error?.status;

    switch (status) {
      case StatusCode.InternalServerError: {
        break;
      }
      case StatusCode.Forbidden: {
        break;
      }
      case StatusCode.Unauthorized: {
        console.log("Unauthorized error:", error);
        this.handleLogout(); // This will redirect user
        break;
      }
      case StatusCode.NotFound: {
        break;
      }
      case StatusCode.TooManyRequests: {
        break;
      }
    }

    return Promise.reject(error);
  }
}

export const apiInterceptor = new Interceptor();
