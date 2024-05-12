import { useRecentSearch } from '../../RecentSearchesContext';
import { RecentSearch } from './RecentSearch';
import styles from './RecentSearches.module.css';
import { For } from 'solid-js';

export const RecentSearches = () => {
	const [recentSearches, setRecentSearches] = useRecentSearch();
	return (
		<div className={styles.content}>
			<h1 class={styles.title}>Recent searches</h1>
			<For each={recentSearches}>
				{(search) => {
					return <RecentSearch search={search}></RecentSearch>;
				}}
			</For>
		</div>
	);
};
