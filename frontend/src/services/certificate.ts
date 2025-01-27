import axiosInstance from '@/utils/api';


const baseUrl = "/certificate";
export const useCertificate = () => {

    const downloadCertificate = async (eventId: string): Promise<number> => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/event-edition/${eventId}`, {
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

            return 200; 
        } catch (error: any) {       
        console.log(error)

            return error.status; 
        }
    };

    return { downloadCertificate };
};
