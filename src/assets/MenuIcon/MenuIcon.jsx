import style from './MenuIcon.module.css';

const MenuIcon = ({ onClick }) => {
    return (
        <div className={style.MenuIcon} onClick={onClick}>
            <svg 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32" 
                height="32"
                fill="var(--white)"
                className={style.svgIcon}
            >
                <rect y="11" width="24" height="2" rx="1"/>
                <rect y="4" width="24" height="2" rx="1"/>
                <rect y="18" width="24" height="2" rx="1"/>
            </svg>
        </div>
    );
};

export default MenuIcon;