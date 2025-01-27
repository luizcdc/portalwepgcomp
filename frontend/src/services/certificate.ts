import { useSweetAlert } from '@/hooks/useAlert';
import axiosInstance from '@/utils/api';

const baseUrl = "/certificate";

export const certificate = async (eventId: string): Promise<boolean> => {
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

        return true;


    } catch (error: any) {
        if(error.status === 404){
           await showAlert({
            icon: "error",
            title: "Erro ao baixar certificado",
            text: "Doutorando não tem submissões, portanto não pode receber certificado",
            confirmButtonText: "Retornar",
        }); 
        }
        else{
        await showAlert({
            icon: "error",
            title: "Erro ao baixar certificado",
            text: error.response?.data?.message,
            confirmButtonText: "Retornar",
        });
        }
     

        return false; 
    }
};