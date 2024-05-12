import { For, Show } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import { getFastestDepartures, getDepBoard } from '../utils';

import styles from './InputForm.module.css';
import { RailService } from '../RailService/RailService';

import { StationInput } from '../StationInput/StationInput';
import { useSearch } from '../../SearchContext';
import { useRecentSearch } from '../../RecentSearchesContext';

export const InputForm = () => {
	const [searchData, setSearchData] = useSearch();

	const [fastestDepartures, setFastestDepartures] = createStore({});
	const [nextDepartures, setNextDepartures] = createStore([]);
	const [recentSearches, setRecentSearches] = useRecentSearch();

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

		if (!recentSearches) setRecentSearches([]);
		const existsSearch = recentSearches.find((item) => {
			if (item.from === searchData.from && item.to === searchData.to)
				return true;
		});
		const existsSearchIndex = recentSearches.findIndex((item) => {
			if (item.from === searchData.from && item.to === searchData.to)
				return true;
		});

		console.log(existsSearch);

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
