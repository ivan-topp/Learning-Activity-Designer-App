import { fetchWithToken } from "../utils/fetch";

export const searchMyProfile = async (id) => {
    const res = await fetchWithToken(`user/${id}`);
    const body = await res.json();
    if(!body){
        throw new Error(body.message);
    }
	return body.data;
};

export const searchOtherUsers = async (name) => {
    const res = await fetchWithToken('users/user', name, 'POST');
    const body = await res.json();
    if(!body){
        throw new Error(body.message);
    }
	return body.data;
};
