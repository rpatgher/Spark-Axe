import { Fragment, useState } from 'react';


// ****************** Styles ******************
import styles from './ModalEditCategories.module.css'

const ModalEditCategories = ({closeModal, categories}) => {
    const [subcategories, setSubcategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);




    return (
        <div className={styles["modal-wrapper"]}>
            <div className={styles["modal"]}>
                <button 
                    className={styles["close-modal"]}
                    onClick={closeModal}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
                {subcategories.length <= 0 ? (
                    <Fragment>
                        <h2>Categorías</h2>
                        <hr></hr>
                        <div
                            className={styles.categories}
                        >
                            {categories.map(category => (
                                <div 
                                    key={category.id}
                                    className={styles.category}
                                    onClick={() => {
                                        setSubcategories(category.subcategories)
                                        setCurrentCategory(category.name)
                                    }}
                                >
                                    <h3>{category.name}</h3>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <h2>
                            {" "}
                            <span
                                className={styles.backhead}
                                onClick={() => {
                                    setSubcategories([]);
                                    setCurrentCategory(null);
                                }}
                            >
                                Categorías
                            </span>{" "}
                            / {currentCategory}
                        </h2>
                        <hr></hr>
                        <div
                            className={styles.subcategories}
                        >
                            {subcategories.map(subcategory => (
                                <div 
                                    key={subcategory.id}
                                    className={styles.subcategory}
                                >
                                    <h3>{subcategory.name}</h3>
                                    <div className={styles.buttons}>
                                        <button>
                                            <i className="fa-solid fa-pencil"></i>
                                        </button>
                                        <button>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default ModalEditCategories
