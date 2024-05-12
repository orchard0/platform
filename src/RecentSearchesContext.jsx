import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

const RecentSearchContext = createContext();

export const RecentSearchProvider = (props) => {
	const loadedData = JSON.parse(localStorage.getItem('recentSearches')) || [];
	const [recentSearches, setRecentSearches] = createStore(loadedData);

	return (
		<RecentSearchContext.Provider
			value={[recentSearches, setRecentSearches]}>
			{props.children}
		</RecentSearchContext.Provider>
	);
};

export const useRecentSearch = () => {
	return useContext(RecentSearchContext);
};
