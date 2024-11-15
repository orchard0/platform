import { createEffect, createSignal, For, Show } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import { fetchServices } from '../utils';

import styles from './InputForm.module.css';
import { RailService } from '../RailService/RailService';

import { StationInput } from '../StationInput/StationInput';
import { useSearch } from '../../SearchContext';
import { useRecentSearch } from '../../RecentSearchesContext';
import { useSearchParams } from '@solidjs/router';

export const InputForm = () => {
	const [searchData, setSearchData] = useSearch();
	const [searchParams, setSearchParams] = useSearchParams();

	setSearchData({
		from: searchParams.from || null,
		fromName: searchParams.fromName || null,
		to: searchParams.to || null,
		toName: searchParams.toName || null,
	});

	const [departures, setDepartures] = createStore([]);
	const [recentSearches, setRecentSearches] = useRecentSearch();
	const [errorMsg, setErrorMsg] = createSignal(false);

	const getServices = async () => {
		let services;
		try {
			({ services, generatedAt } = await fetchServices(
				searchData.from,
				searchData.to
			));
		} catch (err) {
			console.log(err);
			setDepartures([]);
			setErrorMsg('No services found!');
		}
		setDepartures(services);
	};
	createEffect(() => {
		if (departures.length) setErrorMsg(false);
	});

	const startTimer = async () => {
		getServices();

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
			<Show when={departures.length}>
				<p class={styles.titles}>Services:</p>
				<For each={departures}>
					{(departure) => {
						return <RailService departures={departure} />;
					}}
				</For>
			</Show>
			<Show when={errorMsg}>
				<p>{errorMsg()}</p>
			</Show>
		</div>
	);
};
