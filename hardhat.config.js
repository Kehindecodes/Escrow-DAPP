require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
	solidity: '0.8.17',
	paths: {
		artifacts: './app/src/artifacts',
	},
	networks: {
		// goerli: {
		// 	url: process.env.GOERLI_URL,
		// 	accounts: [process.env.PRIVATE_KEY],
		// },
		hardhat: {
			gasPrice: 8000000000,
			gas: 12000000,
			maxPriorityFeePerGas: 20,
			// url: "http://localhost:8545", // set the URL of the node
		},

		polygon_testnet: {
			url: process.env.POLYGON_TESTNET,
			accounts: [process.env.PRIVATE_KEY],
		},
	},
};
