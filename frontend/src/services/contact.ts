
import axiosInstance from '@/utils/api';

interface ContactRequest {
    name: string;
    email: string;
    text: string;
}

const baseUrl = "/mailing";

export const sendContactRequest = async (data: ContactRequest): Promise<any> => {
    const instance = axiosInstance;

    return instance.post(`${baseUrl}/contact`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then((resp) => {
        return resp;
    }).catch(err => {
        return err;
    }) 
};