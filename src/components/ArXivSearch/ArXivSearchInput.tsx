import { useCallback } from 'react';
import { Select, MenuItem, Button, OutlinedInput } from '@mui/material';
import { SearchParams } from '../../hooks/useArXiv';
import './ArXivSearchInput.scss';

type CustomChangeEvent = { target: { value: string; } };

type ComponentProps = {
    searchParams: SearchParams;
    isSearchEnabled: boolean;
    updateSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
    enableSearch: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedArticles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ArXivSearchInput(props: ComponentProps) {
    const { 
        searchParams, isSearchEnabled, updateSearchParams, 
        enableSearch, setSelectedArticles, setLoading,
    } = props;
    const { searchQuery, maxResults } = searchParams;

    const handleSearchParamsUpdate = useCallback(
        (fieldName: keyof SearchParams) => <T extends CustomChangeEvent>(e: T) => {
            updateSearchParams((prev) => ({
                ...prev,
                [fieldName]: e.target.value,
            }));
        },
        [],
    );

    const handleEnableSearch = useCallback(
        () => { 
            setLoading(true);
            enableSearch(true); 
            setSelectedArticles({});
        }, 
        [],
    );

    return (
        <div className="search-inputs">
            <form className="search-inputs--form" onSubmit={(e) => { e.preventDefault(); }}>
                <label htmlFor="search-term">Search term:</label>
                <OutlinedInput 
                    id="search-term" 
                    className="search-inputs--search-term"
                    type="text"
                    value={searchQuery ?? ''}
                    onChange={handleSearchParamsUpdate('searchQuery')} 
                />
                <label htmlFor="max-results">Max results:</label>
                <Select 
                    id="max-results"
                    className="search-inputs--max-results" 
                    value={maxResults ?? '10'} 
                    onChange={handleSearchParamsUpdate('maxResults')}
                >
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="50">30</MenuItem>
                    <MenuItem value="100">50</MenuItem>
                </Select>
                <Button 
                    className="search-inputs--search-button"
                    type="submit" 
                    onClick={handleEnableSearch} 
                    disabled={isSearchEnabled}
                >
                    Search
                </Button>
            </form>
        </div>
    );
}
