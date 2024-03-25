import { useState } from "react";

// ************** Hooks **************
import useSignup from '../hooks/useSignup';

// ************** Styles **************
import styles from '../styles/Signup.module.css'

// ***************** Components *****************
import BtnNext from './BtnNext';

const SignupStepFour = () => {
    const { user, handleRole } = useSignup();

    const [continueBtn, setContinueBtn] = useState(false);

    return (
        <>
            <div className={styles["account-types"]}>
                <button 
                    type="button"
                    value="programmer"
                    name="role"
                    className={`${styles["account-type"]} ${user.role === 'programmer' ? styles['account-type-active'] : ''}`}
                    onClick={handleRole}
                >
                    <i className="fa-solid fa-code"></i>
                    Crear cuenta de programador
                </button>
                <button 
                    type="button"
                    value="admin"
                    name="role"
                    className={`${styles["account-type"]} ${user.role === 'admin' ? styles['account-type-active'] : ''}`}
                    onClick={handleRole}
                >
                    <i className="fa-solid fa-user-tie"></i>
                    Crear cuenta de administrador
                </button>
            </div>
            <BtnNext
                disabled={!continueBtn}
            />
        </>
    )
}

export default SignupStepFour
