import { Link } from 'react-router-dom';

// ************* image *************
import image from '../../assets/img/luna_ax.png';

// ************* Styles *************
import styles from './NotFound.module.css';

const NotFound = () => {
    return (
        <div className={styles.page}>
            <img src={image} alt="404" className={styles.image} />
            <h1 className={styles.notfound}>Error 404</h1>
            <p className={styles.text}>Lo siento, pero parece que la página que estás buscando no está disponible</p>
            <Link to="/" className={styles.link}>Volver al inicio</Link>
        </div>
    )
}

export default NotFound;
