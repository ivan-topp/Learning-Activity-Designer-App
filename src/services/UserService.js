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
        const resp = await fetchWithToken(`user/${uid}`, { 
           newData: { uid, name, lastname, occupation, institution, country, city, description }
        }, 'PUT');
        if(!resp.ok){
            throw new Error(resp.message);
        }
        return resp.data;
    } catch (error) {
        console.log(error);
    }
};

export const getUserByEmail = async( email ) => {
    try {
        return await fetchWithToken(`user/search-by-email/`, { 
           email
        }, 'POST');
    } catch (error) {
        console.log(error);
        return { ok: false, message: 'Ha ocurrido un error al hacer la petición, compruebe su conexión a internet o vuelva a intentarlo más tarde.'};
    }
};

export const resendVerificationCode = async( email ) => {
    try {
        return await fetchWithToken(`user/resend-code/`, { 
            email
        }, 'POST');
    } catch (error) {
        console.log(error);
        return { ok: false, message: 'Ha ocurrido un error al hacer la petición, compruebe su conexión a internet o vuelva a intentarlo más tarde.'};
    }
};

export const changeUserPassword = async( { uid, newPassword } ) => {
    try {
        return await fetchWithToken(`auth/reset-password/${uid}`, { 
            newPassword
        }, 'PUT');
    } catch (error) {
        console.log(error);
        return { ok: false, message: 'Ha ocurrido un error al hacer la petición, compruebe su conexión a internet o vuelva a intentarlo más tarde.'};
    }
};