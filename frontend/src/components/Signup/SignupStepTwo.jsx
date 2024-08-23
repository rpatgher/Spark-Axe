import { useEffect } from 'react';

// ************** Hooks **************
import useSignup from '../../hooks/useSignup';

// ************** Styles **************
import styles from '../../styles/Signup.module.css'

// ***************** Components *****************
import BtnNext from '../Btns/BtnNext';

const SignupStepTwo = () => {
    const { 
        user, 
        handleChange,
        characters,
        number,
        uppercase,
        lowercase,
        special,
        handlePassword,
        barpercentage,
        passwordsCheck,
        handlePassword2,
        continueBtn2,
        setContinueBtn2,
        hidePassword,
        handleHidePassword,
        handleSubmit,
        loading
    } = useSignup();


    useEffect(() => {
        if([user.password, user.password2, user.phone].includes('') || !passwordsCheck || barpercentage < 100){
            setContinueBtn2(false);
            return;
        }
        setContinueBtn2(true);
    }, [user.password, user.password2, user.phone]);


    return (
        <>
            <div className={styles.field}>
                <div className={styles.security}>
                    <label htmlFor="password">Contraseña</label>
                    <div 
                        className={styles['security-bar']}
                    >
                        <div style={{
                            width: `${barpercentage}%`,
                            backgroundColor: `${barpercentage  < 33 ? 'var(--red)' : barpercentage < 66 ? 'var(--yellow)' : 'var(--green)' }`
                        }}></div>
                    </div>
                </div>
                <div className={styles.hide}>
                    <input 
                        type={hidePassword ? "password" : "text"} 
                        name="password" 
                        id="password" 
                        placeholder="Escribe tu contraseña" 
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        onInput={handlePassword}
                        value={user.password}
                    />
                    {hidePassword ? (
                        <i onClick={handleHidePassword} className="fa-solid fa-eye"></i>
                    ) : (
                        <i onClick={handleHidePassword} className="fa-solid fa-eye-slash"></i>
                    )}
                </div>
                <div className={styles.flags}>
                    <div className={`${styles.flag} ${styles['flag-char']} ${characters && styles['flag-active']}`}>
                        <i className="fa-solid fa-circle"></i>
                        <p>Más de 8 caracteres</p>
                    </div>
                    <div className={`${styles.flag} ${styles['flag-num']} ${number && styles['flag-active']}`}>
                        <i className="fa-solid fa-circle"></i>
                        <p>Número</p>
                    </div>
                    <div className={`${styles.flag} ${styles['flag-mayus']} ${uppercase && lowercase && styles['flag-active']}`}>
                        <i className="fa-solid fa-circle"></i>
                        <p>Minúsculas y Mayúsculas</p>
                    </div>
                    <div className={`${styles.flag} ${styles['flag-special']} ${special && styles['flag-active']}`}>
                        <i className="fa-solid fa-circle"></i>
                        <p>Caracter especial</p>
                    </div>
                </div>
            </div>
            <div className={`${styles.field} ${passwordsCheck ? null : styles['error-password']}`}>
                <label htmlFor="password2">Confirmar Contraseña</label>
                <input 
                    type={hidePassword ? "password" : "text"}
                    name="password2" 
                    id="password2" 
                    placeholder="Confirma tu contraseña" 
                    onBlur={(e) => {
                        handlePassword2(e);
                        handleChange(e);
                    }}
                    defaultValue={user.password2}
                />
                {passwordsCheck ? null : <p>Las contraseñas no coinciden</p>}
            </div>
            <div className={styles.field}>
                <label htmlFor="phone">Número de Teléfono</label>
                <input 
                    type="tel" 
                    name="phone" 
                    id="phone" 
                    placeholder="XX-XXXX-XXXX" 
                    onChange={handleChange} 
                    value={user.phone}
                />
            </div>
            <BtnNext
                disabled={!continueBtn2 || loading}
                msg={loading ? 'Registrando...' : 'Registrarme'}
                action={handleSubmit}
            />
        </>
    )
}

export default SignupStepTwo
