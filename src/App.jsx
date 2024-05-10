import styles from './App.module.css';
import { InputForm } from './Components/InputForm/InputForm';
import { RecentSearches } from './Components/RecentSearches/RecentSearches';
import { SearchProvider } from './SearchContext';
function App() {
	return (
		<SearchProvider>
			<div class={styles.App}>
				<InputForm />
				<RecentSearches />
			</div>
		</SearchProvider>
	);
}

export default App;
