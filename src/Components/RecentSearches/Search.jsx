import { useSearch } from '../../SearchContext';
import styles from './Search.module.css';

export const Search = (props) => {
	const [searchData, setSearchData] = useSearch();
	const from = props.search.from;
	const to = props.search.to;

	const updateSearchInput = () => {
		// change both the searchInput and sort the array so it shows this as the first item
		setSearchData({
			from: from,
			fromName: from,
			to: to,
			toName: to,
		});
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
