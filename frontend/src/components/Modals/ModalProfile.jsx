

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
                <h2>Configuracion de perfil</h2>
                <p>Nombre</p>
                <p>Correo</p>
                <p>Numero telefonico</p>
                <p>Contraseña</p>
                <p>Cambiar contraseña</p>
                <p>Avatar</p>
                <p>Websites</p>
                <form 
            className={styles.body}
        >
            <div className={styles.field}>
                    <label htmlFor="">Tu Nombre</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`Nombre completo`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Correo</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`ejemplo@correo.com`}
            
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="">Numero de telefono</label>
                    <input 
                        type="" 
                        id="" 
                        name="" 
                        placeholder={`dominio.com`}
            
                    />
                </div>
                <p>Cambiar contraseña</p>
                
                </form>
            </div>
        </div>
    )
}

export default ModalProfile
