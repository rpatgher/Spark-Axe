import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './Products.module.css';

// ******************** Components ********************
import FloatAlert from '../../components/Alert/FloatAlert';
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';
import Modal from '../../components/Modals/GeneralModal';
import ModalCategories from '../../components/Modals/ModalCategories';
import ModalEditCategories from '../../components/Modals/ModalEditCategories';
import GoTopBtn from '../../components/Btns/GoTopBtn';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';

// **************** Images ****************
import lunaAxImage from '../../assets/img/luna_ax.png';




const Products = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [products, setProducts] = useState([]);
    // Order means the order of the products, asc or desc (the sorting order)
    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('name');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [dataLength, setDataLength] = useState(0);
    const [limit, setLimit] = useState(10);
    const [limitIncrement, setLimitIncrement] = useState(10);

    const [modalDelete, setModalDelete] = useState(false);
    
    const [productDescription, setProductDescription] = useState({});
    const [modalCategories, setModalCategories] = useState([]);

    const [modalEditCategories, setModalEditCategories] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const count = filteredProducts.filter(item => item.selected && item.visible).length;
        const countVisible = filteredProducts.filter(item => item.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredProducts, limit]);

    const sortedProducts = products.sort((a, b) => {
        if (order === 'asc') {
            if (orderType === 'id') {
                return a.index - b.index;
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
                return b.index - a.index;
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
                const response = await clientAxios(`/api/categories/${auth.websites[0].id}`, config); 
                const categories = response.data;
                setCategories(categories);
                setProducts(data);
                setFilteredProducts(data);
                setDataLength(data.length);
            } catch (error) {
                console.log(error);
                handleAlert("Error al obtener los productos", true);
            }
        };
        return () => getProducts();
    }, []);

    const handleOrder = (e) => {
        setSelectAll(false);
        setOrder(e.target.value);
        setFilteredProducts(sortedProducts);
    };

    const handleOrderType = (e) => {
        setSelectAll(false);
        setOrderType(e.target.value);
        setFilteredProducts(sortedProducts);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        filterProducts(e.target.value, visible);
    };

    const handleVisible = (e) => {
        setVisible(e.target.dataset.value);
        filterProducts(search, e.target.dataset.value);
    };

    const filterProducts = (search, visible) => {
        setSelectAll(false);
        setFilteredProducts(filteredProducts.map(product => product.selected = false));
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
        setFilteredProducts(filtered);
    };

    const handleSelectAll = () => {
        const newData = filteredProducts.map(item => (item.visible ? { ...item, selected: !selectAll } : item));
        setFilteredProducts(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...filteredProducts];
        newData[index].selected = !newData[index].selected; // Update selected property
        setFilteredProducts(newData);
    };

    const showDescription = (product) => {
        setProductDescription(product);
    };

    const showCategories = (categories) => {
        setModalCategories(categories);
    }

    const deleteSelected = async () => {
        const selectedProducts = filteredProducts.filter(product => product.selected);
        const ids = selectedProducts.map(product => product.id);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const {data} = await clientAxios.post(`/api/elements/delete-all`, { ids }, config);
            setProducts(products.filter(product => !ids.includes(product.id)));
            setFilteredProducts(filteredProducts.filter(product => !ids.includes(product.id)));
            handleAlert("Productos Eliminados Correctamente", false);
            setModalDelete(false);
        } catch (error) {
            console.log(error);
            if(error?.response?.data?.msg === 'Cannot delete elements'){
                handleAlert('No puedes eliminar estos productos, porque alguno está asociado a otro elemento', true);
            }else{
                handleAlert("Error al eliminar los productos", true);
            }
        } finally {
            setSelectAll(false);
            setModalDelete(false);
            const newData = [...filteredProducts];
            newData.map(item => item.selected = false);
            setFilteredProducts(newData);
        }

    }

    return (
        <div className={styles["products-wrapper"]}>
            {/* {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />} */}
            <HeadingsRuta 
                currentHeading="Productos"
                routes={[]}
            />
            <h4>Crea y edita tus productos</h4>
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
                <div className={styles.buttons}>
                    <button
                        className={styles["btn-edit-categories"]}
                        onClick={() => setModalEditCategories(true)}
                    >
                        <i className="fa-solid fa-layer-group"></i>
                        <p>Editar Categorías</p>
                    </button>
                    <Link to='/dashboard/products/new'>
                        <button
                            className={styles["btn-new-product"]}
                        >
                            <i className="fa-solid fa-plus"></i>
                            <p>Agregar Producto</p>
                        </button>
                    </Link>
                </div>
            </div>
            <div className={styles["Filtertabs"]}>
                <div className={styles["radio-inputs"]}>
                    <p className={styles.visibles}>Visibles: </p>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "all" ? styles.active : ''}`} data-value="all">Todos</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "published" ? styles.active : ''}`} data-value="published">Publicados</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "unpublished" ? styles.active : ''}`} data-value="unpublished">Archivados</button>
                </div>
                {selectedCount > 0 && 
                    <div className={styles.selected}>
                        <p className={styles.counter}><strong>Seleccionados:</strong> {selectedCount}</p>
                        <button 
                            className={styles.delete}
                            type='button'
                            onClick={() => setModalDelete(true)}
                        ><i className="fa-solid fa-trash"></i> Eliminar</button>
                    </div>
                }
            </div>
            <div className={styles["table-wrapper"]}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles["col-select"]}>
                                <input 
                                    type="checkbox" 
                                    onChange={handleSelectAll}
                                    checked={selectAll}
                                />
                            </th>
                            <th className={styles["col-image"]}>Imagen</th>
                            <th className={styles["col-name"]}>Nombre</th>
                            <th className={styles["col-description"]}>Descripción</th>
                            <th className={styles["col-price"]}>Precio</th>
                            <th className={styles["col-color"]}>Color</th>
                            <th className={styles["col-category"]}>Categorías</th>
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
                            filteredProducts.map((product, index) => {
                                if(index < limit){
                                    product.visible = true;
                                   return (
                                    <tr
                                        key={product.id}
                                        className={product.selected ? styles.selectedRow : ''}
                                    >
                                        <td className={styles["cell-select"]}>
                                            <input 
                                                type="checkbox"
                                                onChange={() => handleSelect(index)}
                                                checked={product.selected || false}
                                            />
                                        </td>
                                        <td className={styles["cell-image"]}><img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/elements/${product.image}`} alt={`${product.name} Product Image`} /></td>
                                        <td>{product.name}</td>
                                        <td className={styles["cell-description"]}>
                                            <button
                                                onClick={() => showDescription(product)}
                                            >
                                                <i className="fa-regular fa-note-sticky"></i>
                                            </button>
                                        </td>
                                        <td>{formatToMoney(product.price)} MXN</td>
                                        <td className={styles["cell-color"]}><div style={{ backgroundColor: product.color }} ></div></td>
                                        <td>
                                            <button
                                                className={styles["btn-categories"]}
                                                onClick={() => showCategories(product.categories)}
                                            >
                                                <i className="fa-solid fa-layer-group"></i>
                                            </button>
                                        </td>
                                        <td className={styles["cell-id"]}>{String(product.index).padStart(10, '0')}</td>
                                        <td className={styles["cell-published"]}><div className={`${product.published ? styles.published : styles.unpublished}`}>{product.published ? 'Publicado' : 'Archivado'}</div></td>
                                        <td 
                                            className={styles["cell-actions"]}
                                        >
                                            <Link to={`edit/${product.id}`} className={styles.editar}>
                                                <i className="fa-solid fa-pen"></i>
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                   ) 
                                }else{
                                    product.visible = false;
                                    product.selected = false;
                                }
                            }   
                        )}
                        {dataLength > limitIncrement &&
                            <tr className={styles.megarow}>
                                <td colSpan="2"></td>
                                <td colSpan="2">
                                    <strong>Productos cargados: </strong>{visibleCount}
                                </td>
                                <td colSpan="2">
                                    {dataLength > limit &&
                                        <button 
                                            className={styles.cargar}
                                            type='button'
                                            onClick={() => {
                                                setSelectAll(false);
                                                setLimit(limit + limitIncrement);
                                            }}
                                        >Cargar más</button>
                                    }
                                </td>
                                <td colSpan="2">
                                    {limit > limitIncrement &&
                                        <button 
                                            className={styles.cargar}
                                            type='button'
                                            onClick={() => setLimit(limit - limitIncrement)}
                                        >Cargar menos</button>
                                    }
                                </td>
                                <td colSpan="2"></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            {productDescription.name &&
                <div className={styles["modal-wrapper"]}>
                    <div className={styles["modal-description"]}>
                        <button 
                            className={styles["close-modal"]}
                            onClick={() => setProductDescription({})}
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                        <h2>Descripcion de Producto</h2>
                        <hr></hr>
                        <p className={styles.descriptioninfotitle}>Nombre de producto:</p>
                        <p className={styles.descriptioninfo}> {productDescription.name}</p>
                        <p className={styles.descriptioninfotitle}>Descripcion: </p>
                        <p className={styles.descriptioninfo}> {productDescription.description}</p>
                    </div>
                </div>
            }
            <GoTopBtn />
            {modalDelete && 
                <Modal 
                    modalActive={setModalDelete}
                    text='¿Estás seguro de eliminar los productos seleccionados?'
                    actionBtnText='Eliminar'
                    actionBtnLoadingText='Eliminando...'
                    actionModal={deleteSelected}
                />
            }
            {modalCategories.length > 0 &&
                <ModalCategories 
                    categories={modalCategories}
                    closeModal={() => setModalCategories([])}
                />
            }
            {modalEditCategories && 
                <ModalEditCategories 
                    closeModal={() => setModalEditCategories(false)}
                    categories={categories}
                    setCategories={setCategories}
                />
            }
        </div>
    )
}

export default Products;
