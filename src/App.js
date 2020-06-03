import React, {useEffect, useState} from 'react';
import './App.css';

const AutoComplete = () => {
    const [display, setDisplay] = useState(false);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

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


    return (
        <div className='lex-container flex-column pos-rel'>
            <input id='auto' placeholder='Type something to search'/>
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