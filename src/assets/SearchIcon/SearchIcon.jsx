import style from './SearchIcon.module.css';

const SearchIcon = () => {
    return (
        <svg
            className={style.SearchIcon}
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="Capa_1"
            width="16"
            height="16"
            x="0"
            y="0"
            version="1.1"
            viewBox="0 0 513.749 513.749"
            fill="var(--white)"
        >
            <path d="m504.352 459.061-99.435-99.477c74.402-99.427 54.115-240.344-45.312-314.746S119.261-9.277 44.859 90.15-9.256 330.494 90.171 404.896c79.868 59.766 189.565 59.766 269.434 0l99.477 99.477c12.501 12.501 32.769 12.501 45.269 0s12.501-32.769 0-45.269zm-278.635-73.365c-88.366 0-160-71.634-160-160s71.634-160 160-160 160 71.634 160 160c-.094 88.326-71.673 159.906-160 160"></path>
        </svg>
    );
};

export { SearchIcon }; 