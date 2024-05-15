import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './inventory.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';

// **************** Images ****************
import clients from '../../assets/img/inventory.png';
import lunaAxImage from '../../assets/img/luna_ax.png';
import GoTopBtn from '../../components/Btns/GoTopBtn';

// ******************** Components ********************
import FloatAlert from '../../components/Alert/FloatAlert';

const Inventory = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [editingRow, setEditingRow] = useState(null);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState('all');
    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('name');
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [currentElement, setCurrentElement] = useState({});
    const [inventory, setInventory] = useState({
        low: 10,
        high: 30
    });
    const dataLength = data.length;
    const [visibleCount, setVisibleCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [limitIncrement, setLimitIncrement] = useState(10);

    const [loading, setLoading] = useState(false);

    const sortedProducts = data.sort((a, b) => {
        if (order === 'asc') {
            if (orderType === 'stock') {
                return a.stock - b.stock;
            }
            if (orderType === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (orderType === 'price') {
                return a.price - b.price;
            }
        }
        if (order === 'desc') {
            if (orderType === 'stock') {
                return b.stock - a.stock;
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
        const visible = data.filter(item => item.visible).length;
        setVisibleCount(visible);
    }, [data, limit]);

    useEffect(() => {
        const getElements = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clientAxios(`/api/elements/${auth.websites[0].id}`, config);
                const { data: inventoryData } = await clientAxios(`/api/inventories/${auth.websites[0].id}`, config);
                setInventory(inventoryData);
                setData(data);
                setFilteredProducts(data);
            } catch (error) {
                console.log(error);
            }
        };
        return () => getElements();
    }, []);

    const handleEditClick = (itemId) => {
        setEditingRow(itemId);
        setData(data.map(product => {
            if (product.id === itemId) {
                product.selected = true;
                setCurrentElement(product);
            }else{
                product.selected = false;
            }
            return product;
        }));
        setFilteredProducts(filteredProducts.map(product => {
            if (product.id === itemId) {
                product.selected = true;
            }else{
                product.selected = false;
            }
            return product;
        }));
    };

    const handleSaveClick = async (itemId) => {
        const currentElement = data.find(product => product.id === itemId);
        if(currentElement.stock === '' || currentElement.stock < 0){
            currentElement.stock = 0;
        }
        if(currentElement.price === '' || currentElement.price < 0){
            currentElement.price = 0;
        }
        setLoading(true);
        currentElement.selected = false;
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            await clientAxios.put(`/api/elements/stock/${currentElement.id}`, currentElement, config);
            filterProducts(search, visible);
            handleAlert("Producto actualizado correctamente", false);
        } catch (error) {
            console.log(error);
            handleAlert("Hubo un error al actualizar el producto", true);
        }
        setLoading(false);
        setEditingRow(null);
    };

    const handleInputChange = (event, field, itemId) => {
        setCurrentElement({
            ...currentElement,
            [field]: event.target.value
        });
        setData(data.map(product => {
            if (product.id === itemId) {
                product[field] = event.target.value;
            }
            return product;
        }));
    };

    const renderTableCell = (value, field, itemId) => {
        if (itemId === editingRow && field !== "producto" && field !== "status") {
            return (
                <input
                    type="number"
                    className={styles["input-stock"]}
                    value={value}
                    onChange={(event) => handleInputChange(event, field, itemId)}
                />
            );
        } else {
            if(field === "price"){
                return `$${formatToMoney(value)}`;
            }
            return value;
        }
    };

    const setStatus = (stock, item) => {
        if (stock >= inventory.high) {
            item.status = "high";
            return (<p className={`${styles.status} ${styles["status-high"]}`}>Alto</p>);
        } else if (stock > inventory.low && stock < inventory.high) {
            item.status = "medium";
            return (<p className={`${styles.status} ${styles["status-medium"]}`}>Medio</p>);
        } else {
            item.status = "low";
            return (<p className={`${styles.status} ${styles["status-low"]}`}>Bajo</p>);
        }
    };

    const handleOrder = (e) => {
        setOrder(e.target.value);
        setFilteredProducts(sortedProducts);
    };

    const handleOrderType = (e) => {
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
        setFilteredProducts(filteredProducts.map(product => product.selected = false));
        const visibleFiltered = data.filter(product => {
            if (visible === 'all') {
                return product;
            }
            if (visible === 'high') {
                return product.status === 'high';
            }
            if (visible === 'medium') {
                return product.status === 'medium';
            }
            if (visible === 'low') {
                return product.status === 'low';
            }
        });
        if (search === '') {
            setFilteredProducts(visibleFiltered);
            return;
        }
        const filtered = visibleFiltered.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
        setFilteredProducts(filtered);
    };

    return (
        <div className={styles["inventory-wrapper"]}>
            {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
            <div className={styles.top}>
                <div className={styles.topcontent}>
                    <h2 className={styles.heading}>Inventario</h2>
                    <h4>Ten mas control sobre tu negocio</h4>
                </div>
                <div className={styles.topimage}>
                    <img className={styles["back"]} src={clients} alt="Axolotl-Waiting" />
                </div>
            </div>
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
                                    className={`${orderType === 'name' ? styles.active : ''}`}
                                    value={'name'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-a"></i>
                                    Nombre
                                </button>
                                <button
                                    className={`${orderType === 'stock' ? styles.active : ''}`}
                                    value={'stock'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-box"></i>
                                    Cantidad
                                </button>
                                <button
                                    className={`${orderType === 'price' ? styles.active : ''}`}
                                    value={'price'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-money-check-dollar"></i>
                                    Precio
                                </button>
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
                <Link to='/dashboard/inventory/set'><button className={styles.configinventory}><i className="fa-solid fa-dolly"></i> Configurar inventario</button></Link>
            </div>
            <div className={styles["Filtertabs"]}>
                <div className={styles["radio-inputs"]}>
                    <p className={styles.visibles}>Visibles: </p>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "all" ? styles.active : ''}`} data-value="all">Todos</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "high" ? styles.active : ''}`} data-value="high">Alto</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "medium" ? styles.active : ''}`} data-value="medium">Medio</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "low" ? styles.active : ''}`} data-value="low">Bajo</button>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles["table-wrapper"]}>
                    <table className={styles["inventory-table"]}>
                        <thead>
                            <tr>
                                <th className={styles["col-product"]}>Producto</th>
                                <th className={styles["col-stock"]}>Cantidad</th>
                                <th className={styles["col-price"]}>Precio</th>
                                <th className={styles["col-status"]}>Estatus</th>
                                <th className={styles["col-edit"]}></th>
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
                            ):
                                filteredProducts.map((item, index) => {
                                    if(index < limit){
                                        item.visible = true;
                                        return (
                                            <tr 
                                                key={item.id} 
                                                className={`${item.selected ? styles.selectedRow : ''}`}
                                            >
                                                
                                                <td>{item.name}</td>
                                                <td>{renderTableCell(item.stock, "stock", item.id)}</td>
                                                <td>{renderTableCell(item.price, "price", item.id)}</td>
                                                <td>{setStatus(item.stock, item)}</td>

                                                <td>
                                                    {editingRow === item.id ? (
                                                        <div>
                                                            <button
                                                                onClick={() => handleSaveClick(item.id)}
                                                                className={`${styles.guardar} ${loading ? styles.loading : ""}`}
                                                            >
                                                                <i className="fa-solid fa-save"></i>
                                                                {loading ? 'Guardando...' : 'Guardar'}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleEditClick(item.id)} 
                                                            className={styles.editar}
                                                        >
                                                            <i className="fa-solid fa-pen"></i>
                                                            Editar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    }else{
                                        item.visible = false;
                                    }
                                })
                            }
                            {dataLength > limitIncrement &&
                                <tr className={styles.megarow}>
                                    <td colSpan="2">
                                        <strong>Inventario cargados: </strong>{visibleCount}
                                    </td>
                                    <td colSpan="1">
                                        {dataLength > limit &&
                                            <button 
                                                className={styles.cargar}
                                                type='button'
                                                onClick={() => {
                                                    setLimit(limit + limitIncrement);
                                                }}
                                            >Cargar más</button>
                                        }
                                    </td>
                                    <td colSpan="1">
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
            </div>
            <GoTopBtn />
        </div>
    );
}

export default Inventory;
