import { useState } from 'react';

// **************+ Styles +***************
import styles from './ModalCategories.module.css';

const ModalCategories = ({categories, closeModal}) => {
    const [categoryActive, setCategoryActive] = useState(null);

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
                    <div 
                        className={`${styles["category-container"]} ${categoryActive?.category === category.category ? styles['category-active'] : ''}`}
                        key={index}
                        onClick={() => {
                            if (categoryActive === null || categoryActive?.id !== category.id) {
                                setCategoryActive(category);
                            } else {
                                setCategoryActive(null);
                            }
                        }}
                    >
                        <div className={`${styles["category"]}`}>
                            <h3>{category.category}</h3>
                            {categoryActive !== null && categoryActive.category === category.category ? (
                                <i className="fa-solid fa-chevron-up"></i>
                            ) : (
                                <i className="fa-solid fa-chevron-down"></i>
                            )}
                        </div>
                        {categoryActive !== null && categoryActive.category === category.category &&
                            <div
                                className={styles["subcategories"]}
                            >
                                {category.subcategories.map((subcategory, index) => (
                                    <p 
                                    key={index}
                                        className={styles.subcategory}    
                                    >{subcategory}</p>
                                ))}
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ModalCategories
