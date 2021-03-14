import { fetchWithToken } from "utils/fetch";

export const getUser = async ( id ) => {
    const resp = await fetchWithToken(`user/${id}`);
    if(!resp.ok){
        throw new Error(resp.message);
    }
	return resp.data;
};

export const searchUsers = async ( filter, pageParam ) => {
    const resp = await fetchWithToken('user/search/', {
        filter,
        from: pageParam,
    }, 'POST');
    if(!resp.ok){
        throw new Error(resp.message);
    }
	return resp.data;
};

export const updateContact = async(  {uid, contacts} ) => {
    try {
        const resp = await fetchWithToken(`user/${uid}`, { 
            newData: { contacts }
         }, 'PUT');
        if(!resp.ok){
            throw new Error(resp.message);
        }
        return resp.data;
    } catch (error) {
        console.log(error);
    }
};

export const updateProfileInformation = async(  {uid, name, lastname, occupation, institution, country, city, description} ) => {
    try {
        const res = await fetchWithToken(`user/${uid}`, { 
           newData: { uid, name, lastname, occupation, institution, country, city, description }
        }, 'PUT');
        const body = await res.json();
        if(!body.ok){
            throw new Error(body.message);
        }
        return body.data;
    } catch (error) {
        console.log(error);
    }
};

