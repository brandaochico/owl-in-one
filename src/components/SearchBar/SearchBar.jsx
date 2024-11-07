// Estilos
import style from './SearchBar.module.css';

// Componentes
import { SearchIcon } from '../../assets';

const SearchBar = () => {
    return (
        <div className={style.SearchBar}>
            <SearchIcon />
        </div>
    );
};

export default SearchBar;
