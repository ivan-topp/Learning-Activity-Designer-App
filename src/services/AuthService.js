import { fetchWithoutToken, fetchWithToken } from "../utils/fetch";

export const register = async (registerPayload) => {
	try {
		const res = await fetchWithoutToken('auth/register', registerPayload, 'POST');
        const body = await res.json();
		return body;
	} catch (error) {
		console.log(error);
	}
};

export const login = async (loginPayload) => {
	try {
		const res = await fetchWithoutToken('auth/login', loginPayload, 'POST');
        const body = await res.json();
		return body;
	} catch (error) {
		console.log(error);
        return { ok: false};
	}
};

export const logout = (setAuthState) => {
	setAuthState((prevState)=>({
        ...prevState,
        user: null,
        token: null,
        checking: false,
    }));
};

export const checkingToken = async (setAuthState) => {
    try {
        const resp = await fetchWithToken( 'auth/renew' );
        const body = await resp.json();
        console.log(body.ok);
    
        if( body.ok ){
            setAuthState((prevState) => ({
                ...prevState,
                user: body.data.user,
                token: body.data.token,
                checking: false,
            }));
    
        } else {
            setAuthState((prevState) => ({
                ...prevState,
                user: null,
                token: null,
                checking: false,
            }));
        }
        
    } catch (error) {
        console.log(error);
        setAuthState((prevState) => ({
            ...prevState,
            user: null,
            token: null,
            checking: false,
        }));
    }
};