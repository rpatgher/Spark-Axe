// ***************** Styles *****************
import { Fragment } from 'react';
import styles from './Most.module.css';

const Most = ({mostSold}) => {
    return (
        <div className={styles["Most"]}>
            {mostSold !== null ? (
                <Fragment>
                    <div className={styles["Mostproduct"]}>
                        {mostSold.image &&
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/elements/${mostSold.image}`} 
                                alt={`${mostSold.name} Product Image (Most Sold)`} 
                            />
                        }
                    </div>
                    <h4>Producto mas vendido </h4>
                </Fragment>
            ) : (
                <h4>Aún no hay productos vendidos</h4>
            )}
        </div>
    )
}

export default Most;