"use client";

import Axios from "axios";

const token = typeof window !== "undefined" ? localStorage.getItem("@Auth:token") : null;


const headersDefault = token
  ? {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  : {
      "Content-Type": "application/json",
    };

const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const domain = hostname?.split(".")[0];

const apis = {
    localhost: "https://portal-wepgcomp-api-development.vercel.app/",
"portal-wepgcomp-client-development":
    "https://portal-wepgcomp-api-development.vercel.app/",
  "portal-wepgcomp-client": "https://portal-wepgcomp-api.vercel.app/",
};

export const axiosInstance = () => {
  return Axios.create({
    baseURL: apis[domain],
    headers: headersDefault,
  });
};
