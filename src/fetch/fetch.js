// const BASEURL = 'http://localhost:3000';
const BASEURL = 'https://menu-mocha-nine.vercel.app';

async function fetchData(url, method, data, token) {
    let fetchOptions  = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'true'
        },
        body: JSON.stringify(data)
    }
    if (token) fetchOptions.headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    return await fetch(`${BASEURL}${url}`, fetchOptions)
}

export default fetchData