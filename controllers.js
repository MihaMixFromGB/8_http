const fs = require('fs');

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

const postController = function(req, res) {
    if (req.method === 'POST') {
        res.writeHead(200);
        res.end("post: success");
        return;
    }

    notAllowedMethod(req, res)
}

const deleteController = function(req, res) {
    if (req.method === 'DELETE') {
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

module.exports = {
    getController,
    postController,
    deleteController,
    redirectController
}