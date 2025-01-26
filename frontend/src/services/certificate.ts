import { useSweetAlert } from '@/hooks/useAlert';
import axiosInstance from '@/utils/api';

const baseUrl = "/certificate";

export const certificate = async (eventId: string): Promise<any> => {
    const { showAlert } = useSweetAlert();
    const instance = axiosInstance;
    try {
        const response = await instance.get(`${baseUrl}/event-edition/${eventId}`, {
            responseType: "blob",
            headers: {
                "Content-Type": "application/pdf",
            },
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificate-${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao emitir certificado";

        showAlert({
            icon: "error",
            text: errorMessage,
            confirmButtonText: "Retornar",
        });
    }
};