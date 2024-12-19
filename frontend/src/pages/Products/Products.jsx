import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './Products.module.css';

// ******************** Components ********************
import FloatAlert from '../../components/Alert/FloatAlert';
import Modal from '../../components/Modals/GeneralModal';
import ModalCategories from '../../components/Modals/ModalCategories';
import ModalEditCategories from '../../components/Modals/ModalEditCategories';
import GoTopBtn from '../../components/Btns/GoTopBtn';
import TableDashboard from '../../components/TableDashboard/TableDashboard';
import SearcherDashboard from '../../components/SearcherDashboard/SearcherDashboard';
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';

// **************** Images ****************
import Prodcutsimg from '../../assets/img/Illustrations/Productos.png';




const Products = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [products, setProducts] = useState([]);
    const [config, setConfig] = useState({});
    // Order means the order of the products, asc or desc (the sorting order)
    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('name');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [limit, setLimit] = useState(10);

    const [modalDelete, setModalDelete] = useState(false);
    
    const [productDescription, setProductDescription] = useState({});
    const [modalCategories, setModalCategories] = useState([]);

    const [modalEditCategories, setModalEditCategories] = useState(false);
    const [categories, setCategories] = useState([]);

    const [show, setShow] = useState(false);

    const showModal = () => {
        setTimeout(() => {
            setShow(true);
        }, 300);
    }

    const unshowModal = () => {
        setShow(false);
        setTimeout(() => {
            setProductDescription({});
        }, 300);
    }

    useEffect(() => {
        const count = filteredProducts.filter(item => item.selected && item.visible).length;
        const countVisible = filteredProducts.filter(item => item.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredProducts, limit]);

    useEffect(() => {
        const newData = [...filteredProducts];
        newData.forEach(item => item.selected = false);
        setFilteredProducts(newData);
    }, [products]);

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
                setProducts(data.elements);
                setFilteredProducts(data.elements);
                setConfig(data.config);
            } catch (error) {
                console.log(error);
                handleAlert("Error al obtener los productos", true);
            }
        };
        return () => getProducts();
    }, []);

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
                setProducts(products.filter(product => !error.response.data.elements.map(element => element.id).includes(product.id)));
                setFilteredProducts(filteredProducts.filter(product => !error.response.data.elements.map(element => element.id).includes(product.id)));
            }else{
                handleAlert("Error al eliminar los productos", true);
                setProducts(products);
                setFilteredProducts(filteredProducts);
            }
        } finally {
            setSelectAll(false);
            setModalDelete(false);
        }

    }

    return (
        <div className={styles["products-wrapper"]}>
            {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
            <PageHeaderDash 
                title={'Productos'}
                description={'Crea y edita tus productos'}
                image={Prodcutsimg}
            />
            <div className={`${styles.filters} `}>
                <SearcherDashboard
                    setSearch={setSearch}
                    filterList={filterProducts}
                    visible={visible}
                    setOrder={setOrder}
                    order={order}
                    setOrderType={setOrderType}
                    orderType={orderType}
                    sortedList={sortedProducts}
                    setFilteredList={setFilteredProducts}
                    setSelectAll={setSelectAll}
                    options={[
                        { type: 'id', name: 'Número de ID' },
                        { type: 'name', name: 'Nombre' },
                        { type: 'price', name: 'Precio' },
                        { type: 'cost' , name: 'Costo' },
                        { type: 'wholesale', name: 'Producto Mayorista' }
                    ]}
                    listName='productos'
                />
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
            <TableDashboard
                columns={config.color ? [
                    { prop: 'checkbox', width: '5%' },
                    { prop: 'Imagen', width: '5%' },
                    { prop: 'Nombre', width: '10%' },
                    { prop: 'Descripción', width: '10%' },
                    { prop: 'Precio', width: '10%' },
                    { prop: 'Costo', width: '10%' },
                    { prop: 'Color', width: '5%' },
                    { prop: 'Categorías', width: '1%' },
                    { prop: 'Producto Mayorista', width: '5%' },
                    { prop: 'ID', width: '10%' },
                    { prop: 'Publicado', width: '5%' },
                    { prop: 'actions', width: '10%' }
                ] : [
                    { prop: 'checkbox', width: '5%' },
                    { prop: 'Imagen', width: '10%' },
                    { prop: 'Nombre', width: '10%' },
                    { prop: 'Descripción', width: '10%' },
                    { prop: 'Precio', width: '10%' },
                    { prop: 'Costo', width: '10%' },
                    { prop: 'Categorías', width: '10%' },
                    { prop: 'Producto Mayorista', width: '5%' },
                    { prop: 'ID', width: '10%' },
                    { prop: 'Publicado', width: '5%' },
                    { prop: 'actions', width: '10%' }
                ]}
                listLength={filteredProducts.length}
                filterList={filterProducts}
                search={search}
                visibleCount={visibleCount}
                selectedCount={selectedCount}
                handleSelectAll={handleSelectAll}
                setSelectAll={setSelectAll}
                selectAll={selectAll}
                limit={limit}
                setLimit={setLimit}
                visible={visible}
                setVisible={setVisible}
                visibleOptions={[
                    { type: 'published', name: 'Publicados' },
                    { type: 'unpublished', name: 'Archivados' }
                ]}
                setModalDelete={setModalDelete}
                listName='productos'
                createNew="/dashboard/products/new"
            >
                {filteredProducts.map((product, index) => {
                    if (index < limit) {
                        product.visible = true;
                        return (
                            <tr
                                key={product.id}
                                className={product.selected ? styles.selectedRow : ''}
                            >
                                {/* Checkbox */}
                                <td className={styles["cell-select"]}>
                                    <input 
                                        type="checkbox"
                                        onChange={() => handleSelect(index)}
                                        checked={product.selected || false}
                                    />
                                </td>
                                
                                {/* Imagen */}
                                <td className={styles["cell-image"]}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/elements/${product.image}`} 
                                        alt={`${product.name} Product Image`} />
                                </td>

                                {/* Nombre */}
                                <td>{product.name}</td>

                                {/* Descripción */}
                                <td className={styles["cell-description"]}>
                                    <button
                                        onClick={() => {
                                            showDescription(product);
                                            showModal();
                                        }}
                                    >
                                        <i className="fa-regular fa-note-sticky"></i>
                                    </button>
                                </td>

                                {/* Precio */}
                                <td>{formatToMoney(product.price)} MXN</td>

                                {/* Costo */}
                                <td>{formatToMoney(product.cost)} MXN</td>

                                {/* Categorías */}
                                <td>
                                    <button
                                        className={styles["btn-categories"]}
                                        onClick={() => showCategories(product.categories)}
                                    >
                                        <i className="fa-solid fa-layer-group"></i>
                                    </button>
                                </td>

                                {/* Producto Mayorista */}
                                <td>
                                    <div className={product.wholesaler ? styles.wholesalerTrue : styles.wholesalerFalse}>
                                        {product.wholesaler ? 'Sí' : 'No'}
                                    </div>
                                </td>

                                {/* ID */}
                                <td className={styles["cell-id"]}>
                                    {String(product.index).padStart(10, '0')}
                                </td>

                                {/* Publicado */}
                                <td className={styles["cell-published"]}>
                                    <div className={`${product.published ? styles.published : styles.unpublished}`}>
                                        {product.published ? 'Publicado' : 'Archivado'}
                                    </div>
                                </td>

                                {/* Acciones */}
                                <td className={styles["cell-actions"]}>
                                    <Link to={`edit/${product.id}`} className={styles.editar}>
                                        <i className="fa-solid fa-pen"></i>
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        );
                    } else {
                        product.visible = false;
                        product.selected = false;
                    }
                })}

            </TableDashboard>
            {productDescription.name &&
                <div className={styles["modal-wrapper"]}>
                    <div className={`${styles["modal-description"]} ${show ? styles.show : ''}`}>
                        <button 
                            className={styles["close-modal"]}
                            onClick={unshowModal}
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
