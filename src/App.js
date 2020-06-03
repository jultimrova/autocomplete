import React, {useEffect, useRef, useState} from 'react';
import {useDebounce} from 'use-debounce';
import './App.css';

const AutoComplete = () => {
    const [display, setDisplay] = useState(false);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [highlightedId, setHighlightedId] = useState(0);
    const wrapperRef = useRef(null);

    const debouncedSearchTerm = useDebounce(search, 500);

    useEffect(() => {
        const pokemon = [];
        const promises = new Array(35)
            .fill()
            .map((v, i) => fetch(`https://pokeapi.co/api/v2/pokemon-form/${i + 1}`));

        Promise.all(promises).then(pokemonArray => {
            return pokemonArray.map(res =>
                res.json().then(({name, sprites: {front_default: sprite}}) =>
                    pokemon.push({name, sprite})
                )
            );
        });

        setData(pokemon);
    }, []);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleKeyDown = (event) => {
        const UP = 38;
        const DOWN = 40;
        const ENTER = 13;
        const INITIAL_ID = 0;

        if (event.keyCode === DOWN) {
            event.preventDefault();

            const id = highlightedId;
            const nextId = id !== undefined ? id + 1 : INITIAL_ID;

            if (nextId < data.length) {
                setHighlightedId(nextId);
            } else setHighlightedId(INITIAL_ID);
        }

        if (event.keyCode === UP) {
            event.preventDefault();

            const lastId = data.length - 1;
            const id = highlightedId;
            const prevId = id !== undefined ? id - 1 : lastId;

            if (prevId >= 0) {
                setHighlightedId(prevId);
            } else setHighlightedId(lastId);
        }

        if (event.keyCode === ENTER && highlightedId !== undefined) {
            setPokemonSearch(highlightedId);
        }
    }

    const handleClickOutside = event => {
        const {current: wrap} = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplay(false);
        }
    };

    const setPokemonSearch = (poke) => {
        setSearch(poke);
        setDisplay(false);
    }

    const onChangeSearch = event => {
        setSearch(event.target.value)
    }

    const onClickDisplay = () => {
        setDisplay(!display);
    }

    return (
        <div ref={wrapperRef} className='lex-container flex-column pos-rel'>
            <input id='auto'
                   placeholder='Type something to search'
                   value={search}
                   onClick={onClickDisplay}
                   onChange={onChangeSearch}
                   onKeyDown={handleKeyDown}
            />

            {isSearching && <div>Searching...</div>}

            {display && (
                <div className='autocompleteContainer'>
                    {data
                        .filter(({name}) => name.indexOf(search.toLowerCase()) > -1)
                        .map((value, id) => {
                            return (
                                <div className='data'
                                     key={id}
                                     tabIndex='0'
                                     onClick={() => setPokemonSearch(value.name)}
                                     aria-selected={highlightedId === id}>
                                    <span>{value.name}</span>
                                    <img src={value.sprite} alt="pokemon"/>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

const App = () => {
    return (
        <div className='App'>
            <div>
                <h2><i className='fa fa-search' aria-hidden='true'></i> Search your pokemon</h2>
            </div>
            <div className='autocomplete-container'>
                <AutoComplete/>
            </div>
        </div>
    );
}

export default App;