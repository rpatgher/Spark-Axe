import { Link } from 'react-router-dom';
import { useState } from 'react';

import clientAxios from '../config/clientAxios';

// ************** Styles **************
import styles from '../styles/Forgot.module.css'

// ************** Components **************
import Alert from '../components/Alert/Alert';

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState({
        msg: '',
        error: false
    });
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setAlert({
            msg: '',
            error: false
        });
        setEmail(e.target.value);
    }

    const submitForgot = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(email === ''){
            setAlert({
                msg: 'Ingresa tu correo electrónico',
                error: true
            });
            setLoading(false);
            return;
        }
        try {
                const response = await clientAxios.post('/api/users/forgot', { email });
                if(response.status === 200){
                    setAlert({
                        msg: 'Se han enviado las instrucciones a tu correo electrónico',
                        error: false
                    });
                }else{
                    setAlert({
                        msg: 'Hubo un error, intenta de nuevo',
                        error: true
                    });
                }
        } catch (error) {
            console.log(error);
                setAlert({
                    msg: 'Hubo un error, intenta de nuevo',
                    error: true
                });
        } finally{
            setEmail('');
            setLoading(false);
        }
    }


    return (
        <>
            <h1 className={styles.heading}>Reestablece tu Contraseña</h1>
            <p className={styles.description}>Ingresa tu email para reestablecer tu contraseña</p>
            <form className={styles.form}>
                {alert.msg && <Alert error={alert.error} message={alert.msg} />}
                <div className={styles.field}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="Ingresa tu correo electrónico" 
                        onChange={handleChange}
                        value={email}
                    />
                </div>
                
                <input 
                    className={`${styles.submit} ${loading ? styles.loading : ''}`}
                    type="submit" 
                    value="Enviar Instrucciones"
                    onClick={submitForgot}
                    disabled={loading}
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
