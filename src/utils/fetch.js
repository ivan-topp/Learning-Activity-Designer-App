//endpoint ->/auth, /event, etc

//const baseUrl = process.env.REACT_APP_API_URL; // localhost:4000/api
const baseUrl = 'http://localhost:4000/api';
console.log(baseUrl);

const fetchWithOutToken=(endpoint, data, method = 'GET')=>{
    const url = `${baseUrl}/${endpoint}`; // localhost:4000/api/auth

    if(method==='GET'){
        return fetch(url);
    }else{
        return fetch(url, {
            method,
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(data)
        });
    }

}

const fetchConToken=(endpoint, data, method = 'GET')=>{
    const url = `${baseUrl}/${endpoint}`; // localhost:4000/api/auth
    const token = localStorage.getItem('token')|| '';
    if(method==='GET'){
        return fetch(url,{
            method,
            headers:{
                'x-token': token
            },

        })
    }else{
        return fetch(url,{
            method,
            headers:{
                'Content-type':'application/json',
                'x-token': token
            },
            body:JSON.stringify(data)
        });
    }
}

export {
    fetchWithOutToken,
    fetchConToken
}