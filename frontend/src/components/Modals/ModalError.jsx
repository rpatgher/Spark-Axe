
// ************** Styles **************
import styles from './ModalError.module.css';

// **************** Hooks ****************
import useApp from '../../hooks/useApp';

const ModalError = () => {
    const { showModal, closeModalError, screenshotImage } = useApp();
    return (
        <div className={styles.body}>
            <div className={`${styles.container} ${showModal ? styles.show : styles.hide}`}>
                <i className="fa-solid fa-xmark" onClick={closeModalError}></i>
                <form className={styles.form}>
                    <label htmlFor="error">Describe el error</label>
                    <textarea 
                        id="error" 
                        name="error" 
                        required
                    />
                    {screenshotImage && 
                        <img 
                            id="screenshotImage" 
                            alt="Website Screenshot"
                            src={screenshotImage} 
                        />
                    }
                <p className={styles.description}>
                    Si una función o producto no está funcionando correctamente, puedes proporcionar comentarios para ayudarnos a mejorar Velasci. </p>
                    <button 
                        type="submit"
                    >Marcar error</button>
                </form>
            </div>
        </div>
    )
}

export default ModalError
