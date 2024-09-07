

// ********************* Components ********************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';

// *************** Styles ***************
import styles from './PointOfSale.module.css';

const PointOfSale = () => {
    return (
        <div className={styles['pos-wrapper']}>
            <HeadingsRuta 
                currentHeading="Puntos de Venta / Sucursales"
                routes={[]}
            />
            <h4>Maneja el acesso de tus productos fisicos</h4>
        </div>
    )
}

export default PointOfSale
