import React, { useState } from 'react';
import styles from './costumers.module.css';

const Customers = () => {
    const [editingRow, setEditingRow] = useState(null);
    const [data, setData] = useState([
        { nombre: "Remy", email: "remy@gmail.com", numero: "5500000", id: "001" },
        { nombre: "Issac", email: "shakalord@gmail.com", numero: "5500000", id: "002" },
        { nombre: "Joseph", email: "ratota@gmail.com", numero: "5500000", id: "003" }
    ]);

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

    const renderTableCell = (value, field, index) => {
        if (index === editingRow && field !== "id") {
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
            
            <div className={styles["table-wrapper"]}>
                <table className={styles["inventory-table"]}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Numero</th>
                            <th>ID</th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{renderTableCell(item.nombre, "nombre", index)}</td>
                                <td>{renderTableCell(item.email, "email", index)}</td>
                                <td>{renderTableCell(item.numero, "numero", index)}</td>
                                <td>{renderTableCell(item.id, "id", index)}</td>
                                <td>
                                    {editingRow === index ? (
                                        <button onClick={handleSaveClick}>Guardar</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(index)}>Editar</button>
                                    )}
                                </td>
                            </tr>

                        ))}
                        <tr className={styles.megarow}>
                                <td colSpan="5">
                                    Solo se pueden ver 20 clientes a la vez 
                                </td>
                            </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Customers;
