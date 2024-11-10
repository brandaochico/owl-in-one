// Estilos
import style from './SearchBar.module.css';

// Componentes
import { SearchIcon } from '../../assets';
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        if (onSearch) onSearch(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className={style.searchBar}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Pesquisar cursos"
                className={style.searchInput}
            />
            <button onClick={handleSearch} className={style.searchButton}>
                <SearchIcon />
            </button>
        </div>
    );
};

export default SearchBar;
