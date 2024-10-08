import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ************** Styles *************
import styles from './NewProduct.module.css';

// ************** Components *************
import FormProduct from '../../components/FormProduct';
import GeneralModal from '../../components/Modals/GeneralModal';
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';

// ************** Hooks *************
import useApp from '../../hooks/useApp';


const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const { alert, handleAlert } = useApp();

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
                handleAlert('Error al obtener el producto', true);
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
            if(error?.response?.data?.msg === 'Cannot delete this element'){
                handleAlert('No puedes eliminar este producto, porque está asociado a otro elemento', true);
            }else{
                handleAlert('Error al eliminar el producto', true);
            }
        } finally{
            setModalDelete(false);
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
            handleAlert('Error al publicar el producto', true);
        }
    }
    
    return (
        <>
            <div className={styles.form}>
                <HeadingsRuta
                    currentHeading={`Editar Producto: ${product?.name || ''}`}
                    routes={[
                        {name: "Productos", path: "/dashboard/products"},
                    ]}
                />
                <div className={styles["go-back"]}>
                    <Link to='/dashboard/products'>
                        <i className="fa-solid fa-arrow-left"></i> Regresar
                    </Link>
                </div>
                <FormProduct
                    initalProduct={product}
                    setModalDelete={setModalDelete}
                />
            </div>
            {modalDelete && (
                <GeneralModal
                    modalActive={setModalDelete}
                    actionModal={deleteProduct}
                    actionBtnText='Eliminar'
                    text='¿Estás seguro de eliminar este producto?'
                />
            )}
        </>
    )
}

export default EditProduct
