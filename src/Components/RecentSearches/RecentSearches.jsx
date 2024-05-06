import { Search } from './Search';
import styles from './RecentSearches.module.css';
import { For } from 'solid-js';

export const RecentSearches = () => {
	const recentSearches = JSON.parse(localStorage.getItem('recentSearches'));
	console.log(recentSearches);
	return (
		<div className={styles.content}>
			<h1 class={styles.title}>Recent searches</h1>
			<For each={recentSearches}>
				{(search) => {
					return <Search search={search}></Search>;
				}}
			</For>
		</div>
	);
};
