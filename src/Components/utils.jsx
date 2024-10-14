import axios from 'axios';
// import FastestDepartures from '../../Reference/GetFastestDepartures.json';
// import DepBoard from '../../Reference/GetDepBoardWithDetails.json';
// import stationList from '../..//Reference/stationPicker.json';
const timeout = 200;

const api = axios.create({
	baseURL: import.meta.env.VITE_API,
});

export const fetchServices = async (from, to) => {
	const url = `services/live/${from}/${to}`;
	const res = await api.get(url);
	const { services, generatedAt } = res.data;
	return { services, generatedAt };
};

const stationCleanUp = (data) => {
	// console.log(data);
};

export const stationPicker = async (term) => {
	if (!term) return null;
	if (import.meta.env.VITE_LOCAL)
		return await new Promise((res) => {
			setTimeout(() => {
				res(stationCleanUp(stationList.payload.stations));
			}, timeout);
		});

	const url = `stations/${term}`;

	const res = await api.get(url);

	const stationSort = (a, b) => {
		if (a.name < b.name) return -1;
		else if (a.name > b.name) return 1;
		else return 0;
	};

	return res.data.stations.sort(stationSort);
};
