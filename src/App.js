import React, {useEffect, useRef, useState} from 'react';
import './App.css';

const AutoComplete = () => {
    const [display, setDisplay] = useState(false);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

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
            />
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
                                >
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