import { useEffect, useState } from 'react';


// ***************** Styles *************
import styles from './GeneralModal.module.css';

const GeneralModal = ({ modalActive,  actionModal, text, actionBtnText, actionBtnLoadingText}) => {
    const [onAction, setOnAction] = useState(false);

    const [show, setShow] = useState(false);

    useEffect(() => {
        const showModal = () => {
            setTimeout(() => {
                setShow(true);
            }, 300);
        }
        return () => showModal();
    }, []);


    
    return (
        <div className={styles.modal}>
            <div className={`${styles["modal-content"]} ${show ? styles.show : ''}`}>
                <h3>{text}</h3>
                <div className={styles.buttons}>
                    <button
                        className={styles.cancel}
                        type='button'
                        onClick={() => {
                            setShow(false);
                            setTimeout(() => {
                                modalActive(false)
                            }, 300);
                        }}
                    >Cancelar</button>
                    <button
                        className={`${styles.delete} ${onAction ? styles.active : ''}`}
                        type='button'
                        onClick={() => {
                            setOnAction(true);
                            actionModal();
                        }}
                        disabled={onAction}
                    >{onAction ? actionBtnLoadingText || "Loading..." : actionBtnText || "Action"}</button>
                </div>
            </div>
        </div>
    )
}

export default GeneralModal
