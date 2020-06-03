import React from 'react';
import './App.css';

const AutoComplete = () => {
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