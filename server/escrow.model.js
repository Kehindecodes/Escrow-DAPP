const mongoose = require('mongoose');

const EscrowSchema = new mongoose.Schema({
	contactAddress: String,
	arbiter: String,
	beneficiary: String,
	amount: Number,
	approved: Boolean,
});

module.exports = mongoose.model('escrow', EscrowSchema);
