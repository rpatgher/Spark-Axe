import { Link } from 'react-router-dom'

import styles from '../styles/Forgot.module.css'

const Forgot = () => {
    return (
        <>
            <h1 className={styles.heading}>Reestablece tu Contraseña</h1>
            <p className={styles.description}>Ingresa tu email para reestablecer tu contraseña</p>
            <form className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="Ingresa tu correo electrónico" 
                    />
                </div>
                
                <input 
                    className={styles.submit}
                    type="submit" 
                    value="Enviar Instrucciones"
                />
            </form>
            <div>
                <p className={styles.actions}>¿No tienes cuenta? <Link to="/signup">Crea una</Link></p>
                <p className={styles.actions}>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
            </div>
        </>
    )
}

export default Forgot
