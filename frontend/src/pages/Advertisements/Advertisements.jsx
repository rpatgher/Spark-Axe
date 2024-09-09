import { Link } from 'react-router-dom';

// ******************** Images ********************
import Adsimg from '../../assets/img/Illustrations/Anuncios.png';

// ********************* Styles ********************
import styles from './Advertisements.module.css';

// ********************* Components ********************
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';


const Advertisements = () => {
    return (
        <div className={styles['adverts-wrapper']}>
            <PageHeaderDash 
                title={'Anuncios'}
                description={'Publica tus anuncios'}
                image={Adsimg}
            />
        </div>
        
    )
}

export default Advertisements
