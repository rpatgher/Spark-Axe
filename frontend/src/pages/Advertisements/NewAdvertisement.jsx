import { Link } from 'react-router-dom';

// ********************* Styles ********************
import styles from './NewAdvertisement.module.css';

// ************** Components *************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';
import FormAdvertisement from '../../components/FormAdvertisement/FormAdvertisement';

const NewAdvertisement = () => {
    return (
        <div className={styles.form}>
            <HeadingsRuta 
                currentHeading="Nuevo Anuncio"
                routes={[
                    {name: "Anuncios", path: "/dashboard/advertisements"},
                ]}
            />
            <div className={styles["go-back"]}>
                <Link to='/dashboard/advertisements'>
                    <i className="fa-solid fa-arrow-left"></i> Regresar
                </Link>
            </div>
            <FormAdvertisement />
        </div>
    )
}

export default NewAdvertisement;