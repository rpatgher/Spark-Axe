// ************** Styles **************
import styles from '../../styles/Signup.module.css';

const SignupConfirmation = () => {
    return (
        <>
            <div className={styles["signup-confirmation"]}>
                <h2>¡Te has registrado exitosamente!</h2>
                <p>Por favor, revisa tu correo electrónico para confirmar tu cuenta.</p>
            </div>
        </>
    )
}

export default SignupConfirmation;
