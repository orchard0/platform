import { useSearch } from '../../SearchContext';
import styles from './RecentSearch.module.css';

export const RecentSearch = (props) => {
	const [searchData, setSearchData] = useSearch();
	const from = props.search.fromName;
	const to = props.search.toName;

	const updateSearchInput = () => {
		// change both the searchInput and sort the array so it shows this as the first item
		setSearchData({
			from: props.search.from,
			fromName: from,
			to: props.search.to,
			toName: to,
		});
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
