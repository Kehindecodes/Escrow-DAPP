const http = require('http');
const app = require('./app');
require('dotenv').config();
const { mongoConnect } = require('./connect');
const server = http.createServer(app);

const PORT = process.env.PORT || 8089;

async function startServer() {
	await mongoConnect();
	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
}

startServer();
