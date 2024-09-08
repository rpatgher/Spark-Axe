

// ******************** Images ********************
import clients from '../../assets/img/clients.png';

// *************** Styles ***************
import styles from './PointOfSale.module.css';

// ********************* Components ********************
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';

const PointOfSale = () => {
    return (
        <div className={styles['pos-wrapper']}>
            <PageHeaderDash 
                title={'Puntos de Venta'}
                description={'Maneja el acesso de tus productos físicos'}
                image={clients}
            />
        </div>
    )
}

export default PointOfSale
