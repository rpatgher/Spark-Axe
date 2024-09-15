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
import Inventoryimg from '../../assets/img/Illustrations/Inventory.png';

// ******************** Components ********************
import FloatAlert from '../../components/Alert/FloatAlert';
import SearcherDashboard from '../../components/SearcherDashboard/SearcherDashboard';
import TableDashboard from '../../components/TableDashboard/TableDashboard';
import GoTopBtn from '../../components/Btns/GoTopBtn';
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';

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
                handleAlert("Error al obtener los elementos", true);
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
                return `${formatToMoney(value)} MXN`;
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
            {/* {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />} */}
            <PageHeaderDash 
                title={'Inventario'}
                description={'Ten mas control sobre tu negocio'}
                image={Inventoryimg}
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
                    options={[
                        {name: 'Nombre', type: 'name'},
                        {name: 'Cantidad', type: 'stock'},
                        {name: 'Precio', type: 'price'}
                    ]}
                    listName='productos'
                />
                <Link to='/dashboard/inventory/set'><button className={styles.configinventory}><i className="fa-solid fa-dolly"></i> Configurar inventario</button></Link>
            </div>
            <TableDashboard
                columns={[
                    {prop: 'Producto', width: '30%'},
                    {prop: 'Cantidad', width: '10%'},
                    {prop: 'Precio', width: '20%'},
                    {prop: 'Estado', width: '10%'},
                    {prop: 'actions', width: '20%'},
                ]}
                listLength={filteredProducts.length}
                filterList={filterProducts}
                search={search}
                visibleCount={visibleCount}
                limit={limit}
                setLimit={setLimit}
                visible={visible}
                setVisible={setVisible}
                visibleOptions={[
                    {name: 'Alto', type: 'high'},
                    {name: 'Medio', type: 'medium'},
                    {name: 'Bajo', type: 'low'},
                ]}
                listName='productos'
                createNew='/dashboard/products/new'
                colspan={[3,1,1]}
            >
                {filteredProducts.map((item, index) => {
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
                                        <div className={styles["save-cancel"]}>
                                            <button
                                                onClick={() => handleSaveClick(item.id)}
                                                className={`${styles.guardar} ${loading ? styles.loading : ""}`}
                                            >
                                                <i className="fa-solid fa-save"></i>
                                                {loading ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button
                                                className={styles.cancel}
                                                onClick={() => {
                                                    setEditingRow(null);
                                                    setData(data.map(item => {
                                                        item.selected = false;
                                                        return item;
                                                    }));
                                                }}
                                            >
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    ) : editingRow === null ? (
                                        <button 
                                            onClick={() => handleEditClick(item.id)} 
                                            className={styles.editar}
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                            Editar
                                        </button>
                                    ) : (
                                        <p></p>
                                    )}
                                </td>
                            </tr>
                        )
                    }else{
                        item.visible = false;
                    }
                })}
            </TableDashboard>
            <GoTopBtn />
        </div>
    );
}

export default Inventory;
