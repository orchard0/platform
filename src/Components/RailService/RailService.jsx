import { Show, createEffect, createSignal } from 'solid-js';
import styles from './RailService.module.css';
import { createStore } from 'solid-js/store';

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
				type: 'Cancelled',
				etd: props.departures.etd,

				message: props.departures.cancelReason,
				msgStyles: [styles.reason, styles.cancelReason],
				containerStyles: [styles.cancelled],
			});
		} else if (props.departures.delayReason) {
			setStyling({
				type: 'Delayed',
				etd: props.departures.etd,

				message: props.departures.delayReason,
				msgStyles: [styles.reason, styles.delayReason],
				containerStyles: [styles.delay],
			});
		} else if (props.departures.etd === 'Cancelled') {
			setStyling({
				type: 'Cancelled',
				etd: props.departures.etd,
				containerStyles: [styles.cancelled],
			});
		}
		// else if (props.departures.etd === 'Delayed') {
		// 	setStyling({
		// 		type: 'Cancelled',
		// 		style: [styles.cancelled],
		// 	});
		// }
		else if (props.departures.etd !== 'On time') {
			setStyling({
				type: 'Delayed',
				etd: props.departures.etd,
				containerStyles: [styles.delay],
			});
		}
	});
	return (
		<div class={styles.section}>
			<Show when={styling.message}>
				<div class={styling.msgStyles.join(' ')}>{styling.message}</div>
			</Show>
			<div
				class={`${styles.container} + ${styling.containerStyles.join(
					' '
				)}`}>
				<div class={styles.time}>{props.departures.std}</div>
				{styling.type ? (
					<p class={styles.timeLate}>{styling.etd}</p>
				) : (
					''
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