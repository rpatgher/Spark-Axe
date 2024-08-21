import { Link } from 'react-router-dom'


// ************** hooks **************
import useLogin from '../hooks/useLogin'

// ************** Styles **************
import styles from '../styles/Login.module.css'

// ************** Components **************
import Alert from './Alert/Alert';


const FormLogin = () => {
    const { user, handleChange, hidePassword, handleHidePassword, submitLogin, alert, loading } = useLogin();
    
    return (
        <form
            className={styles["form-login"]}
            onSubmit={submitLogin}
        >
            {alert.msg && <Alert error={alert.error} message={alert.msg} />}
            <div className={styles.field}>
                <label htmlFor="email">Correo Electrónico</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="Ingresa tu correo electrónico" 
                    onChange={handleChange}
                    value={user.email}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="password">Contraseña</label>
                <div className={styles.hide}>
                    <input 
                        type={hidePassword ? "password" : "text"} 
                        name="password" 
                        id="password" 
                        placeholder="Escribe tu contraseña" 
                        onChange={handleChange}
                        value={user.password}
                    />
                    {hidePassword ? (
                        <i onClick={handleHidePassword} className="fa-solid fa-eye"></i>
                    ) : (
                        <i onClick={handleHidePassword} className="fa-solid fa-eye-slash"></i>
                    )}
                </div>
                {/* <Link className={styles.forgot} to="/forgot-password">¿Olvidaste tu contraseña?</Link> */}
            </div>
            <div className={styles.rememberme}>
                <input 
                    type="checkbox" 
                    id="info-input" 
                />
                <label htmlFor="info-input">Recordar Información</label>
            </div>
            
            <input 
                className={`${styles.submit} ${loading ? styles.loading : ''}`}
                type="submit" 
                value="Iniciar Sesión"
                disabled={loading}
            />

        </form>
    )
}

export default FormLogin
