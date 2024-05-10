// ******************** Styles ********************
import styles from './GoTopBtn.module.css';

const GoTopBtn = () => {
    
    const handleGoTop = () => {
        const top = document.querySelector('main');
        top.scroll({ 
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <button
            className={styles["go-top"]}
            onClick={handleGoTop}
        >
            <i className="fa-solid fa-arrow-up"></i>
        </button>
    )
}

export default GoTopBtn;
