import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Escrow from './Escrow';

import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

const provider = new ethers.providers.Web3Provider(window.ethereum);
console.log(provider);

export async function approve(escrowContract, signer) {
	const approveTxn = await escrowContract.connect(signer).approve();
	await approveTxn.wait();
}

// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
function App() {
	const [escrows, setEscrows] = useState([]);
	const [account, setAccount] = useState();
	const [signer, setSigner] = useState();
	const [arbiter, setArbiter] = useState('');
	const [beneficiary, setBeneficiary] = useState('');
	const [amount, setAmount] = useState('');
	const api = axios.create({
		baseURL: 'http://localhost:8089',
	});

	useEffect(() => {
		async function getAccounts() {
			console.log(provider);

			const accounts = await provider.send('eth_accounts', []);
			console.log(accounts);

			setAccount(accounts[0]);

			setSigner(provider.getSigner());
			// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
			console.log(signer);
		}

		getAccounts();

		// getDataFromIPFS();
		// fetchData();
	}, [account]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get('/escrows');
				console.log(response.data.contracts);
				setEscrows(response.data.contracts);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	// const handleApprove = async (id) => {
	// 	const escrowContract = await deployContract(
	// 		signer,
	// 		arbiter,
	// 		beneficiary,
	// 		amount,
	// 	);

	// 	escrowContract.on('Approved', async () => {
	// 		const res = await api(`/escrows/${id}`, {
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({ approved: true }),
	// 		});
	// 		const updatedContract = await res.json();
	// 	});

	// 	await approve(escrowContract, signer);
	// };

	console.log(escrows);
	async function newContract() {
		setBeneficiary(document.getElementById('beneficiary').value);
		setArbiter(document.getElementById('arbiter').value);
		const value = document.getElementById('eth').value;
		const amountInWei = ethers.utils.parseEther(value.toString());
		setAmount(amountInWei);
		console.log(amount);

		const escrow = {
			// address: escrowContract.address,
			arbiter,
			beneficiary,
			amount: amountInWei,
			approved: false,
		};

		const res = await api.post('/escrows', {
			escrow,
			account,
		});

		console.log(res.data);
		setEscrows(() => [...escrows, res.data.newContract]);
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
					{escrows.length === 0 ? (
						<p>No contract yet</p>
					) : (
						escrows.map((escrow) => {
							return (
								<Escrow
									key={escrow._id}
									arbiter={escrow.arbiter}
									beneficiary={escrow.beneficiary}
									value={escrow.amount}
									approved={escrow.approved}
									// handleApprove={handleApprove(escrow.id)}
								/>
							);
						})
					)}
				</div>
			</div>
		</>
	);
}

export default App;
