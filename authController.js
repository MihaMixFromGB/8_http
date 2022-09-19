const { decode } = require('querystring');

const user = {
    id: 123,
    username: 'testuser',
    password: 'qwerty'
}

const authController = async function(req, res) {
    if (req.method !== 'POST') {
        notAllowedMethod(res);
        return;
    }

    const credentials = await getCredentials(req);
    
    if (credentials.user !== user.username
        || credentials.password !== user.password) {
            resetAuth(res);
            return;
        }
    
    setAuth(res);
}

function notAllowedMethod(res) {
    res.writeHead(405);
    res.end("HTTP method not allowed");
}

async function getCredentials(req) {
    return new Promise((resolve) => {
        let rawdata = '';
        req.on('data', chunk => {
            rawdata += chunk;
        });
        req.on('end', () => {
            resolve(decode(rawdata));
        });
    })
}

function getExpires(days) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    return expires;
}
function setAuth(res) {
    const expires = getExpires(2).toUTCString();
    
    res.writeHead(200, {
        "Set-Cookie": [
            `userid=${user.id}; expires=${expires}`,
            `authorized=true; expires=${expires}`
        ],
        "Access-Control-Allow-Origin": '*'
    });
    res.end();
}

function resetAuth(res) {
    res.writeHead(400, {
        "Set-Cookie": [
            "userid=''",
            "authorized=false"
        ]
    });
    res.end('Неверный логин или пароль');
}

function sendUnauthorizedError(res) {
    res.writeHead(401, {
        "Set-Cookie": [
            "userid=''",
            "authorized=false"
        ]
    });
    res.end('Authorization required');
}

function checkAuth(req) {
    const cookies = parseCookies(req.headers?.cookie);

    if (cookies.authorized && cookies.userid.toString() === user.id.toString()) {
        return true;
    }

    return false;
}

function parseCookies(header) {
    const listOfCookies = header.split(";");

    const cookies = {};
    listOfCookies.map(cookie => {
        const pair = cookie.split("=").map(item => item.trim());
        if (!pair[0]) return cookies;

        cookies[pair[0]] = pair[1];
    });
    
    return cookies;
}

module.exports = {
    authController,
    checkAuth,
    sendUnauthorizedError
}