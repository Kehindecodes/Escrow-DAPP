import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Escrow from './Escrow';
import deployContract from './deploy';
import { useIPFSPersistence } from './useIPFSpersistence';
// import dotenv from 'dotenv';
// dotenv.config();

const provider = new ethers.providers.Web3Provider(window.ethereum);

// const provider = new ethers.providers.JsonRpcProvider(
// 	'https://eth-goerli.g.alchemy.com/v2/BIUsWjz28dN-4WBkLQXmqYVPlZ7EiwqU',
// );

export async function approve(escrowContract, signer) {
	const approveTxn = await escrowContract.connect(signer).approve();
	await approveTxn.wait();
}

// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
function App() {
	const [escrows, setEscrows] = useState([]);
	const [account, setAccount] = useState();
	const [signer, setSigner] = useState();

	// const signer = provider.getSigner();
	const { storeDataOnIPFS, getData, updatedData } = useIPFSPersistence();
	useEffect(() => {
		async function getAccounts() {
			console.log(provider);

			const accounts = await provider.send('eth_accounts', []);
			console.log(accounts);

			setAccount(accounts[0]);

			setSigner(provider.getSigner());
			// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
			// console.log(wallet);
		}
		// const getDataFromIPFS = async () => {
		// 	const updatedEscrow = await getData(cid);

		// 	setEscrows([...escrows, updatedEscrow]);
		// };

		getAccounts();
		// getDataFromIPFS();
		console.log(escrows);
	}, []);

	async function newContract() {
		const beneficiary = document.getElementById('beneficiary').value;
		const arbiter = document.getElementById('arbiter').value;
		const value = document.getElementById('eth').value;
		const amountInWei = ethers.utils.parseEther(value.toString());

		const escrowContract = await deployContract(
			signer,
			arbiter,
			beneficiary,
			amountInWei,
		);

		const escrow = {
			address: escrowContract.address,
			arbiter,
			beneficiary,
			value: value.toString(),
			handleApprove: async () => {
				escrowContract.on('Approved', () => {
					document.getElementById(escrowContract.address).className =
						'complete';
					document.getElementById(escrowContract.address).innerText =
						"✓ It's been approved!";
				});

				await approve(escrowContract, signer);
			},
		};
		const hash = await storeDataOnIPFS(escrow);

		setEscrows([...escrows, escrow]);
		const updatedEscrow = await getData();
		console.log(`Data added to IPFS with hash: ${hash} and ${updatedData}`);
		console.log(escrow);
		console.log(hash);
	}

	return (
		<>
			<div className='contract'>
				<h1> New Contract </h1>
				<label>
					Arbiter Address
					<input type='text' id='arbiter' />
				</label>

				<label>
					Beneficiary Address
					<input type='text' id='beneficiary' />
				</label>

				<label>
					Deposit Amount (in ether)
					<input type='text' id='eth' />
				</label>

				<div
					className='button'
					id='deploy'
					onClick={(e) => {
						e.preventDefault();

						newContract();
					}}>
					Deploy
				</div>
			</div>

			<div className='existing-contracts'>
				<h1> Existing Contracts </h1>

				<div id='container'>
					{escrows.map((escrow) => {
						return <Escrow key={escrow.address} {...escrow} />;
					})}
				</div>
			</div>
		</>
	);
}

export default App;
