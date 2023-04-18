import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

// const  provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL) ;

// const signer =  new ethers.Wallet(process.env.PRIVATE_KEY,provider);

export default async function deployContract(
	signer,
	arbiter,
	beneficiary,
	value,
) {
	const factory = new ethers.ContractFactory(
		Escrow.abi,
		Escrow.bytecode,
		signer,
	);
	return await factory.deploy(arbiter, beneficiary, { value });
}
