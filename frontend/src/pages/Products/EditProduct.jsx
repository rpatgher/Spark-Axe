import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ************** Styles *************
import styles from './NewProduct.module.css';

// ************** Components *************
import FormProduct from '../../components/FormProduct';


const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        const getElement = async () => {
            // Fetch product from API
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                }
            }
            try {
                const response = await clientAxios.get(`/api/elements/one/${id}`, config);
                setProduct(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getElement();
    }, []);
    
    return (
        <>
            <h2 className={styles.heading}>Editar Producto</h2>
            <div className={styles["go-back"]}>
                <Link to='/dashboard/products'>
                    <i className="fa-solid fa-arrow-left"></i> Regresar
                </Link>
            </div>
            <FormProduct
                initalProduct={product}
            />
        </>
    )
}

export default EditProduct
