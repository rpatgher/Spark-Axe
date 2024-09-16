import { Link } from 'react-router-dom';

// *************** Styles ***************
import styles from './NewPointOfSale.module.css';

// ************** Components *************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';
import FormPointOfSale from '../../components/FormPointOfSale/FormPointOfSale';

const NewPointOfSale = () => {
    return (
        <div className={styles.form}>
            <HeadingsRuta 
                currentHeading="Nuevo Punto de Venta"
                routes={[
                    {name: "Puntos de Venta", path: "/dashboard/pos"},
                ]}
            />
            <div className={styles["go-back"]}>
                <Link to='/dashboard/pos'>
                    <i className="fa-solid fa-arrow-left"></i> Regresar
                </Link>
            </div>
            <FormPointOfSale />
        </div>
    )
}

export default NewPointOfSale;