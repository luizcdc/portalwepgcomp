import axiosInstance from '@/utils/api';

interface ContactRequest {
    name: string;
    email: string;
    text: string;
}

const baseUrl = "/mailing";

export const sendContactRequest = async (data: ContactRequest): Promise<void> => {
    const instance = axiosInstance;

    try {
        const response = await instance.post(`${baseUrl}/contact`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Erro ao enviar os dados!");
        }
    } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        throw new Error("Erro ao enviar o formulário. Tente novamente.");
    }
};