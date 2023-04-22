// import { ethers } from 'ethers';
// import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

const ethers = require('ethers');
const Escrows = require('./artifacts/contracts/Escrow.sol/Escrow.json');

// const  provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL) ;

// const signer =  new ethers.Wallet(process.env.PRIVATE_KEY,provider);
async function deployContract(signer, arbiter, beneficiary, value) {
	const factory = new ethers.ContractFactory(
		Escrows.abi,
		Escrows.bytecode,
		signer,
	);
	return await factory.deploy(arbiter, beneficiary, { value });
}

module.exports = {
	deployContract,
};
