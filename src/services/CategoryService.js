import { fetchWithToken } from "../utils/fetch";

export const getCategories = async () => {
    const res = await fetchWithToken('category');
    const body = await res.json();
    if(!body.ok){
        throw new Error(body.message);
    }
    return body.data;
};