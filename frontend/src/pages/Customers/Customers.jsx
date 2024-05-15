import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './costumers.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Images ********************
import clients from '../../assets/img/clients.png';
import lunaAxImage from '../../assets/img/luna_ax.png';

// ******************** Components ********************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';

const Customers = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [editingRow, setEditingRow] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState([]);
    const [currentElement, setCurrentElement] = useState({});

    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('id');
    const [filteredElements, setFilteredElements] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');
    const [dataLength, setDataLength] = useState(0);
    const [selectedCount, setSelectedCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [limitIncrement, setLimitIncrement] = useState(10);

    useEffect(() => {
        const count = filteredElements.filter(item => item.selected && item.visible).length;
        const countVisible = filteredElements.filter(item => item.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredElements, limit]);

    const sortedElements = data.sort((a, b) => {
        if (order === 'asc') {
            if (orderType === 'id') {
                return a.id - b.id;
            }
            if (orderType === 'name') {
                return a.name.localeCompare(b.name);
            }
        }
        if (order === 'desc') {
            if (orderType === 'id') {
                return b.id - a.id;
            }
            if (orderType === 'name') {
                return b.name.localeCompare(a.name);
            }
        }
    });

    useEffect(() => {
        const getCustomers = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/customers/all/${auth.websites[0].id}`, config);
                setData(response.data);
                setFilteredElements(response.data);
                setDataLength(response.data.length);
            } catch (error) {
                console.log(error);
                handleAlert("error", "An error ocurred");
            }
        }
        return () => getCustomers();
    }, []);

    const handleOrder = (e) => {
        setSelectAll(false);
        setOrder(e.target.value);
        setFilteredElements(sortedElements);
    };

    const handleOrderType = (e) => {
        setSelectAll(false);
        setOrderType(e.target.value);
        setFilteredElements(sortedElements);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        filterElements(e.target.value, visible);
    };

    const handleVisible = (e) => {
        setVisible(e.target.dataset.value);
        filterElements(search, e.target.dataset.value);
    };

    const filterElements = (search, visible) => {
        setSelectAll(false);
        setFilteredElements(filteredProducts.map(product => product.selected = false));
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
            setFilteredElements(visibleFiltered);
            return;
        }
        const filtered = visibleFiltered.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
        setFilteredElements(filtered);
    };

    const handleEditClick = (itemId) => {
        setEditingRow(itemId);
        setData(data.map(item => {
            if (item.id === itemId) {
                setCurrentElement({ ...item });
                item.selected = true;
            } else {
                item.selected = false;
            }
            return item;
        }));
    };

    const handleSaveClick = (itemId) => {
        setEditingRow(null);
    };

    const handleInputChange = (event, field, itemId) => {
        setCurrentElement({
            ...currentElement,
            [field]: event.target.value
        });
        setData(data.map(item => {
            if (item.id === itemId) {
                item[field] = event.target.value;
            }
            return item;
        }));
    };

    const handleSelectAll = () => {
        const newData = data.map(item => ({ ...item, selected: !selectAll }));
        setData(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...data];
        newData[index].selected = !newData[index].selected; // Update selected property
        console.log(newData[index].selected); // Log the updated selected value
        setData(newData);
    };

    const renderTableCell = (value, field, itemId) => {
        if (itemId === editingRow && field !== "id" && field !== "contacto") {
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(event) => handleInputChange(event, field, itemId)}
                />
            );
        } else {
            return value;
        }
    };

    return (
        <>
            <div className={styles.top}>
                <div className={styles.topcontent}>
                    <HeadingsRuta
                        currentHeading="Clientes"
                        routes={[]}
                    />
                    <h4>Acercate mas a tus clientes</h4>
                </div>
                <div className={styles.topimage}>
                    <img className={styles["back"]} src={clients} alt="Axolotl-Waiting" />
                </div>
            </div>
            <div className={styles.container}>
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
                </div>
                <div className={styles["Filtertabs"]}>
                    <div className={styles["radio-inputs"]}>
                        <p className={styles.visibles}>Visibles: </p>
                        <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "all" ? styles.active : ''}`} data-value="all">Todos</button>
                        <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "published" ? styles.active : ''}`} data-value="published">Confirmada</button>
                        <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "unpublished" ? styles.active : ''}`} data-value="unpublished">Unonfirmada</button>
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
                    <table className={styles["inventory-table"]}>
                        <thead>
                            <tr>
                                <th className={styles["cell-select"]}>
                                    <input type="checkbox" onChange={handleSelectAll} checked={selectAll} />
                                </th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Numero</th>
                                <th>ID</th>
                                <th>Contacto</th>
                                <th>Confirmado</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className={styles.noproducts}>
                                        <div>
                                            <img className={styles["imgAX"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                                        </div>
                                        No cuentas con clientes aún.</td>
                                </tr>
                            ) :
                                data.map((item, index) => {
                                    if (index < limit) {
                                        item.visible = true;
                                        return (
                                            <tr key={item.id} className={item.selected ? styles.selectedRow : ''}>
                                                <td className={styles["cell-select"]}>
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => handleSelect(item.id)}
                                                        checked={item.selected}
                                                    />
                                                </td>
                                                <td>{renderTableCell(item.name, "name", item.id)}</td>
                                                <td>{renderTableCell(item.email, "email", item.id)}</td>
                                                <td>{renderTableCell(item.phone, "phone", item.id)}</td>
                                                <td>{String(item.id).padStart(10, '0')}</td>
                                                <td>
                                                    <button className={styles.contactbtn} onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${item.numero}`}><i className="fab fa-whatsapp"></i></button>
                                                    <button className={styles.contactbtnt} onClick={() => window.location.href = `tel:${item.numero}`}>
                                                        <i className="fas fa-phone-alt"></i>
                                                    </button>
                                                    <button className={styles.contactbtn} onClick={() => window.location.href = `mailto:${item.email}`}><i className="fa-solid fa-envelope"></i></button>
                                                </td>
                                                <td className={styles["col-confirmed"]}>
                                                    <p className={`${styles.confirmed} ${item.confirmed ? styles["confirmed-yes"] : styles["confirmed-no"]}`}>
                                                        {item.confirmed ? "Sí" : "No"}
                                                    </p>
                                                </td>
                                                <td>
                                                    {editingRow === item.id ? (
                                                        <div>
                                                            <button
                                                                onClick={() => handleSaveClick(item.id)}
                                                                className={styles.guardar}
                                                            >Guardar</button>
                                                            <button
                                                                className={styles.deletemini}
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditClick(item.id)}
                                                            className={styles.editar}
                                                        >Editar</button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    } else {
                                        item.visible = false;
                                        item.selected = false;
                                    }
                                })}
                            {dataLength > limitIncrement &&
                                <tr className={styles.megarow}>
                                    <td colSpan="4"></td>
                                    <td colSpan="1">
                                        <strong>Clientes cargados: </strong>{visibleCount}
                                    </td>
                                    <td colSpan="1">
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
                                    <td colSpan="1">
                                        {limit > limitIncrement &&
                                            <button
                                                className={styles.cargar}
                                                type='button'
                                                onClick={() => setLimit(limit - limitIncrement)}
                                            >Cargar menos</button>
                                        }
                                    </td>
                                    <td colSpan="3"></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Customers;
