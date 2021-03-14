import { fetchWithToken } from "utils/fetch";

export const getCategories = async () => {
    const resp = await fetchWithToken('category');
    if(!resp.ok){
        throw new Error(resp.message);
    }
    return resp.data;
};