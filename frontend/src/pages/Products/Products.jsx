import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './Products.module.css';

// ******************** Components ********************


// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';




const Products = () => {
    const { auth } = useAuth();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Get products from the server
        const getProducts = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clientAxios(`/api/elements/${auth.websites[0].id}`, config);
                setProducts(data);
            } catch (error) {
                console.log(error);
            }   
        };
        return () => getProducts();
    }, []);

    return (
        <>
            <h2 className={styles.heading}>Productos</h2>
            <div className={`${styles.filters} `}>
                <div className={styles.searcher}>
                    <input type="text" placeholder="Buscar productos" />
                    <i className={`fa-solid fa-search ${styles["search-icon"]}`}></i>
                    <div className={styles.filterter}>
                        <button className={`${styles["btn-filter"]}`}>
                            <i className='fa-solid fa-sort'></i>
                        </button>
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownContent}>
                                <button>
                                    <i className="fa-solid fa-hashtag"></i>
                                    Numero de ID
                                </button>
                                <button>
                                    <i className="fa-solid fa-a"></i>
                                    Nombre
                                </button>
                                <button>
                                    <i className="fa-solid fa-money-check-dollar"></i>
                                    Precio
                                </button>
                                <button>
                                    <i className="fa-solid fa-layer-group"></i>
                                    Categoria
                                </button>
                                <hr></hr>
                                <button>
                                    <i className="fa-solid fa-arrow-down-wide-short"></i>
                                    A-Z
                                </button>
                                <button>
                                    <i className="fa-solid fa-arrow-up-wide-short"></i>
                                    Z-A
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to='/dashboard/products/new'>
                    <button
                        className={styles["btn-new-product"]}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Agregar Producto
                    </button>
                </Link>
            </div>
            <div className={styles.buttonsRow}>
                <button className={styles.buttonCat}>Todos</button>
                <button className={styles.buttonCat}>Button 2</button>
                <button className={styles.buttonCat}>Button 3</button>
                <button className={styles.buttonCat}>Button 4</button>
                </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles["col-select"]}><input type="checkbox" /></th>
                        <th className={styles["col-image"]}>Imagen</th>
                        <th className={styles["col-id"]}>ID</th>
                        <th className={styles["col-name"]}>Nombre</th>
                        <th className={styles["col-description"]}>Descripción</th>
                        <th className={styles["col-price"]}>Precio</th>
                        <th className={styles["col-color"]}>Color</th>
                        <th className={styles["col-category"]}>Categoría</th>
                        <th className={styles["col-actions"]}></th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="9" className={styles.noproducts}>No hay productos aún. <Link to="/dashboard/products/new">Crea uno.</Link></td>
                        </tr>
                    ) :
                        products.map(product => (
                            <tr
                                key={product.id}
                            >
                                <td className={styles["cell-select"]}><input type="checkbox" /></td>
                                <td className={styles["cell-image"]}><img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/elements/${product.image}`} alt={`${product.name} Product Image`} /></td>
                                <td className={styles["cell-id"]}>{String(product.id).padStart(10, '0')}</td>
                                <td>{product.name}</td>
                                <td className={styles["cell-description"]}>
                                    <i className="fa-regular fa-note-sticky"></i>
                                </td>
                                <td>${formatToMoney(product.price)}</td>
                                <td className={styles["cell-color"]}><div style={{ backgroundColor: product.color }} ></div></td>
                                {/* TODO: Enable category */}
                                <td>iPlay</td>
                                <td className={styles["cell-actions"]}>
                                    <i className="fa-solid fa-pen"></i>
                                </td>
                            </tr>
                        )) 
                    }
                </tbody>
            </table>
        </>
    )
}

export default Products;
