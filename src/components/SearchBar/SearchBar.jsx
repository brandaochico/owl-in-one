import style from './SearchBar.module.css';
import { SearchIcon } from '../../assets';

const SearchBar = () => {
    return (
        <div className={style.SearchBar}>
            <SearchIcon />
        </div>
    );
};

export { SearchBar };