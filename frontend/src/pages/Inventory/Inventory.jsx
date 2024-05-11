import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './inventory.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';

// **************** Images ****************
import clients from '../../assets/img/inventory.png';
import lunaAxImage from '../../assets/img/luna_ax.png';
import GoTopBtn from '../../components/Btns/GoTopBtn';


const Inventory = () => {
    const { auth } = useAuth();
    const [editingRow, setEditingRow] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState([]);
    const [currentElement, setCurrentElement] = useState({});
    const [inventory, setInventory] = useState({
        low: 10,
        medium: 20,
        high: 30
    });
    const dataLength = data.length;
    const [selectedCount, setSelectedCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [limitIncrement, setLimitIncrement] = useState(10);

    useEffect(() => {
        const count = data.filter(item => item.selected && item.visible).length;
        const visible = data.filter(item => item.visible).length;
        setVisibleCount(visible);
        setSelectedCount(count);
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
                setData(data);
            } catch (error) {
                console.log(error);
            }
        };
        return () => getElements();
    }, []);

    const handleEditClick = (index) => {
        setEditingRow(index);
    };

    const handleSaveClick = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            await clientAxios.put(`/api/elements/stock/${currentElement.id}`, currentElement, config);
        } catch (error) {
            console.log(error);
        }
        setEditingRow(null);
    };

    const handleInputChange = (event, field, index) => {
        setCurrentElement({
            ...data[index],
            [field]: event.target.value
        });
        const newData = [...data];
        newData[index][field] = event.target.value;
        setData(newData);
    };

    const handleSelectAll = () => {
        const newData = data.map(item => ({ ...item, selected: !selectAll }));
        setData(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...data];
        newData[index].selected = !newData[index].selected; // Update selected property
        setData(newData);
    };

    const renderTableCell = (value, field, index) => {
        if (index === editingRow && field !== "producto" && field !== "status") {
            return (
                <input
                    type="number"
                    className={styles["input-stock"]}
                    value={value}
                    onChange={(event) => handleInputChange(event, field, index)}
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
        } else if (stock >= inventory.medium) {
            item.status = "medium";
            return (<p className={`${styles.status} ${styles["status-medium"]}`}>Medio</p>);
        } else {
            item.status = "low";
            return (<p className={`${styles.status} ${styles["status-low"]}`}>Bajo</p>);
        }
    };

    return (
        <div className={styles["inventory-wrapper"]}>
            <div className={styles.top}>
                <div className={styles.topcontent}>
                    <h2 className={styles.heading}>Inventario</h2>
                    <h4>Ten mas control sobre tu negocio</h4>
                    <Link to='/dashboard/inventory/set'><button className={styles.configinventory}><i className="fa-solid fa-dolly"></i> Configurar inventario</button></Link>
                </div>
                <div className={styles.topimage}>
                    <img className={styles["back"]} src={clients} alt="Axolotl-Waiting" />
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
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className={styles.noproducts}>
                                        <div>
                                            <img className={styles["imgAX"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                                        </div>
                                        No hay productos aún. <Link to="/dashboard/products/new">Crea uno.</Link></td>
                                </tr>
                            ):
                                data.map((item, index) => {
                                    if(index < limit){
                                        item.visible = true;
                                        return (
                                            <tr 
                                                
                                            >
                                                
                                                <td>{item.name}</td>
                                                <td>{renderTableCell(item.stock, "stock", index)}</td>
                                                <td>{renderTableCell(item.price, "price", index)}</td>
                                                <td>{setStatus(item.stock, item)}</td>

                                                <td>
                                                    {editingRow === index ? (
                                                        <div>
                                                            <button
                                                                onClick={handleSaveClick}
                                                                className={styles.guardar}
                                                            >Guardar</button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleEditClick(index)} className={styles.editar}>Editar</button>
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
