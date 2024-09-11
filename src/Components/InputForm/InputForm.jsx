import { createEffect, For, Show } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import {
	getFastestDepartures,
	// getNextDepartures,
	getDepartures,
} from '../utils';

import styles from './InputForm.module.css';
import { RailService } from '../RailService/RailService';

import { StationInput } from '../StationInput/StationInput';
import { useSearch } from '../../SearchContext';
import { useRecentSearch } from '../../RecentSearchesContext';

export const InputForm = () => {
	const [searchData, setSearchData] = useSearch();

	const [fastestDepartures, setFastestDepartures] = createStore([]);
	// const [nextDepartures, setNextDepartures] = createStore([]);
	const [departures, setDepartures] = createStore([]);
	const [recentSearches, setRecentSearches] = useRecentSearch();
	const [error, setError] = useRecentSearch(false);

	const genFastestDepartures = async () => {
		try {
			const data = await getFastestDepartures(
				searchData.from,
				searchData.to
			);
			setFastestDepartures(data);
		} catch (err) {
			console.log(err);
			setFastestDepartures([]);
		}
	};
	createEffect(() => {
		if (!fastestDepartures && !departures) setError(true);
	});

	// const genNextDepartures = async () => {
	// 	try {
	// 		const data = await getNextDepartures(
	// 			searchData.from,
	// 			searchData.to
	// 		);
	// 		setNextDepartures(data);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	const genDepartures = async () => {
		try {
			const data = await getDepartures(searchData.from, searchData.to);
			setDepartures(data);
		} catch (err) {
			console.log(err);
			setDepartures([]);
		}
	};

	const startTimer = async () => {
		genFastestDepartures();
		// genNextDepartures();
		genDepartures();

		if (!recentSearches) setRecentSearches([]);
		const existsSearch = recentSearches.find((item) => {
			if (item.from === searchData.from && item.to === searchData.to)
				return true;
		});
		const existsSearchIndex = recentSearches.findIndex((item) => {
			if (item.from === searchData.from && item.to === searchData.to)
				return true;
		});

		if (existsSearchIndex === -1) {
			const newSearch = {
				from: searchData.from,
				fromName: searchData.fromName,
				to: searchData.to,
				toName: searchData.toName,
				count: 1,
			};
			setRecentSearches((prev) => [newSearch, ...prev]);
		} else {
			let { count, ...rest } = existsSearch;
			count += 1 || 0;
			const updatedSearch = { count, ...rest };
			setRecentSearches((prev) => [
				updatedSearch,
				...prev.filter((item) => {
					if (
						item.from !== searchData.from &&
						item.to !== searchData.to
					)
						return true;
				}),
			]);
		}

		localStorage.setItem(
			'recentSearches',
			JSON.stringify(unwrap(recentSearches))
		);
	};

	return (
		<div class={styles.main}>
			<h1 class={styles.title}>Platform</h1>
			<StationInput type={'from'} />
			<StationInput type={'to'} />
			<button class={styles.btn} onClick={startTimer}>
				Go
			</button>
			<Show when={fastestDepartures.length}>
				<p class={styles.titles}>Fastest departure:</p>
				<For each={fastestDepartures}>
					{(departure) => {
						return <RailService departures={departure} />;
					}}
				</For>
			</Show>
			{/* <Show when={nextDepartures.length}>
				<p class={styles.titles}>Next departure:</p>
				<For each={nextDepartures}>
					{(departure) => {
						return <RailService departures={departure} />;
					}}
				</For>
			</Show> */}
			<Show when={departures.length}>
				<p class={styles.titles}>All departures:</p>
				<For each={departures}>
					{(departure) => {
						return <RailService departures={departure} />;
					}}
				</For>
			</Show>
			<Show when={error}>
				<p>No services found!</p>
			</Show>
		</div>
	);
};
