// Customers.js
import React, { useState, useEffect } from 'react';
import styles from './inventory.module.css';
import clients from '../../assets/img/inventory.png';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import clientAxios from '../../config/clientAxios';


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

    useEffect(() => {
        const count = data.filter(item => item.selected).length;
        setSelectedCount(count);
    }, [data]);

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
            return value;
        }
    };

    const setStatus = (stock) => {
        if (stock >= inventory.high) {
            return "Alto";
        } else if (stock >= inventory.medium) {
            return "Medio";
        } else {
            return "Bajo";
        }
    };

    return (
        <>
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
                {selectedCount > 0 && 
                    <div className={styles.selected}>
                        <p className={styles.counter}><strong>Selected:</strong> {selectedCount}</p>
                        <button className={styles.delete}><i className="fa-solid fa-trash"></i>Eliminar</button>
                    </div>
                }
                <div className={styles["table-wrapper"]}>
                    <table className={styles["inventory-table"]}>
                        <thead>
                            <tr>
                                <th className={styles["cell-select"]}>
                                    <input type="checkbox" onChange={handleSelectAll} checked={selectAll} />
                                </th>
                                <th className={styles["cell-product"]}>Producto</th>
                                <th className={styles["cell-stock"]}>Cantidad</th>
                                <th className={styles["cell-price"]}>Precio</th>
                                <th className={styles["cell-status"]}>Estatus</th>
                                <th className={styles["cell-edit"]}>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id} className={item.selected ? styles.selectedRow : ''}>
                                    <td className={styles["cell-select"]}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelect(index)}
                                            checked={item.selected || false}
                                        />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{renderTableCell(item.stock, "stock", index)}</td>
                                    <td>{renderTableCell(item.price, "price", index)}</td>
                                    <td>{setStatus(item.stock)}</td>

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
                            ))}
                            {dataLength > 2 &&
                                <tr className={styles.megarow}>
                                    <td></td>
                                    <td colSpan="1">
                                        <strong>Inventario cargados: </strong>{dataLength}
                                    </td>
                                    <td colSpan="3">
                                        <button className={styles.cargar}>Cargar mas</button>
                                    </td>
                                    <td colSpan="2"></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Inventory;
