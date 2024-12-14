import { Presentation } from "@/models/presentation";
import { axiosInstance } from "@/utils/api";

const baseUrl = "/presentation";
const instance = axiosInstance();
  
export const presentationApi = {
    getPresentations: async (eventEditionId: string): Promise<Presentation[]> => {
        const { data } = await instance.get(`${baseUrl}`, {
            params: { eventEditionId },
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data;
    },

    postPresentationBookmark: async (body: OrientacaoParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}/bookmark`, body);

        return data;
    },
}