import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clientAxios from '../config/clientAxios';

// ************** Styles **************
import styles from '../styles/AccountConfirmation.module.css';

const AccountConfirmation = () => {
    const { token } = useParams();
    const [validToken, setValidToken] = useState(true);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
        const confirmUser = async () => {
            try {
                const response = await clientAxios.post('/api/users/confirmation', { token });
                if(response.status === 200){
                    setValidToken(true);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setValidToken(false);
                setLoading(false);
            }
        }
        confirmUser();
    }, [token]);

    if(loading) return <h1 className={styles.heading}>Loading...</h1>

    return validToken ? (
        <>
            <h1 className={styles.heading}>Tu cuenta ha sido confirmada</h1>
            <p className={styles.description}>Por favor espera a que los administradores de SparkAxe hagan los ajustes restantes</p>
        </>
    ) : 
    (
        <>
            <h1 className={styles.heading}>Token inválido</h1>
            <p className={styles.description}>El token proporcionado no es válido</p>
        </>
    )
}

export default AccountConfirmation;
