import { useEffect, useState } from 'react';

// ************** styles *************
import styles from './FloatAlert.module.css';


const FloatAlert = ({msg, error}) => {
    const [animation, setAnimation] = useState(false);


    useEffect(() => {
        setTimeout(() => {
            setAnimation(true);
        }, 300);
        setTimeout(() => {
            setAnimation(false);
        }, 3500);
    }, []);

    return (
        <div 
            className={`
                ${styles.container} 
                ${error ? styles.error : styles.success}
                ${animation ? styles.animation : ''}
            `}

        >
            {msg}
        </div>
    )
}

export default FloatAlert
