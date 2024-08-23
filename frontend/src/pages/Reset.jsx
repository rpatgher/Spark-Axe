import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import clientAxios from '../config/clientAxios';

// ******************** Styles ********************
import styles from '../styles/Reset.module.css';

// ************** Components **************
import Alert from '../components/Alert/Alert';

const Reset = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [alert, setAlert] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        password: '',
        password2: ''
    });

    const [characters, setCharacters] = useState(false); 
    const [number, setNumber] = useState(false);
    const [uppercase, setUppercase] = useState(false);
    const [lowercase, setLowercase] = useState(false);
    const [special, setSpecial] = useState(false);
    const [passwordsCheck, setPasswordsCheck] = useState(true);
    const [barpercentage, setBarPercentage] = useState(0);

    const [hidePassword, setHidePassword] = useState(true);

    const [validToken, setValidToken] = useState(false);



    
    useEffect(() => {
        const validateToken = async () => {
            if(token) {
                setValidToken(true);
                console.log(token);
            }else{
                setValidToken(false);
            }
        }
        return () => validateToken();
    }, [token]);


    const handlePassword = (e) => {
        const password = e.target.value;
        const hasNumber = /\d/;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;
        let percentage = 0;

        if(password.length >= 8) {
            setCharacters(true);
            percentage += 25;
        } else {
            setCharacters(false);
        }
        if(hasNumber.test(password)) {
            setNumber(true);
            percentage += 25;
        }else{
            setNumber(false);
        }
        if(hasUppercase.test(password)) {
            setUppercase(true);
            percentage += 12.5;
        }else{
            setUppercase(false);
        }
        if(hasLowercase.test(password)) {
            setLowercase(true);
            percentage += 12.5;
        }else{
            setLowercase(false);
        }
        if(hasSpecial.test(password)) {
            setSpecial(true);
            percentage += 25;
        }else{
            setSpecial(false);
        }
        setBarPercentage(percentage);
    }

    const handlePassword2 = (e) => {
        if(e.target.value === user.password) {
            setPasswordsCheck(true);
        }else{
            setPasswordsCheck(false);
        }
    }

    const handleHidePassword = () => {
        setHidePassword(!hidePassword);
    }

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(user.password === '' || user.password2 === '') {
            setLoading(false);
            setAlert({
                error: true,
                msg: 'Todos los campos son obligatorios'
            });
            return;
        }
        if(user.password !== user.password2) {
            setLoading(false);
            setAlert({
                error: true,
                msg: 'Las contraseñas no coinciden'
            });
            return;
        }
        try {
            const response = await clientAxios.post(`/api/users/reset`, { password: user.password, token });
            if(response.status === 200) {
                setAlert({
                    error: false,
                    msg: 'Tu contraseña ha sido actualizada'
                });
                setUser({
                    password: '',
                    password2: ''
                });
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setAlert({
                error: true,
                msg: 'Hubo un error. Intenta de nuevo'
            });
        }
    }


    return (
        <>
            <h1 className={styles.heading}>Reestablece tu Contraseña</h1>
            <p className={styles.description}>Escribe tu nueva contraseña para recuperar tu cuenta</p>
            <form className={styles.form}>
                {alert.msg && <Alert error={alert.error} message={alert.msg} />}
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
                        onChange={handleChange}
                        value={user.password2}
                    />
                    {passwordsCheck ? null : <p>Las contraseñas no coinciden</p>}
                </div>
                
                <input 
                    className={`${styles.submit} ${loading ? styles.loading : ''}`}
                    type="submit" 
                    value="Guardar Contraseña"
                    disabled={loading}
                    onClick={handleSubmit}
                />
            </form>
        </>
    )
}

export default Reset
