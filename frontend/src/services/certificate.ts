import { useSweetAlert } from '@/hooks/useAlert';
import axiosInstance from '@/utils/api';

const baseUrl = "/";

export const certificate = async (id: string): Promise<any> => {
    const { showAlert } = useSweetAlert();
    const instance = axiosInstance;
    try {
        const response = await instance.get(`${baseUrl}/download/${id}`, {
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
    } catch (error) {
        showAlert({
            icon: "error",
            text: "Error ao emitir certificado",
            confirmButtonText: "Retornar",
        });
    }
};