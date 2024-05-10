import { Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

import styles from './RailService.module.css';

export const RailService = (props) => {
	const [styling, setStyling] = createStore({
		alteration: false,
		type: null,
		message: null,
		msgStyles: [],
		containerStyles: [],
	});

	createEffect(() => {
		if (props.departures.cancelReason) {
			setStyling({
				message: props.departures.cancelReason,
				msgStyles: [styles.reason, styles.cancelReason],
				containerStyles: [styles.cancelled, styles.msgAbove],
			});
		} else if (props.departures.delayReason) {
			setStyling({
				message: props.departures.delayReason,
				msgStyles: [styles.reason, styles.delayReason],
				containerStyles: [styles.delay, styles.msgAbove],
			});
		} else if (props.departures.etd === 'Cancelled') {
			setStyling({
				message: 'This train has been cancelled.',
				msgStyles: [styles.reason, styles.cancelReason],
				containerStyles: [styles.cancelled, styles.msgAbove],
			});
		} else if (props.departures.etd !== 'On time') {
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
	});
	return (
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
					styles.container + ' ' + styling.containerStyles.join(' ')
				}>
				<div class={styles.time}>{props.departures.std}</div>

				{styling.message ? (
					<p class={styles.timeLate}>{props.departures.etd}</p>
				) : (
					<div class={styles.ontime}>
						<img src="./src/assets/check.svg" alt="" />
						{props.departures.etd}
					</div>
				)}

				<div class={styles.img}>
					<img src="./src/assets/train.svg" alt="" />
				</div>
				<div class={styles.station}>{props.departures.destination}</div>
				<Show when={props.departures.platform}>
					{' '}
					<div class={styles.platform}>
						<p class={styles.plat}>Platform</p>
						<p class={styles.number}>{props.departures.platform}</p>
					</div>
				</Show>
			</div>
		</div>
	);
};
