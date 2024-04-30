// Customers.js
import React, { useState, useEffect } from 'react';
import styles from './inventory.module.css';
import clients from '../../assets/img/inventory.png';
import { Link } from 'react-router-dom';


const Inventory = () => {
    const [editingRow, setEditingRow] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState([
        { producto: "Vape1", stock: "77", precio: "23", status: "good", selected: false },
        { producto: "Vape1", stock: "77", precio: "23", status: "low", selected: false },
        { producto: "Vape1", stock: "77", precio: "23", status: "good", selected: false },
        { producto: "Vape1", stock: "77", precio: "23", status: "low", selected: false },
        { producto: "Vape1", stock: "77", precio: "23", status: "low", selected: false },
    ]);
    const dataLength = data.length;
    const [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        const count = data.filter(item => item.selected).length;
        setSelectedCount(count);
    }, [data]);

    const handleEditClick = (index) => {
        setEditingRow(index);
    };

    const handleSaveClick = () => {
        setEditingRow(null);
    };

    const handleInputChange = (event, field, index) => {
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
        console.log(newData[index].selected); // Log the updated selected value
        setData(newData);
    };

    const renderTableCell = (value, field, index) => {
        if (index === editingRow && field !== "producto" && field !== "status") {
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(event) => handleInputChange(event, field, index)}
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
            <h2 className={styles.heading}>Inventario</h2>
            <h4>Ten mas control sobre tu negocio</h4>
            <Link to='/dashboard/inventory/set'><button className={styles.configinventory}><i class="fa-solid fa-dolly"></i> Configurar inventario</button></Link>
            </div>
            <div className={styles.topimage}>
            <img className={styles["back"]} src={clients} alt="Axolotl-Waiting" />
            </div>
        </div>
            
            <div className={styles.container}>
                {selectedCount > 0 && <div className={styles.selected}><p className={styles.counter}><strong>Selected:</strong> {selectedCount}</p><button className={styles.delete}><i className="fa-solid fa-trash"></i> Eliminar</button></div>}
                <div className={styles["table-wrapper"]}>
                    <table className={styles["inventory-table"]}>
                        <thead>
                            <tr>
                                <th className={styles["cell-select"]}>
                                    <input type="checkbox" onChange={handleSelectAll} checked={selectAll} />
                                </th>
                                <th>producto</th>
                                <th>stock</th>
                                <th>Precio</th>
                                <th>Status</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id} className={item.selected ? styles.selectedRow : ''}>
                                    <td className={styles["cell-select"]}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelect(index)}
                                            checked={item.selected}
                                        />
                                    </td>
                                    <td>{renderTableCell(item.producto, "producto", index)}</td>
                                    <td>{renderTableCell(item.stock, "stock", index)}</td>
                                    <td>{renderTableCell(item.precio, "precio", index)}</td>
                                    <td>{renderTableCell(item.status, "status", index)}</td>
                                    
                                    <td>
                                        {editingRow === index ? (
                                            <div><button onClick={handleSaveClick} className={styles.guardar}>Guardar</button><button className={styles.deletemini}><i className="fa-solid fa-trash"></i></button></div>
                                        ) : (
                                            <button onClick={() => handleEditClick(index)} className={styles.editar}>Editar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {dataLength > 4 &&
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
