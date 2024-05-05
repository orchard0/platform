import { For, Show, createEffect } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { getFastestDepartures, getDepBoard, stationPicker } from '../utils';

import styles from './InputForm.module.css';
import { RailService } from '../RailService/RailService';

import { StationInput } from '../StationInput/StationInput';
export const InputForm = () => {
	const [searchData, setSearchData] = createStore({
		from: null,
		to: null,
		fromName: null,
		toName: null,
	});

	const [fastestDepartures, setFastestDepartures] = createStore({});
	const [nextDepartures, setNextDepartures] = createStore([]);

	const fetchFastestDepartures = async () => {
		try {
			const data = await getFastestDepartures(
				searchData.from,
				searchData.to
			);
			setFastestDepartures(reconcile(data));
		} catch (err) {
			console.log(err);
		}
	};

	const fetchNextDepartures = async () => {
		try {
			const data = await getDepBoard(searchData.from, searchData.to);
			setNextDepartures(reconcile(data));
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
			<StationInput
				setSearchData={setSearchData}
				searchData={searchData}
				type={'from'}
			/>
			<StationInput
				setSearchData={setSearchData}
				searchData={searchData}
				type={'to'}
			/>
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
