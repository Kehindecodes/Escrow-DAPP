const { query } = require('express');
const Escrow = require('./escrow.model');
const { deployContract } = require('./deploy');
const CircularJSON = require('circular-json');
const ethers = require('ethers');

const createContract = async (req, res) => {
	const signer = req.body.account;
	const { arbiter, beneficiary, amount, approved } = req.body.escrow;
	const amountInWei = ethers.utils.parseEther(amount.toString());
	deployContract(signer, arbiter, beneficiary, amountInWei);
	const newContract = await Escrow.create({
		// contractAddress,
		arbiter,
		beneficiary,
		amount,
		approved,
	});

	return res.status(201).json({ newContract });
};

const getContracts = async (req, res) => {
	try {
		const contracts = await Escrow.find({});
		if (contracts.length === 0) {
			res.status(200).json({
				message: 'No contract yet',
			});
		}
		return res.status(200).json({ contracts });
	} catch (error) {
		console.log(error);
	}
};

const updateContract = async (req, res) => {
	try {
		const { id } = req.params;
		const { approved } = req.body;
		const updatedContracts = await Escrow.findById(id);
		updatedContracts.approved = approved;
		await updatedContracts.save();
		return res.status(200).json({ updatedContracts });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

module.exports = {
	createContract,
	getContracts,
	updateContract,
};
