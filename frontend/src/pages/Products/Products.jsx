import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './Products.module.css';

// ******************** Components ********************
import FloatAlert from '../../components/Alert/FloatAlert';
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';
// **************** Images ****************
import lunaAxImage from '../../assets/img/luna_ax.png';




const Products = () => {
    const { auth } = useAuth();
    const { alert } = useApp();
    const [products, setProducts] = useState([]);
    // Order means the order of the products, asc or desc (the sorting order)
    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('name');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');

    const sortedProducts = products.sort((a, b) => {
        if (order === 'asc') {
            if (orderType === 'id') {
                return a.id - b.id;
            }
            if (orderType === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (orderType === 'price') {
                return a.price - b.price;
            }
        }
        if (order === 'desc') {
            if (orderType === 'id') {
                return b.id - a.id;
            }
            if (orderType === 'name') {
                return b.name.localeCompare(a.name);
            }
            if (orderType === 'price') {
                return b.price - a.price;
            }
        }
    });

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
                setFilteredProducts(data);
            } catch (error) {
                console.log(error);
            }
        };
        return () => getProducts();
    }, []);

    const handleOrder = (e) => {
        setOrder(e.target.value);
        setFilteredProducts(sortedProducts);
    }

    const handleOrderType = (e) => {
        setOrderType(e.target.value);
        setFilteredProducts(sortedProducts);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        filterProducts(e.target.value, visible);
    }

    const handleVisible = (e) => {
        console.log(e.target.dataset.value);
        setVisible(e.target.dataset.value);
        filterProducts(search, e.target.dataset.value);
    }

    const filterProducts = (search, visible) => {
        const visibleFiltered = products.filter(product => {
            if (visible === 'all') {
                return product;
            }
            if (visible === 'published') {
                return product.published;
            }
            if (visible === 'unpublished') {
                return !product.published;
            }
        });
        if (search === '') {
            setFilteredProducts(visibleFiltered);
            return;
        }
        const filtered = visibleFiltered.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
        console.log(filtered);
        setFilteredProducts(filtered);
    }

    return (
        <>
            {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
            <HeadingsRuta 
                currentHeading="Productos"
                routes={[]}
            />
            <div className={`${styles.filters} `}>
                <div className={styles.searcher}>
                    <input 
                        type="text" 
                        placeholder="Buscar productos" 
                        onChange={handleSearch}
                    />
                    <i className={`fa-solid fa-search ${styles["search-icon"]}`}></i>
                    <div className={styles.filterter}>
                        <button className={`${styles["btn-filter"]}`}>
                            <strong className={`${styles["Textfilter"]}`}>Filtrar</strong>
                            <i className='fa-solid fa-sort'></i>
                        </button>
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownContent}>
                                <button
                                    className={`${orderType === 'id' ? styles.active : ''}`}
                                    value={'id'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-hashtag"></i>
                                    Numero de ID
                                </button>
                                <button
                                    className={`${orderType === 'name' ? styles.active : ''}`}
                                    value={'name'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-a"></i>
                                    Nombre
                                </button>
                                <button
                                    className={`${orderType === 'price' ? styles.active : ''}`}
                                    value={'price'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-money-check-dollar"></i>
                                    Precio
                                </button>
                                {/* <button
                                    value={'category'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-layer-group"></i>
                                    Categoria
                                </button> */}
                                <hr className={styles.divider} />
                                <button
                                    className={`${order === 'asc' ? styles.active : ''}`}
                                    value={'asc'}
                                    onClick={handleOrder}
                                >
                                    Ascendente
                                </button>
                                <button
                                    className={`${order === 'desc' ? styles.active : ''}`}
                                    value={'desc'}
                                    onClick={handleOrder}
                                >
                                    Descendente
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
                        <p>Agregar Producto</p>
                    </button>
                </Link>
            </div>
            <div className={styles["Filtertabs"]}>
                <div className={styles["radio-inputs"]}>
                    <p className={styles.visibles}>Visibles: </p>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "all" ? styles.active : ''}`} data-value="all">Todos</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "published" ? styles.active : ''}`} data-value="published">Publicados</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "unpublished" ? styles.active : ''}`} data-value="unpublished">Archivados</button>
                </div>
            </div>
            <div className={styles["table-wrapper"]}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles["col-select"]}><input type="checkbox" /></th>
                            <th className={styles["col-image"]}>Imagen</th>
                            <th className={styles["col-name"]}>Nombre</th>
                            <th className={styles["col-description"]}>Descripción</th>
                            <th className={styles["col-price"]}>Precio</th>
                            <th className={styles["col-color"]}>Color</th>
                            <th className={styles["col-category"]}>Categoría</th>
                            <th className={styles["col-id"]}>ID</th>
                            <th className={styles["col-published"]}>Publicado</th>
                            <th className={styles["col-actions"]}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="10" className={styles.noproducts}>
                                    <div>
                                        <img className={styles["imgAX"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                                    </div>

                                    No hay productos aún. <Link to="/dashboard/products/new">Crea uno.</Link></td>
                            </tr>

                        ) :
                            filteredProducts.map(product => (
                                <tr
                                    key={product.id}
                                >
                                    <td className={styles["cell-select"]}><input type="checkbox" /></td>
                                    <td className={styles["cell-image"]}><img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/elements/${product.image}`} alt={`${product.name} Product Image`} /></td>
                                    <td>{product.name}</td>
                                    <td className={styles["cell-description"]}>
                                        <i className="fa-regular fa-note-sticky"></i>
                                    </td>
                                    <td>${formatToMoney(product.price)}</td>
                                    <td className={styles["cell-color"]}><div style={{ backgroundColor: product.color }} ></div></td>
                                    {/* TODO: Enable category */}
                                    <td>iPlay</td>
                                    <td className={styles["cell-id"]}>{String(product.id).padStart(10, '0')}</td>
                                    <td className={styles["cell-published"]}><div className={`${product.published ? styles.published : styles.unpublished}`}>{product.published ? 'Publicado' : 'Archivado'}</div></td>
                                    <td className={styles["cell-actions"]}>
                                        <Link to={`edit/${product.id}`}><i className="fa-solid fa-pen"></i></Link>
                                    </td>
                                </tr>
                            )
                            
                        )
                           
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Products;
