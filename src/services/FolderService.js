import { fetchWithToken } from "../utils/fetch";


export const getfolderByPath = async ( path ) => {
    const resp = await fetchWithToken('folder/user', {
        path,
    }, 'POST');
    const body = await resp.json();
    if (!body.ok) {
        throw new Error(body.message);
    }
    return body.data;
};