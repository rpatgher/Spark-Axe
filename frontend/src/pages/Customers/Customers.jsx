// Customers.js
import React, { useState, useEffect } from 'react';
import styles from './costumers.module.css';
import clients from '../../assets/img/clients.png';

const Customers = () => {
    const [editingRow, setEditingRow] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState([
        { nombre: "Remy", email: "remy@gmail.com", numero: "5500000", id: "001", selected: false },
        { nombre: "Issac", email: "shakalord@gmail.com", numero: "5500000", id: "002", selected: false },
        { nombre: "Joseph", email: "ratota@gmail.com", numero: "5500000", id: "003", selected: false },
        { nombre: "Joseph", email: "ratota@gmail.com", numero: "5500000", id: "004", selected: false },
        { nombre: "Joseph", email: "ratota@gmail.com", numero: "5500000", id: "005", selected: false },
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
        if (index === editingRow && field !== "id" && field !== "contacto") {
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
            <h2 className={styles.heading}>Clientes</h2>
            <h4>Acercate mas a tus clientes</h4>
            <img className={styles["imgA"]} src={clients} alt="Axolotl-Waiting" />
            <div className={styles.container}>
                {selectedCount > 0 && <div className={styles.selected}><p className={styles.counter}><strong>Selected:</strong> {selectedCount}</p><button className={styles.delete}><i className="fa-solid fa-trash"></i> Eliminar</button></div>}
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
                                    <td>{renderTableCell(item.nombre, "nombre", index)}</td>
                                    <td>{renderTableCell(item.email, "email", index)}</td>
                                    <td>{renderTableCell(item.numero, "numero", index)}</td>
                                    <td>{renderTableCell(item.id, "id", index)}</td>
                                    <td>
                                        <button onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${item.numero}`}><i className="fab fa-whatsapp"></i></button>
                                        <button onClick={() => window.location.href = `tel:${item.numero}`}>
                                            <i className="fas fa-phone-alt"></i>
                                        </button>
                                        <button onClick={() => window.location.href = `mailto:${item.email}`}><i className="fa-solid fa-envelope"></i></button>
                                    </td>
                                    <td>
                                        {editingRow === index ? (
                                            <div><button onClick={handleSaveClick} className={styles.guardar}>Guardar</button><button className={styles.deletemini}><i className="fa-solid fa-trash"></i></button></div>
                                        ) : (
                                            <button onClick={() => handleEditClick(index)} className={styles.editar}>Editar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {dataLength > 10 &&
                                <tr className={styles.megarow}>
                                    <td></td>
                                    <td colSpan="1">
                                        <strong>Clientes cargados: </strong>{dataLength}
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

export default Customers;
