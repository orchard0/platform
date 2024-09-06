import { For, Show } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import { getFastestDepartures, getDepartures } from '../utils';

import styles from './InputForm.module.css';
import { RailService } from '../RailService/RailService';

import { StationInput } from '../StationInput/StationInput';
import { useSearch } from '../../SearchContext';
import { useRecentSearch } from '../../RecentSearchesContext';

export const InputForm = () => {
	const [searchData, setSearchData] = useSearch();

	const [fastestDepartures, setFastestDepartures] = createStore([]);
	const [departures, setDepartures] = createStore([]);
	const [recentSearches, setRecentSearches] = useRecentSearch();

	const genFastestDepartures = async () => {
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

	const genDepartures = async () => {
		try {
			const data = await getDepartures(searchData.from, searchData.to);
			setDepartures(data);
		} catch (err) {
			console.log(err);
		}
	};

	const startTimer = async () => {
		genFastestDepartures();
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
			<h1 class={styles.title}>Rail Live</h1>
			<StationInput type={'from'} />
			<StationInput type={'to'} />
			<button class={styles.btn} onClick={startTimer}>
				Go
			</button>
			<Show when={fastestDepartures.length}>
				<p class={styles.titles}>Fastest:</p>
				<For each={fastestDepartures}>
					{(departure) => {
						console.log(departure);
						return <RailService departures={departure} />;
					}}
				</For>
			</Show>
			<Show when={departures.length}>
				<p class={styles.titles}>Departures:</p>
				<For each={departures}>
					{(departure) => {
						return <RailService departures={departure} />;
					}}
				</For>
			</Show>
		</div>
	);
};
