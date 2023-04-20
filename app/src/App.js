import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Escrow from './Escrow';
import deployContract from './deploy';
import useEscrowList from './useEscrowList';
import axios from 'axios';
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
	const escrowList = useEscrowList();
	const [escrows, setEscrows] = useState(escrowList);
	const [account, setAccount] = useState();
	const [signer, setSigner] = useState();
	const [arbiter, setArbiter] = useState(escrowList.arbiter);
	const [beneficiary, setBeneficiary] = useState('');
	const [amount, setAmount] = useState('');
	const api = axios.create({
		baseURL: 'http://localhost:8089',
	});

	const handleApprove = async (id) => {
		const escrowContract = await deployContract(
			signer,
			arbiter,
			beneficiary,
			amount,
		);

		escrowContract.on('Approved', async () => {
			const res = await api(`/escrows/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ approved: true }),
			});
			const updatedContract = await res.json();
		});

		await approve(escrowContract, signer);
	};
	// const signer = provider.getSigner();
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

		getAccounts();
		// getDataFromIPFS();
		console.log(escrows);
	}, []);

	async function newContract() {
		setBeneficiary(document.getElementById('beneficiary').value);
		setArbiter(document.getElementById('arbiter').value);
		const value = document.getElementById('eth').value;
		const amountInWei = ethers.utils.parseEther(value.toString());
		setAmount(amountInWei);

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
			amount: value.toString(),
			approved: false,
		};
		const res = await api.post('/escrows', escrow);
		const newEscrows = res.json();
		console.log(newEscrows);
		setEscrows([...escrowList, newEscrows.data.contracts]);
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
					{escrowList.length === 0 ? (
						<p>No contract yet</p>
					) : (
						escrowList.map((escrow) => {
							return (
								<Escrow
									key={escrow._id}
									arbiter={escrow.arbiter}
									beneficiary={escrow.beneficiary}
									value={escrow.amount}
									approved={escrow.approved}
									handleApprove={handleApprove(escrow.id)}
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
