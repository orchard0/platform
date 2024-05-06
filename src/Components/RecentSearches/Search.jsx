import styles from './Search.module.css';

export const Search = (props) => {
	const from = props.search.from;
	const to = props.search.to;

	const updateSearchInput = () => {
		// change both the searchInput and sort the array so it shows this as the first item
		console.log(from, to);
	};
	return (
		<div
			class={styles.search}
			onClick={() => {
				updateSearchInput();
			}}>
			<p>
				{from} -> {to}
			</p>
		</div>
	);
};
