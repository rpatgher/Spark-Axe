import { Link } from 'react-router-dom'
import { LoginProvider } from '../providers/LoginProvider';

// ************** Styles **************
import styles from '../styles/Login.module.css'

// ***************** Components *****************
import FormLogin from "../components/FormLogin";

// ************** Images **************
import google from '../assets/img/google.png'

const Login = () => {
    return (
        <LoginProvider>
            <h1 className={styles.heading}>Iniciar Sesión</h1>
            <p className={styles.description}>Ingresa tus credenciales para acceder a tu cuenta</p>
            <div className={styles["google-btn"]}>
                <div className={styles["google-icon"]}>
                    <img src={google} alt="Logo Google" />
                </div>
                <p>Iniciar Sesión con Google</p>
            </div>
            <FormLogin />
            <p className={styles.actions}>¿No tienes cuenta? <Link to="/signup">Crea una</Link></p>
            <p className={styles.actions}>¿Olvidaste tu contraseña? <Link to="/forgot-password">Reestablécela</Link></p>
        </LoginProvider>
    )
}

export default Login
