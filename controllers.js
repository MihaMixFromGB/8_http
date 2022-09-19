const fs = require('fs');
const { resolve } = require('path');

const { checkAuth, sendUnauthorizedError } = require('./authController.js');

const getController = function(req, res) {
    if (req.method === 'GET') {
        try {
            res.writeHead(200);
            res.end(getFilesList());
        } catch(err) {
            console.log('getController: ' + err.message);
            
            res.writeHead(500);
            res.end('Internal server error');
        }

        return;
    }

    notAllowedMethod(req, res)
}

const postController = async function(req, res) {
    if (req.method === 'POST') {
        if (!checkAuth(req)) {
            sendUnauthorizedError(res);
            return;
        }

        const { filename, content } = await parseJSON(req);
        createFile(filename, content);

        res.writeHead(200);
        res.end("post: success");

        return;
    }

    notAllowedMethod(req, res)
}

const deleteController = async function(req, res) {
    if (req.method === 'DELETE') {
        if (!checkAuth(req)) {
            sendUnauthorizedError(res);
            return;
        }
        
        const { filename } = await parseJSON(req);
        deleteFile(filename);
        
        res.writeHead(200);
        res.end("delete: success");
        return;
    }

    notAllowedMethod(req, res)
}

const redirectController = function(req, res, { HOST, PORT }) {
    if (req.method === 'GET') {
        res.writeHead(301, {
            "Location": `http://${HOST}:${PORT}/redirected`
        });
        res.end();
        return;
    }

    notAllowedMethod(req, res)
}

function notAllowedMethod(req, res) {
    res.writeHead(405);
    res.end("HTTP method not allowed");
}

function getFilesList() {
    const files = fs.readdirSync('./files/');
    return files.join(',');
}

async function parseJSON(req) {
    return new Promise(resolve => {
        let rawdata = '';

        req.on('data', chunk => {
            rawdata += chunk;
        });
        req.on('end', () => {
            resolve(JSON.parse(rawdata));
        })
    })
}

function createFile(filename, content) {
    fs.writeFileSync(resolve('./files', filename), content);
}

function deleteFile(filename) {
    fs.unlinkSync(resolve('./files', filename));
}

module.exports = {
    getController,
    postController,
    deleteController,
    redirectController
}