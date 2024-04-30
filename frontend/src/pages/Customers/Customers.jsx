// Customers.js
import React, { useState, useEffect } from 'react';
import styles from './costumers.module.css';

const Customers = () => {
    const [editingRow, setEditingRow] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState([
        { nombre: "Remy", email: "remy@gmail.com", numero: "5500000", id: "001", selected: false },
        { nombre: "Issac", email: "shakalord@gmail.com", numero: "5500000", id: "002", selected: false },
        { nombre: "Joseph", email: "ratota@gmail.com", numero: "5500000", id: "003", selected: false },
        { nombre: "Joseph", email: "ratota@gmail.com", numero: "5500000", id: "003", selected: false },
        { nombre: "Joseph", email: "ratota@gmail.com", numero: "5500000", id: "003", selected: false },
       
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
        newData[index].selected = !data[index].selected;
        setData(newData);
    };
    const [email] = useState("crreo@correo.gmail.com");

    const handleEmailClick = () => {
      window.location.href = `mailto:${email}`;
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
            <div className={styles.container}>
                {selectedCount > 0 && <p className={styles.counter}>Selected: {selectedCount}</p>}
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
        <tr key={index}>
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
                <button onClick={() => window.location.href =`https://api.whatsapp.com/send?phone=${item.phone}`}><i className="fab fa-whatsapp"></i></button>
                <button onClick={() => window.location.href = `tel:${item.phone}`}>
  <i className="fas fa-phone-alt"></i>
</button>

                    <button onClick={() => window.location.href = `mailto:${item.email}`}><i className="fa-solid fa-envelope"></i></button>
                </td>
            <td>
                {editingRow === index ? (
                    <button onClick={handleSaveClick} className={styles.guardar}>Guardar</button>
                ) : (
                    <button onClick={() => handleEditClick(index)} className={styles.editar}>Editar</button>
                )}
            </td>
        </tr>
    ))}
   {dataLength > 20 && 
    <tr className={styles.megarow}>
        <td colSpan="6">
            <button className={styles.cargar}>Cargar mas</button>
        </td>
    </tr>}
</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Customers;
