const Escrow = require('./escrow.model');

const createContract = async (req, res) => {
	const { contractAddress, arbiter, beneficiary, amount, approved } = req.body;
	const newContract = await Escrow.create({
		contractAddress,
		arbiter,
		beneficiary,
		amount,
		approved,
	});
	res.status(201).json({ newContract });
};

const getContracts = async (req, res) => {
	try {
		const contracts = await Escrow.find({});
		if ((contracts.length = 0)) {
			res.status(200).json({
				message: 'No contract yet',
			});
		}
		res.status(200).json({ contracts });
	} catch (error) {
		console.log(error);
	}
};

const updateContract = async (req, res) => {
	try {
		const { id: contractId } = req.params;
		const updatedContracts = await Escrow.findOneAndUpdate({ _id: contractId });
		res.status(200).json({ updatedContracts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

module.exports = {
	createContract,
	getContracts,
	updateContract,
};
