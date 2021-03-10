import { fetchWithToken } from "utils/fetch";

export const getBloomCategories = async () => {
    const resp = await fetchWithToken('bloom/category');
    if(!resp.ok){
        throw new Error(resp.message);
    }
    return resp.data;
};

export const getBloomVerbs = async ( category ) => {
    const resp = await fetchWithToken('bloom/verb', { category }, 'POST');
    if(!resp.ok){
        throw new Error(resp.message);
    }
    return resp.data;
};