import { axiosInstance } from "@/utils/api";

const instance = axiosInstance();
const baseUrl = "/presentation"

export const presentationsApi = {
    postPresentationBookmark: async (body: any) =>{
        const { data } = await instance.post(`${baseUrl}/bookmark`, body);

        return data;
    }
}