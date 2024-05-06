import styles from './App.module.css';
import { InputForm } from './Components/InputForm/InputForm';
import { RecentSearches } from './Components/RecentSearches/RecentSearches';
function App() {
	return (
		<div class={styles.App}>
			<InputForm />
			<RecentSearches />
		</div>
	);
}

export default App;
