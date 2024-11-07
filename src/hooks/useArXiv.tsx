import { useQuery } from 'react-query';

export type SearchParams = {
    searchQuery: string;
    start?: string;
    maxResults?: string;
    sortBy?: string;
    sortOrder?: 'ascending' | 'descending';
}

export type ResearchAbstract = {
    id: string;
    title: string;
    summary: string;
    authors: string[];
    link: string;
};

const fetchData = (
    searchParams: SearchParams, 
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => async () => {
    const {
        searchQuery, start = '0', maxResults = '10',
    } = searchParams;
    const queryParams = `search_query=${searchQuery}&start=${start}&max_results=${maxResults}`;
    const res = await fetch(`https://martinluigiquang.pythonanywhere.com/api/v1/search?${queryParams}`);
    const searchResults = await res.json();
    setLoading(false);
    return searchResults;
};

export const useArXiv = (
    searchParams: SearchParams, 
    enabled: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => (
    useQuery<ResearchAbstract[]>({ queryKey: 'arXivData', queryFn: fetchData(searchParams, setLoading), enabled })
);
