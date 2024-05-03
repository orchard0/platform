import {
	For,
	Show,
	createEffect,
	createResource,
	createSignal,
} from 'solid-js';
import { createStore, produce, reconcile } from 'solid-js/store';
import { getFastestDepartures, getDepBoard, stationPicker } from '../utils';

import styles from './InputForm.module.css';
import { RailService } from '../RailService/RailService';

export const InputForm = () => {
	const delay = (fn, ms) => {
		let timer = 0;
		return function (...args) {
			clearTimeout(timer);
			timer = setTimeout(fn.bind(this, ...args), ms || 0);
		};
	};

	const [searchData, setSearchData] = createStore({
		from: null,
		to: 'RMD',
		fromName: null,
		toName: null,
	});

	const [from, setFrom] = createSignal();
	const [fastestDepartures, setFastestDepartures] = createStore({});
	const [nextDepartures, setNextDepartures] = createStore([]);
	const [stations, { mutate, refetch }] = createResource(from, stationPicker);

	createEffect(() => {
		// console.log(fastestDepartures.generatedAt);
		// console.clear();

		for (const station of stations()) {
			console.log(`${station.name} ${station.crsCode}`);
		}
		// console.log(searchData.from);
	});

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
			<input
				class={styles.input}
				type="from"
				value={searchData.fromName}
				onKeyUp={delay((e) => {
					// setSearchData('from', e.target.value);
					setFrom(e.target.value);
				}, 250)}
			/>
			<Show when={true}>
				<div class={styles.stationsPick}>
					<For each={stations()}>
						{(station) => {
							return (
								<p
									onClick={(e) => {
										setSearchData(
											produce((state) => {
												state.fromName = station.name;
												state.from = station.crsCode;
											})
										);
									}}>
									{station.name}{' '}
									<abbr>{station.crsCode}</abbr>
								</p>
							);
						}}
					</For>
				</div>
			</Show>
			<input
				class={styles.input}
				type="to"
				value={searchData.to}
				onChange={(e) => {
					setSearchData('to', e.target.value);
				}}
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
