
// **************+ Styles +***************
import styles from './ModalCategories.module.css';

const ModalCategories = ({categories, closeModal}) => {
    return (
        <div className={styles["modal-wrapper"]}>
            <div className={styles["modal"]}>
                <button 
                    className={styles["close-modal"]}
                    onClick={closeModal}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
                <h2>Categorías</h2>
                <hr></hr>
                {categories.map((category, index) => (
                    <div key={index} className={styles["category"]}>
                        <h3>{category.category}</h3>
                        <ul className={styles.category}>
                            {category.subcategories.map((subcategory, index) => (
                                <li key={index}>{subcategory}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ModalCategories
