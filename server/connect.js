const mongoose = require('mongoose');
require('dotenv').config();
// check database connection
mongoose.connection.once('open', () => {
	console.log('MongoDB is connected');
});
mongoose.connection.on('error', (err) => {
	console.error(err);
});

async function mongoConnect() {
	await mongoose.connect(process.env.MONGO_URL);
}

async function mongoDisconnect() {
	await mongoose.disconnect();
}

module.exports = {
	mongoConnect,
	mongoDisconnect,
};
