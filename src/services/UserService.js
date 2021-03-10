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
        console.log(contacts, uid)
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

