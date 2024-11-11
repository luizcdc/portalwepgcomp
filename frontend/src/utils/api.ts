import  Axios from "axios";

require('dotenv').config();


const headersDefault = {
    'Content-Type': 'application/json',
};

const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const domain = hostname?.split('.')[0];

const apis = {
  "localhost": "http://localhost:3000",
  "portal-wepgcomp-client-development": "https://portal-wepgcomp-api-development.vercel.app/",
  "portal-wepgcomp-client": "https://portal-wepgcomp-api.vercel.app/",
};

export const axiosInstance = () => {
    return Axios.create({
      baseURL: apis[domain],
      headers: headersDefault,
    });
};