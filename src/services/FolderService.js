import { fetchWithToken } from "utils/fetch";


export const getfolderByPath = async ( path ) => {
    const resp = await fetchWithToken('folder/user', {
        path,
    }, 'POST');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};

export const createFolder = async ({ path, folderName }) => {
    const resp = await fetchWithToken('folder/create', {
        path,
        folderName,
    }, 'POST');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};