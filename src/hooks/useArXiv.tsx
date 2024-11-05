import { useQuery } from 'react-query';
import dotenv from 'dotenv';

dotenv.config();

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

const fetchData = (searchParams: SearchParams) => async () => {
    const {
        searchQuery, start = '0', maxResults = '10',
    } = searchParams;
    const queryParams = `search_query=${searchQuery}&start=${start}&max_results=${maxResults}`;
    const res = await fetch(`${process.env.ARXIV_SERVER_URL}?${queryParams}`);
    return await res.json();
};

export const useArXiv = (searchParams: SearchParams, enabled: boolean) => (
    useQuery<ResearchAbstract[]>({ queryKey: 'arXivData', queryFn: fetchData(searchParams), enabled })
);
