import { Link } from 'react-router-dom';

// ************** Styles *************
import styles from './NewProduct.module.css';

// ************** Components *************
import FormProduct from '../../components/FormProduct';

const NewProduct = () => {
    return (
        <>
            <h2><Link to='/dashboard/products' tooltip="Regresar"><span className={styles.headingback}>Productos / </span></Link><span className={styles.heading}>Nuevo Producto</span></h2>
            <div className={styles["go-back"]}>
                <Link to='/dashboard/products'>
                    <i className="fa-solid fa-arrow-left"></i> Regresar
                </Link>
            </div>
            <FormProduct/>
        </>
    )
}

export default NewProduct
