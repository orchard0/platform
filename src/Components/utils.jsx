import axios from 'axios';
import FastestDepartures from '../../Reference/GetFastestDepartures.json';
import DepBoard from '../../Reference/GetDepBoardWithDetails.json';
import stationList from '../..//Reference/stationPicker.json';
const timeout = 200;

const fastest = axios.create({
	baseURL:
		'https://api1.raildata.org.uk/1010-live-fastest-departures/LDBWS/api/20220120',
	headers: {
		'x-apikey': import.meta.env.VITE_FASTEST,
	},
});
const next = axios.create({
	baseURL:
		'https://api1.raildata.org.uk/1010-live-next-departure-board/LDBWS/api/20220120',
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
		return deconstructDepatures(FastestDepartures);

	let url = `/GetFastestDeparturesWithDetails/${from}/${to}`;
	return fastest.get(url).then((res) => {
		return deconstructDepatures(res.data);
	});
};

export const getNextDepartures = (from, to) => {
	if (import.meta.env.VITE_LOCAL) return deconstructDepatures(DepBoard);

	let url = `/GetNextDeparturesWithDetails/${from}/${to}`;
	return next.get(url).then((res) => {
		// console.log(res);
		return deconstructDepatures(res.data);
	});
};

export const getDepBoard = (from, to) => {
	if (import.meta.env.VITE_LOCAL) return deconstructDepBoard(DepBoard);

	let url = `/GetDepBoardWithDetails/${from}?filterCrs=${to}`;
	return departureBoard.get(url).then((res) => {
		// console.log(res);
		return deconstructDepBoard(res.data);
	});
};

const deconstructDepatures = (data) => {
	const { departures, locationName, nrccMessages, generatedAt } = data;
	const service = departures[0].service;
	const { isCancelled, platform, std, etd, operator } = service;
	const { locationName: destination, via } = service.destination[0];

	return {
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
	};
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
	baseURL: '',
});

const stationCleanUp = (data) => {
	console.log(data);
	const stationSort = (a, b) => {
		if (a.name < b.name) return -1;
		else if (a.name > b.name) return 1;
		else return 0;
	};

	const stationFilter = (station) => {
		if (station.classification !== 'GROUP') return true;
	};

	return data.filter(stationFilter).sort(stationSort);
};

export const stationPicker = async (term) => {
	if (!term) return null;
	if (import.meta.env.VITE_LOCAL)
		return await new Promise((res) => {
			setTimeout(() => {
				res(stationCleanUp(stationList.payload.stations));
			}, timeout);
		});

	const url = `/${term}`;

	const data = await stationPickerAPI.get(url);
	if (data.data.status === 'OK') {
		return stationCleanUp(data.data.payload.stations);
	}
};
