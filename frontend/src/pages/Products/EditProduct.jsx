import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ************** Styles *************
import styles from './NewProduct.module.css';

// ************** Components *************
import FormProduct from '../../components/FormProduct';


const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({});

    const [modalDelete, setModalDelete] = useState(false);

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


    const deleteProduct = async () => {
        // Delete product from API
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const response = await clientAxios.delete(`/api/elements/${id}`, config);
            navigate('/dashboard/products');
        } catch (error) {
            console.log(error);
        }
    }

    const publishProduct = async () => {
        // Publish product from API
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const response = await clientAxios.post(`/api/elements/publish/${id}`, {}, config);
            if(response.data.msg === 'Product published successfully'){
                setProduct({
                    ...product,
                    published: !product.published
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <>
            <h2 className={styles.heading}>Editar Producto: {product?.name}</h2>
            <div className={styles["go-back"]}>
                <Link to='/dashboard/products'>
                    <i className="fa-solid fa-arrow-left"></i> Regresar
                </Link>
            </div>
            <FormProduct
                initalProduct={product}
                setModalDelete={setModalDelete}
                publishProduct={publishProduct}
            />
            {modalDelete && (
                <div className={styles.modal}>
                    <div className={styles["modal-content"]}>
                        <h3>¿Estás seguro de eliminar este producto?</h3>
                        <div className={styles.buttons}>
                            <button
                                className={styles.cancel}
                                type='button'
                                onClick={() => setModalDelete(false)}
                            >Cancelar</button>
                            <button
                                className={styles.delete}
                                type='button'
                                onClick={deleteProduct}
                            >Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditProduct
