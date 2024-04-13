import { useEffect } from 'react';


// ************** Hooks **************
import useSignup from '../../hooks/useSignup';

// ************** Styles **************
import styles from '../../styles/Signup.module.css';

// ***************** Components *****************
import BtnNext from '../Btns/BtnNext';

// ************** Images **************
import google from '../../assets/img/google.png'


const SignupStepOne = () => {
    const { user, handleChange, continueBtn1,  setContinueBtn1} = useSignup();

    useEffect(() => {
        const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if([user.name, user.lastname, user.email].includes('') || !validEmail.test(user.email)){
            setContinueBtn1(false);
            return;
        }
        setContinueBtn1(true);
    }, [user.name, user.lastname, user.email]);

    return (
        <>
            <div className={styles["google-btn"]}>
                <div className={styles["google-icon"]}>
                    <img src={google} alt="Logo Google" />
                </div>
                <p>Registrarme con Google</p>
            </div>
            <div className={styles.field}>
                <label htmlFor="name">Nombre(s)</label>
                <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    placeholder="Ingresa tu nombre"
                    onChange={handleChange}
                    value={user.name}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="lastname">Apellido(s)</label>
                <input 
                    type="text" 
                    name="lastname" 
                    id="lastname" 
                    placeholder="Ingresa tu apellido" 
                    onChange={handleChange}
                    value={user.lastname}
                />
            </div>
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
            <BtnNext
                disabled={!continueBtn1}
            />
        </> 
    )
}

export default SignupStepOne
