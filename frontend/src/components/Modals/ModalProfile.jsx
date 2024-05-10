

// **************** Hooks ****************
import useAuth from "../../hooks/useAuth";

// **************** Styles ****************
import styles from './ModalProfile.module.css';

const ModalProfile = () => {
    const { auth, setProfileModal } = useAuth();
    return (
        <div className={styles["modal-wrapper"]}>
            <div className={styles["modal-profile"]}>
                <button 
                    className={styles["close-modal"]}
                    onClick={() => setProfileModal(false)}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
                
            </div>
        </div>
    )
}

export default ModalProfile
