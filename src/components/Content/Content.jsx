import style from './Content.module.css';

const Content = (props) => {

    const { children } = props;
    
    return (
        <div className={style.Content}>
            {children}
        </div>
    );

};

export { Content };