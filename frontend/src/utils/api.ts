"use client";

import { getUserLocalStorage } from "@/context/AuthProvider/util";
import  Axios from "axios";

const headersDefault = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getUserLocalStorage()}`
};

const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const domain = hostname?.split('.')[0];

const apis = {
  "localhost": "https://portal-wepgcomp-api-development.vercel.app/",
  "portal-wepgcomp-client-development": "https://portal-wepgcomp-api-development.vercel.app/",
  "portal-wepgcomp-client": "https://portal-wepgcomp-api.vercel.app/",
};

export const axiosInstance = () => {
    return Axios.create({
      baseURL: apis[domain],
      headers: headersDefault,
      
    });
};