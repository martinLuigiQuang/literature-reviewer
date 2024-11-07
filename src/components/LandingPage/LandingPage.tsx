import { useState } from 'react';
import { SearchParams } from '../../hooks/useArXiv';
import ArXivSearchInput from '../ArXivSearch/ArXivSearchInput';
import ArXivSearchResults from '../ArXivSearch/ArXivSearchResults';
import './LandingPage.scss';

export default function LandingPage() {
    const [searchParams, updateSearchParams] = useState<SearchParams>({ searchQuery: '' });
    const [isLoading, setLoading] = useState(false);
    const [isSearchEnabled, enableSearch] = useState(false);
    const [selectedArticles, setSelectedArticles] = useState<Record<string, boolean>>({});

    return (
        <div className="home-page" data-testid="home-page">
            <div className="home-page--header" data-testid="home-page--header">
                <h1 className="home-page--title" data-testid="home-page--title">Literature Reviewer</h1>
                <div className="home-page--acknowledgement" data-testid="home-page--acknowledgement">
                    <p className="home-page--acknowledgement-text" data-testid="home-page--acknowledgement-text">Thank you to arXiv for use of its open access interoperability.</p>
                </div>
                <ArXivSearchInput 
                    searchParams={searchParams}
                    isSearchEnabled={isSearchEnabled}
                    updateSearchParams={updateSearchParams}
                    enableSearch={enableSearch}
                    setSelectedArticles={setSelectedArticles}
                    setLoading={setLoading}
                />
            </div>
            <ArXivSearchResults 
                searchParams={searchParams}
                selectedArticles={selectedArticles}
                isSearchEnabled={isSearchEnabled}
                isLoading={isLoading}
                enableSearch={enableSearch}
                setSelectedArticles={setSelectedArticles}
                setLoading={setLoading}
            />
        </div>
    );
}
