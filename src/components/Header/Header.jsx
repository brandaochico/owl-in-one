import style from './Header.module.css';

const Header = (props) => {

    const { name } = props;

    return (
        <div className={style.Header}>
            <h1>
                {name}
            </h1>
        </div>
    );

};

export { Header };