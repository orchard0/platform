import axios from 'axios';
// import FastestDepartures from '../../Reference/GetFastestDepartures.json';
// import DepBoard from '../../Reference/GetDepBoardWithDetails.json';
// import stationList from '../..//Reference/stationPicker.json';
const timeout = 200;

const genDatetime = () => {
	return new Date()
		.toLocaleString('sv')
		.replace(' ', 'T')
		.replaceAll(':', '')
		.replaceAll('-', '');
};

const fastest = axios.create({
	baseURL:
		'https://api1.raildata.org.uk/1010-live-fastest-departures---staff-version/LDBSVWS/api/20220120',
	headers: {
		'x-apikey': import.meta.env.VITE_FASTEST,
	},
});
const next = axios.create({
	baseURL:
		'https://api1.raildata.org.uk/1010-live-next-departures-board---staff-version/LDBSVWS/api/20220120',
	headers: {
		'x-apikey': import.meta.env.VITE_NEXT,
	},
});
const departureBoard = axios.create({
	baseURL:
		'https://api1.raildata.org.uk/1010-live-departure-board-dep/LDBWS/api/20220120',
	headers: {
		'x-apikey': import.meta.env.VITE_DEPART,
	},
});

export const getFastestDepartures = (from, to) => {
	if (import.meta.env.VITE_LOCAL)
		return deconstructFastestDepatures(FastestDepartures);

	let url = `/GetFastestDeparturesWithDetails/${from}/${to}/${genDatetime()}`;
	return fastest.get(url).then((res) => {
		// console.log(res.data);
		return deconstructFastestDepatures(res.data);
	});
};

export const getNextDepartures = (from, to) => {
	if (import.meta.env.VITE_LOCAL)
		return deconstructFastestDepatures(DepBoard);

	let url = `/GetNextDeparturesWithDetails/${from}/${to}/${genDatetime()}`;
	return next.get(url).then((res) => {
		return deconstructFastestDepatures(res.data);
	});
};

export const getDepartures = (from, to) => {
	if (import.meta.env.VITE_LOCAL) return deconstructDepBoard(DepBoard);

	let url = `/GetDepBoardWithDetails/${from}?filterCrs=${to}`;
	return departureBoard.get(url).then((res) => {
		// console.log(res.data);
		if (res.data.trainServices) return deconstructDepBoard(res.data);
		else throw new Error();
	});
};

const deconstructFastestDepatures = (data) => {
	let service;
	const { departures, locationName, nrccMessages, generatedAt } = data;
	service = departures[0].service;
	if (!service) return {};
	const { isCancelled, platform, operator } = service;
	let { std, etd } = service;
	const { locationName: destination, via } = service.destination[0];

	// no etd is returned in the response if the train is delayed!
	if (!etd) etd = '-';
	etd = etd.slice(11, 16);
	std = std.slice(11, 16);
	if (etd == std) etd = 'On time';

	return [
		{
			generatedAt,
			locationName,
			destination,
			via,
			std,
			etd,
			platform,
			isCancelled,
			operator,
			nrccMessages,
		},
	];
};

const deconstructDepBoard = (data) => {
	const items = [];
	const { trainServices, locationName, nrccMessages, generatedAt } = data;
	for (const departure of trainServices) {
		const {
			isCancelled,
			filterLocationCancelled = false,
			cancelReason,
			delayReason,
			platform,
			std,
			etd,
			operator,
		} = departure;
		const { locationName: destination, via } = departure.destination[0];
		const item = {
			generatedAt,
			nrccMessages,
			locationName,
			destination,
			via,
			std,
			etd,
			platform,
			isCancelled,
			operator,
			filterLocationCancelled,
			cancelReason,
			delayReason,
		};
		items.push(item);
	}

	return items;
};

const stationPickerAPI = axios.create({
	baseURL: import.meta.env.VITE_API,
});

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

	const res = await stationPickerAPI.get(url);

	const stationSort = (a, b) => {
		if (a.name < b.name) return -1;
		else if (a.name > b.name) return 1;
		else return 0;
	};

	return res.data.stations.sort(stationSort);
};
