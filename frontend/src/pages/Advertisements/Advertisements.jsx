import { Link } from 'react-router-dom';

// ******************** Images ********************
import clients from '../../assets/img/clients.png';

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
                image={clients}
            />
        </div>
        
    )
}

export default Advertisements
