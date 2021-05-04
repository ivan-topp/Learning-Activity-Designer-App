import { fetchWithoutToken, fetchWithToken } from "utils/fetch";


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

export const getPublicFilteredDesigns = async (filter, keywords, categories, pageParam) => {
    const resp = await fetchWithToken(`design/public-repository`, {
        filter,
        keywords,
        categories,
        from: pageParam,
    }, 'POST');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};

export const getDesignsSharedWithMe = async ( pageParam ) => {
    const resp = await fetchWithToken(`design/shared-with-user/`, {
        from: pageParam,
    }, 'POST');
    if (!resp.ok) {
        throw new Error(resp.message);
    }
    return resp.data;
};

export const createDesign = async ({ path, isPublic = false }) => {
    const resp = await fetchWithToken(`design`, { path, isPublic }, 'POST');
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

export const uptdateUserInDesign = async ({ id, privileges }) =>{
    try {
        const resp = await fetchWithToken(`design/${id}`, { 
            newData: { id, privileges }
         }, 'PUT');
        if(!resp.ok){
            throw new Error(resp.message);
        };
        return resp.data;
    } catch (error) {
        console.log(error);
    }
};

export const getDesignByLink = async ({ link }) => {
    if(!link || (link && link.trim().length === 0)) return { design: {} };
    const resp = await fetchWithoutToken(`design/shared-link/${link}`, {}, 'GET');
    if(!resp.ok){
        throw new Error(resp.message);
    };
    return resp.data;
};

export const duplicateDesign = async ({ id }) => {
    const resp = await fetchWithToken(`design/duplicate`, { id }, 'POST');
    if(!resp.ok){
        throw new Error(resp.message);
    };
    return resp.data;
};

export const importDesign = async ({ path, filename, design, last }) => {
    const resp = await fetchWithToken(`design/import`, { path, filename, design }, 'POST');
    if(!resp.ok){
        throw new Error(resp.message);
    };
    return resp;
};