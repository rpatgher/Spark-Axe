import { Link } from 'react-router-dom'
import { SignupProvider } from '../providers/SignupProvider'

// ************** Styles **************
import styles from '../styles/Signup.module.css'

// ***************** Components *****************
import FormSignup from '../components/FormSignup';


const Signup = () => {

    return (
        <SignupProvider>
              <Link
                        className={styles.exit}
                        to="/"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </Link>
            <div className={styles.content}>
                <h1 className={styles.heading}>Registrarse</h1>
                <p className={styles.actions}>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
                <FormSignup />
            </div>
            
        </SignupProvider>
    )
}

export default Signup
