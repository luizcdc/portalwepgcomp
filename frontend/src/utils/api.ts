import  Axios from "axios";

const headersDefault = {
    'Content-Type': 'application/json',
  };

export const axiosInstance = () => {
    return Axios.create({
      baseURL: 'http://localhost:3000',
      headers: headersDefault,
    });
};