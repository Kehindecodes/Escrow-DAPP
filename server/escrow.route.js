const express = require('express');

const {
	createContract,
	getContracts,
	updateContract,
} = require('./escrow.controller');

const escrowRouter = express.Router();

escrowRouter.post('/', createContract);
escrowRouter.get('/', getContracts);
escrowRouter.put('/:id', updateContract);

module.exports = escrowRouter;
