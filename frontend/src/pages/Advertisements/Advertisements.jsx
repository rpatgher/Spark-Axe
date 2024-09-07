import { Link } from 'react-router-dom';

// ********************* Components ********************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';


// ********************* Styles ********************
import styles from './Advertisements.module.css';


const Advertisements = () => {
    return (
        <div className={styles['adverts-wrapper']}>
            <HeadingsRuta 
                currentHeading="Anuncios"
                routes={[]}
            />
            <h4>Publica tus anuncios</h4>
        </div>
    )
}

export default Advertisements
