"use client";

import Axios from "axios";

const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const domain = hostname?.split(".")[0];

const apis = {
  localhost: "http://localhost:3001/",
  "portal-wepgcomp-client-development":
    "https://portal-wepgcomp-api-development.vercel.app/",
  "portal-wepgcomp-client": "https://portal-wepgcomp-api.vercel.app/",
};

const axiosInstance = Axios.create({
  baseURL: apis[domain],
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("@Auth:token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Reject promise if usual error
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    /*
     * When response code is 401, try to refresh the token.
     * Eject the interceptor so it doesn't loop in case
     * token refresh causes the 401 response.
     *
     * Must be re-attached later on or the token refresh will only happen once
     */
   
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
    return Promise.reject(error); // Re-attach the interceptor by running the method
  }
);


export default axiosInstance;
