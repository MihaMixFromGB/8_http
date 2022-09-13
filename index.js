const http = require('http');

const {
    getController,
    postController,
    deleteController,
    redirectController
} = require('./controllers.js');

const HOST = 'localhost';
const PORT = '3000';

const server = http.createServer((req, res) => {
    if (req.url === '/get' || req.url === '/redirected') {
        getController(req, res);
        return;
    } else if (req.url === '/post') {
        postController(req, res);
        return;
    } else if (req.url === '/delete') {
        deleteController(req, res);
        return;
    } else if (req.url === '/redirect') {
        redirectController(req, res, { HOST, PORT });
        return;
    }

    res.writeHead(404);
    res.end('not found');
})
.listen(PORT, HOST, ()=> {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});