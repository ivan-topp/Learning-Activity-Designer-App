import { fetchWithToken } from "../utils/fetch";

export const getUser = async (id) => {
    const res = await fetchWithToken(`user/${id}`);
    const body = await res.json();
    if(!body.ok){
        throw new Error(body.message);
    }
	return body.data;
};

export const searchOtherUsers = async (name) => {
    const res = await fetchWithToken('user/user', name, 'POST');
    const body = await res.json();
    if(!body.ok){
        throw new Error(body.message);
    }
	return body.data;
};
