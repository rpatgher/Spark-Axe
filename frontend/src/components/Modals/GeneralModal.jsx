import styles from './GeneralModal.module.css';

const GeneralModal = ({ modalActive,  actionModal, text}) => {
    return (
        <div className={styles.modal}>
            <div className={styles["modal-content"]}>
                <h3>{text}</h3>
                <div className={styles.buttons}>
                    <button
                        className={styles.cancel}
                        type='button'
                        onClick={() => modalActive(false)}
                    >Cancelar</button>
                    <button
                        className={styles.delete}
                        type='button'
                        onClick={actionModal}
                    >Eliminar</button>
                </div>
            </div>
        </div>
    )
}

export default GeneralModal
