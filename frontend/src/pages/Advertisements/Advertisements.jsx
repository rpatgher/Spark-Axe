import { Link } from 'react-router-dom';

// ********************* Styles ********************
import styles from './Advertisements.module.css';

const Advertisements = () => {
    return (
        <div>
            <h1>Anuncios</h1>
            <h4>Enseña tus anuncios</h4>
            <Link to='/dashboard/advertisements/new'>
                        <button
                            className={styles["btn-new-ad"]}
                        >
                            <i className="fa-solid fa-plus"></i>
                            <p>Agregar Anuncio</p>
                        </button>
                        </Link>
        </div>
    )
}

export default Advertisements
