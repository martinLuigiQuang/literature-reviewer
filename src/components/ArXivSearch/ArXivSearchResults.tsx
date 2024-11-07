import React, { useCallback, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ResearchAbstract, SearchParams, useArXiv } from '../../hooks/useArXiv';
import AiAssistantContainer from '../AiAssitant/AiAssistantContainer';
import './ArXivSearchResults.scss';

type ComponentProps = {
    searchParams: SearchParams;
    selectedArticles: Record<string, boolean>;
    isSearchEnabled: boolean;
    isLoading: boolean;
    enableSearch: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedArticles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ArXivSearchResults(props: ComponentProps) {
    const { 
        searchParams, selectedArticles, isSearchEnabled, isLoading,
        enableSearch, setSelectedArticles, setLoading,
    } = props;
    const { data } = useArXiv(searchParams, isSearchEnabled, setLoading);

    useEffect(() => { enableSearch((prev) => isSearchEnabled ? false : prev); }, [isSearchEnabled]);

    const handleArticleSelection = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedArticles((prev) => ({
                ...prev,
                [e.target.value]: !prev[e.target.value],
            }))
        },
        [],
    );

    const getSelectedArticles = useCallback(
        (selectedArticles: Record<string, boolean>, data: ResearchAbstract[] = []) => (
            data.filter((paper) => selectedArticles[paper.id])
        ),
        [],
    );

    return (
        <div className="search-results">
            <div className="search-results--abstracts-container">
                {isLoading ? <CircularProgress className="search-results--loading-spinner" /> : (
                    data?.map((paper) => (
                        <div className="search-results--abstract" key={paper.id}>
                            <div className="search-results--abstract-title">
                                <a href={paper.link} target="_blank">{paper.title}</a>
                                <p className="search-results--authors">{paper.authors.join(', ')}</p>
                            </div>
                            <p className="search-results--abstract-text">{paper.summary}</p>
                            <input className="search-results--abstract-select" type="checkbox" value={paper.id} checked={selectedArticles[paper.id] ?? false} onChange={handleArticleSelection}/>
                        </div>
                    )) ?? null
                )}
            </div>
            <AiAssistantContainer selectedArticles={getSelectedArticles(selectedArticles, data)} />
        </div>
    )
}
