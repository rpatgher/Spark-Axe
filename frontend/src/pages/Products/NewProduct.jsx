import { Link } from 'react-router-dom';

// ************** Styles *************
import styles from './NewProduct.module.css';

// ************** Components *************
import FormProduct from '../../components/FormProduct';
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';

const NewProduct = () => {
    return (
        <>
            <HeadingsRuta 
                currentHeading="Nuevo Producto"
                routes={[
                    {name: "Productos", path: "/dashboard/products"},
                ]}
            />
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
