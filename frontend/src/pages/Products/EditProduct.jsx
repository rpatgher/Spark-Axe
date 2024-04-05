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
    const [categories, setCategories] = useState([]);

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
                setProduct(response.data.element);
                const formatedCategories = response.data.categories.map(category => {
                    return {
                        category: category.name,
                        subcategories: category.subcategories.map(subcategory => subcategory.name),
                    }
                });
                setCategories(formatedCategories);
            } catch (error) {
                console.log(error);
            }
        }
        getElement();
    }, []);
    
    return (
        <>
            <h2 className={styles.heading}>Editar Producto: {product.name}</h2>
            <div className={styles["go-back"]}>
                <Link to='/dashboard/products'>
                    <i className="fa-solid fa-arrow-left"></i> Regresar
                </Link>
            </div>
            <FormProduct
                initalProduct={product}
                initialCategoriesFromDB={categories}
            />
        </>
    )
}

export default EditProduct
