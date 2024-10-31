import style from './Header.module.css';
import logo from '../../assets/logo.jpg';
import { Placeholder } from '../Placeholder';
import { SearchBar } from '../SearchBar';

const Header = () => {
    
    return (
        <div className={style.Header}>
            <img src={logo} id="logo" />
            <SearchBar />
            <Placeholder />
        </div>
    );

};

export { Header };