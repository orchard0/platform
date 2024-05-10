import { Show, createEffect, createResource, createSignal } from 'solid-js';

import { stationPicker } from '../utils';
import styles from './StationInput.module.css';
import { produce } from 'solid-js/store';
import { useSearch } from '../../SearchContext';

const delay = (fn, ms) => {
	let timer = 0;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(this, ...args), ms || 0);
	};
};

export const StationInput = (props) => {
	const type = props.type;
	const [searchData, setSearchData] = useSearch();

	const [show, setShow] = createSignal(false);
	const [stationName, setStationName] = createSignal('');
	const [stations, { mutate, refetch }] = createResource(
		stationName,
		stationPicker
	);

	createEffect(() => {
		// TODO is there a better way to setShow to true when stations updates?
		stations();
		setShow(true);
	});

	return (
		<>
			<input
				class={styles.input}
				type="from"
				value={searchData[type + 'Name']}
				onKeyUp={delay((e) => {
					// setSearchData('from', e.target.value);
					setStationName(e.target.value);
				}, 250)}
			/>
			<Show when={show()}>
				<div class={styles.stationsPick}>
					<For each={stations()}>
						{(station) => {
							return (
								<p
									onClick={() => {
										setSearchData(
											produce((state) => {
												state[type + 'Name'] =
													station.name;
												state[type] = station.crsCode;
											})
										);
										setShow(false);
									}}>
									{station.name}{' '}
									<abbr>{station.crsCode}</abbr>
								</p>
							);
						}}
					</For>
				</div>
			</Show>
		</>
	);
};
