import styles from './App.module.css';
import { InputForm } from './Components/InputForm/InputForm';
import { RecentSearches } from './Components/RecentSearches/RecentSearches';
import { RecentSearchProvider } from './RecentSearchesContext';
import { SearchProvider } from './SearchContext';
function App() {
	return (
		<RecentSearchProvider>
			<SearchProvider>
				<div class={styles.App}>
					<InputForm />
					<RecentSearches />
				</div>
			</SearchProvider>
		</RecentSearchProvider>
	);
}

export default App;
