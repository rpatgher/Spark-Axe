import { useEffect, useState } from 'react';

// **************+ Styles +***************
import styles from './ModalCategories.module.css';

const ModalStates = ({ states, closeModal }) => {
    const [stateActive, setStateActive] = useState(null); // Initially, no state is active
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Show the modal after 300ms delay
        const showModal = () => {
        setTimeout(() => {
            setShow(true);
        }, 300);
        };
        showModal();
    }, []);

    const unshowModal = () => {
        // Hide the modal with a delay
        setShow(false);
        setTimeout(() => {
        closeModal();
        }, 300);
    };

    const handleStateClick = (singleState) => {
        // Toggle the state, if clicked again, close the active state
        setStateActive((prevState) =>
        prevState?.id === singleState.id ? null : singleState
        );
    };

    return (
        <div className={styles['modal-wrapper']}>
        <div className={`${styles['modal']} ${show ? styles.show : ''}`}>
            <button className={styles['close-modal']} onClick={unshowModal}>
            <i className="fa-solid fa-times"></i>
            </button>
            <h2>Estados</h2>
            <hr className={styles.divider} />
            <div className={styles.categories}>
            {states.map((singleState, index) => (
                <div
                className={`${styles['category-container']} ${
                    stateActive?.id === singleState.id ? styles['category-active'] : ''
                }`}
                key={index}
                onClick={() => handleStateClick(singleState)}
                >
                <div className={styles['category']}>
                    <h3>{singleState.name}</h3>
                    {stateActive?.id === singleState.id ? (
                    <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                    <i className="fa-solid fa-chevron-down"></i>
                    )}
                </div>

                {stateActive?.id === singleState.id && (
                    <div className={styles['subcategories']}>
                    {singleState.cities.map((city, idx) => (
                        <p key={idx} className={styles.subcategory}>
                        {city.name}
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

export default ModalStates;
