import { useEffect, useState } from 'react';

// **************+ Styles +***************
import styles from './ModalCategories.module.css';

const ModalCategories = ({ categories, closeModal }) => {
  const [categoryActive, setCategoryActive] = useState(null); // Initially, no category is active
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show the modal after 300ms delay
    const showModal = () => {
      setTimeout(() => {
        setShow(true);
      }, 300);
    };
    showModal();

    return () => {}; // Cleanup function is empty, no dependencies
  }, []);

  const unshowModal = () => {
    // Hide the modal with a delay
    setShow(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  const handleCategoryClick = (category) => {
    // Toggle the category, if clicked again, close the active category
    setCategoryActive((prevState) =>
      prevState?.id === category.id ? null : category
    );
  };

  return (
    <div className={styles['modal-wrapper']}>
      <div className={`${styles['modal']} ${show ? styles.show : ''}`}>
        <button className={styles['close-modal']} onClick={unshowModal}>
          <i className="fa-solid fa-times"></i>
        </button>
        <h2>Categorías</h2>
        <hr className={styles.divider} />
        <div className={styles.categories}>
          {categories.map((category, index) => (
            <div
              className={`${styles['category-container']} ${
                categoryActive?.id === category.id ? styles['category-active'] : ''
              }`}
              key={index}
              onClick={() => handleCategoryClick(category)}
            >
              <div className={styles['category']}>
                <h3>{category.category}</h3>
                {categoryActive?.id === category.id ? (
                  <i className="fa-solid fa-chevron-up"></i>
                ) : (
                  <i className="fa-solid fa-chevron-down"></i>
                )}
              </div>

              {categoryActive?.id === category.id && (
                <div className={styles['subcategories']}>
                  {category.subcategories.map((subcategory, index) => (
                    <p key={index} className={styles.subcategory}>
                      {subcategory}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalCategories;
