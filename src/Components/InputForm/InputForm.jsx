import {
	ErrorBoundary,
	For,
	Show,
	Suspense,
	createEffect,
	createResource,
} from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { getFastestDepartures, getDepBoard, stationPicker } from '../utils';

import styles from './InputForm.module.css';
import { RailService } from '../RailService/RailService';

import { StationInput } from '../StationInput/StationInput';
import { useSearch } from '../../SearchContext';
export const InputForm = () => {
	const [searchData, setSearchData] = useSearch();

	const [fastestDepartures, setFastestDepartures] = createStore({});
	const [nextDepartures, setNextDepartures] = createStore([]);

	const [profile] = createResource(async () => {
		return new Promise((res, rej) => {
			setTimeout(() => {
				// res({ name: 'hello' });
				rej('Hi');
			}, 3000);
		});
	});

	const fetchFastestDepartures = async () => {
		try {
			const data = await getFastestDepartures(
				searchData.from,
				searchData.to
			);
			setFastestDepartures(data);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchNextDepartures = async () => {
		try {
			const data = await getDepBoard(searchData.from, searchData.to);
			console.log(data);
			setNextDepartures(data);
		} catch (err) {
			console.log(err);
		}
	};

	const startTimer = async () => {
		fetchFastestDepartures();
		fetchNextDepartures();
	};

	return (
		<div class={styles.main}>
			<h1 class={styles.title}>Rail Live</h1>
			<StationInput type={'from'} />
			<StationInput type={'to'} />
			<button class={styles.btn} onClick={startTimer}>
				Go
			</button>
			<Show when={fastestDepartures.locationName}>
				<p class={styles.titles}>Fastest:</p>
				<RailService departures={fastestDepartures} />
				<p class={styles.titles}>Departures:</p>
				<For each={nextDepartures}>
					{(departure) => {
						return <RailService departures={departure} />;
					}}
				</For>
			</Show>
		</div>
	);
};
