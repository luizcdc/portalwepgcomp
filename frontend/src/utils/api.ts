"use client";


import Axios from "axios";

const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const domain = hostname?.split(".")[0];

const apis = {
  localhost: "https://portal-wepgcomp-api-development.vercel.app/",
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

export default axiosInstance;
