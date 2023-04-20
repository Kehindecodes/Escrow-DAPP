import { useState, useEffect } from 'react';
import axios from 'axios';

const useEscrowList = () => {
	const [escrowList, setEscrowList] = useState([]);
	const api = axios.create({
		baseURL: 'http://localhost:8089',
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get('/escrows');
				console.log(response.data.contracts);
				setEscrowList(response.data.contracts);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	return escrowList;
};

export default useEscrowList;
