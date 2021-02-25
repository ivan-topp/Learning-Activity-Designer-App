import { fetchWithToken } from "../utils/fetch";


export const getRecentDesigns = async () => {
    const resp = await fetchWithToken('design/recent');
    const body = await resp.json();
    if (!body.ok) {
        throw new Error(body.message);
    }
    return body.data;
};

export const getDesignsByFolder = async ( path, pageParam ) => {
    const resp = await fetchWithToken('design/user', {
        path,
        from: pageParam,
    }, 'POST');
    const body = await resp.json();
    if (!body.ok) {
        throw new Error(body.message);
    }
    return body.data;
};

export const getPublicDesignsByUser = async ( id, pageParam ) => {
    const resp = await fetchWithToken(`design/public/user/`, {
        id,
        from: pageParam,
    }, 'POST');
    const body = await resp.json();
    if (!body.ok) {
        throw new Error(body.message);
    }
    return body.data;
};

export const createDesign = async (path) => {
    console.log(path);
    const resp = await fetchWithToken(`design`, { path }, 'POST');
    const body = await resp.json();
    if (!body.ok) {
        throw new Error(body.message);
    }
    return body.data;
};

export const deleteDesignById = async ({ id }) => {
    const resp = await fetchWithToken(`design/${ id }`, {}, 'DELETE');
    const body = await resp.json();
    if (!body.ok) {
        throw new Error(body.message);
    }
    return body.data;
};
