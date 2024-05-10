import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

const SearchContext = createContext();

export const SearchProvider = (props) => {
	const [searchData, setSearchData] = createStore({
		from: null,
		to: null,
		fromName: null,
		toName: null,
	});

	return (
		<SearchContext.Provider value={[searchData, setSearchData]}>
			{props.children}
		</SearchContext.Provider>
	);
};

export const useSearch = () => {
	return useContext(SearchContext);
};
