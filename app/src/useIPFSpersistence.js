import { useState, useEffect } from 'react';
import { Web3Storage } from 'web3.storage';

export const useIPFSPersistence = () => {
	const [cid, setCid] = useState(null);
	const [ipfs, setIpfs] = useState(null);

	useEffect(() => {
		const initIPFS = async () => {
			const storageClient = new Web3Storage({
				token: process.env.REACT_APP_WEB3_STORAGE_TOKEN,
			});
			setIpfs(storageClient);
		};
		initIPFS();
	}, []);

	const storeDataOnIPFS = async (data) => {
		const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
		const file = [
			new File(['contents-of-file-1'], 'plain-utf8.txt'),
			new File([blob], 'escrow.json'),
		];

		console.log(file);
		const cid = await ipfs.put(file);
		setCid(cid);
		return cid;
	};
	const getData = async () => {
		const retrievedData = await ipfs.get(
			process.env.REACT_APP_WEB3_STORAGE_TOKEN,
		);

		console.log(
			`Got a response! [${retrievedData.status}] ${retrievedData.statusText}`,
		);
		console.log(retrievedData);

		// const dataString = retrievedData.toString();
		// const parsedData = JSON.parse(dataString);
		// return parsedData;
	};
	// const getAllData = async () => {
	// 	for await (const upload of ipfs.list()) {
	// 		return;
	// 		console.log(
	// 			`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`,
	// 		);
	// 	}
	// 	const retrievedData = await ipfs.get(cid);
	// 	const dataString = retrievedData.toString();
	// 	const parsedData = JSON.parse(dataString);
	// 	return parsedData;
	// };

	return { storeDataOnIPFS, getData, cid };
};
