import React, { useState } from 'react';
import styles from './Inventory.module.css';

const Inventory = () => {
    const [editingRow, setEditingRow] = useState(null);
    const [data, setData] = useState([
        { producto: "Producto 1", stock: "10", precio: "100", status: "low" },
        { producto: "Producto 2", stock: "20", precio: "200", status: "low" },
        { producto: "Producto 3", stock: "30", precio: "300", status: "low" }
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
        if (index === editingRow) {
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
            <h2 className={styles.heading}>Inventario</h2>
            <h4>Maneja tu inventario fácilmente con solo 3 clicks</h4>
            
            <div className={styles["table-wrapper"]}>
                <table className={styles["inventory-table"]}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Status</th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{renderTableCell(item.producto, "producto", index)}</td>
                                <td>{renderTableCell(item.stock, "stock", index)}</td>
                                <td>{renderTableCell(item.precio, "precio", index)}</td>
                                <td> {renderTableCell(item.status, "status", index)}</td>
                                <td>
                                    {editingRow === index ? (
                                        <button onClick={handleSaveClick}>Guardar</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(index)}>Editar</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Inventory;
