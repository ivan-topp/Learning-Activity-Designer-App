import { fetchWithToken } from "utils/fetch";


export const getRecentDesigns = async () => {
    const resp = await fetchWithToken('design/recent');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};

export const getDesignsByFolder = async ( path, pageParam ) => {
    const resp = await fetchWithToken('design/user', {
        path,
        from: pageParam,
    }, 'POST');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};

export const getPublicDesignsByUser = async ( id, pageParam ) => {
    const resp = await fetchWithToken(`design/public/user/`, {
        id,
        from: pageParam,
    }, 'POST');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};

export const createDesign = async (path) => {
    const resp = await fetchWithToken(`design`, { path }, 'POST');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};

export const deleteDesignById = async ({ id }) => {
    const resp = await fetchWithToken(`design/${ id }`, {}, 'DELETE');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};


