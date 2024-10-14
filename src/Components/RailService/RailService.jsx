import { Show, createEffect, splitProps } from 'solid-js';
import { createStore } from 'solid-js/store';

import styles from './RailService.module.css';
import { useSearch } from '../../SearchContext';

export const RailService = (props) => {
	const [searchData, setSearchData] = useSearch();

	const [data] = splitProps(props, ['departures']);
	const { departures: service } = data;
	const [styling, setStyling] = createStore({
		alteration: false,
		type: null,
		message: null,
		msgStyles: [],
		containerStyles: [],
	});

	createEffect(() => {
		if (service.cancelReason) {
			setStyling({
				message: service.cancelReason,
				msgStyles: [styles.reason, styles.cancelReason],
				containerStyles: [styles.cancelled, styles.msgAbove],
			});
		} else if (service.delayReason) {
			setStyling({
				message: service.delayReason,
				msgStyles: [styles.reason, styles.delayReason],
				containerStyles: [styles.delay, styles.msgAbove],
			});
		} else if (service.etd === 'Cancelled') {
			setStyling({
				message: 'This train has been cancelled.',
				msgStyles: [styles.reason, styles.cancelReason],
				containerStyles: [styles.cancelled, styles.msgAbove],
			});
		} else if (service.etd !== 'On time') {
			setStyling({
				message: 'This train has been delayed.',
				msgStyles: [styles.reason, styles.delayReason],
				containerStyles: [styles.delay, styles.msgAbove],
			});
		} else {
			setStyling({
				message: null,
				msgStyles: [],
				containerStyles: [],
			});
		}
		if (service.type.includes('fastest')) {
			setStyling(
				'containerStyles',
				styling.containerStyles.length,
				styles.msgBelow
			);
		}
	});
	return (
		<div class={styles.main}>
			<div class={styles.section}>
				<Show when={styling.message}>
					<div class={styling.msgStyles.join(' ')}>
						{' '}
						<img src="./src/assets/alert.svg" alt="" />{' '}
						{styling.message}
					</div>
				</Show>
				<div
					class={
						styles.container +
						' ' +
						styling.containerStyles.join(' ')
					}>
					<div class={styles.time}>{service.std}</div>

					{styling.message ? (
						<p class={styles.timeLate}>{service.etd}</p>
					) : (
						<div class={styles.ontime}>
							<img src="/static/icons/check.svg" alt="" />
							{service.etd}
						</div>
					)}

					<div class={styles.img}>
						<img src="/static/icons/train.svg" alt="" />
					</div>
					<div class={styles.station}>{service.destination}</div>
					<Show when={service.platform}>
						{' '}
						<div class={styles.platform}>
							<p class={styles.plat}>Platform</p>
							<p class={styles.number}>{service.platform}</p>
						</div>
					</Show>
				</div>
			</div>
			<Show when={styling.containerStyles.includes(styles.msgBelow)}>
				<div class={styles.sideMessage}>
					This is the <span class={styles.circle}>fastest</span>{' '}
					service to {searchData.toName}.
				</div>
			</Show>
		</div>
	);
};
