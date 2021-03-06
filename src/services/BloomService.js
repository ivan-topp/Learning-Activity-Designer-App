import { fetchWithToken } from "../utils/fetch";

export const getBloomCategories = async () => {
    const res = await fetchWithToken('bloom/category');
    const body = await res.json();
    if(!body.ok){
        throw new Error(body.message);
    }
    return body.data;
};

export const getBloomVerbs = async ( category ) => {
    const res = await fetchWithToken('bloom/verb', { category }, 'POST');
    const body = await res.json();
    if(!body.ok){
        throw new Error(body.message);
    }
    return body.data;
};