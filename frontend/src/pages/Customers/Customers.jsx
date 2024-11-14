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

// ******************** Components ********************
import FloatAlert from '../../components/Alert/FloatAlert';
import Modal from '../../components/Modals/GeneralModal';
import SearcherDashboard from '../../components/SearcherDashboard/SearcherDashboard';
import TableDashboard from '../../components/TableDashboard/TableDashboard';
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';

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

    const [modalDelete, setModalDelete] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const count = filteredElements.filter(item => item.selected && item.visible).length;
        const countVisible = filteredElements.filter(item => item.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredElements, limit]);

    useEffect(() => {
        const newData = [...filteredElements];
        newData.forEach(item => item.selected = false);
        setFilteredElements(newData);
    }, [data]);

    const sortedElements = data.sort((a, b) => {
        if (order === 'asc') {
            if (orderType === 'id') {
                return a.index - b.index;
            }
            if (orderType === 'name') {
                return a.name.localeCompare(b.name);
            }
        }
        if (order === 'desc') {
            if (orderType === 'id') {
                return b.index - a.index;
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
                handleAlert("An error ocurred", true);
            }
        }
        return () => getCustomers();
    }, []);

    const filterElements = (search, visible) => {
        setSelectAll(false);
        setFilteredElements(filteredElements.map(item => item.selected = false));
        const visibleFiltered = data.filter(item => {
            if (visible === 'all') {
                return item;
            }
            if (visible === 'confirmed') {
                return item.confirmed;
            }
            if (visible === 'unconfirmed') {
                return !item.confirmed;
            }
        });
        if (search === '') {
            setFilteredElements(visibleFiltered);
            return;
        }
        const filtered = visibleFiltered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
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

    const handleSaveClick = async (itemId) => {
        const currentElement = data.find(item => item.id === itemId);
        const { name, email, phone } = currentElement;
        if (!name || !email || !phone) {
            handleAlert("Todos los campos son necesarios", true);
            return;
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
            await clientAxios.put(`/api/customers/${currentElement.id}`, currentElement, config);
            handleAlert("Cambios guardados correctamente", false);
            filterElements(search, visible);
        } catch (error) {
            console.log(error);
            handleAlert("Hubo un error al guardar los cambios", true);
        }
        setEditingRow(null);
        setLoading(false);

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
        const newData = filteredElements.map(item => (item.visible ? { ...item, selected: !selectAll } : item));
        setFilteredElements(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...filteredElements];
        newData[index].selected = !newData[index].selected; // Update selected property
        setFilteredElements(newData);
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


    const deleteSelected = async () => {
        const selected = filteredElements.filter(item => item.selected);
        const ids = selected.map(item => item.id);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            await clientAxios.post(`/api/customers/delete`, { ids }, config);
            setData(data.filter(item => !ids.includes(item.id)));
            setFilteredElements(filteredElements.filter(item => !ids.includes(item.id)));
            handleAlert("Clientes eliminados correctamente", false);
            // filterElements(search, visible);
        } catch (error) {
            console.log(error);
            if(error?.response?.data?.msg === 'Cannot delete some customers'){
                handleAlert('No se pudieron eliminar algunos clientes, porque alguno están asociado a un pedido', true);
                setData(data.filter(item => !error.response.data.customers.map(customer => customer.id).includes(item.id)));
                setFilteredElements(filteredElements.filter(item => !error.response.data.customers.map(customer => customer.id).includes(item.id)));
            }else{
                handleAlert("Hubo un error al eliminar los clientes", true);
                setData(data);
                setFilteredElements(filteredElements);
            }
        } finally {
            setSelectAll(false);
            setModalDelete(false);
        }
    }

    return (
        <div className={styles["customers-wrapper"]}>
            {/* {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />} */}
            <PageHeaderDash 
                title={'Clientes'}
                description={'Acercate mas a tus clientes'}
                image={clients}
            />
            <div className={styles.container}>
                <div className={`${styles.filters} `}>
                    <SearcherDashboard 
                        setSearch={setSearch}
                        filterList={filterElements}
                        visible={visible}
                        setOrder={setOrder}
                        order={order}
                        setOrderType={setOrderType}
                        orderType={orderType}
                        sortedList={sortedElements}
                        setFilteredList={setFilteredElements}
                        setSelectAll={setSelectAll}
                        options={[
                            { name: 'Número de ID', type: 'id' },
                            { name: 'Nombre', type: 'name' },
                        ]}
                        listName='clientes por nombre'
                    />
                </div>
                <TableDashboard
                    columns={editingRow !== null ? [
                        { prop: 'checkbox', width: '5%' },
                        { prop: 'Nombre', width: '10%' },
                        { prop: 'Apellido', width: '10%' },
                        { prop: 'Email', width: '15%' },
                        { prop: 'Número', width: '15%' },
                        { prop: 'ID', width: '10%' },
                        { prop: 'Contacto', width: '15%' },
                        { prop: 'Confirmado', width: '5%' },
                        { prop: 'actions', width: '15%' },
                    ] : [
                        { prop: 'checkbox', width: '5%' },
                        { prop: 'Nombre', width: '20%' },
                        { prop: 'Email', width: '15%' },
                        { prop: 'Número', width: '15%' },
                        { prop: 'ID', width: '10%' },
                        { prop: 'Contacto', width: '15%' },
                        { prop: 'Confirmado', width: '5%' },
                        { prop: 'actions', width: '15%' },
                    ]}
                    listLength={filteredElements.length}
                    filterList={filterElements}
                    search={search}
                    visibleCount={visibleCount}
                    selectedCount={selectedCount}
                    handleSelectAll={handleSelectAll}
                    setSelectAll={setSelectAll}
                    selectAll={selectAll}
                    limit={limit}
                    setLimit={setLimit}
                    visible={visible}
                    setVisible={setVisible}
                    visibleOptions={[
                        { name: 'Confirmados', type: 'confirmed' },
                        { name: 'No Confirmados', type: 'unconfirmed' },
                    ]}
                    setModalDelete={setModalDelete}
                    listName='clientes  por nombre'
                    colspan={editingRow !== null ? [4,4,4] : [3,3,3]}
                >
                    {filteredElements.map((item, index) => {
                        if (index < limit) {
                            item.visible = true;
                            return (
                                <tr 
                                    key={item.id} 
                                    className={item.selected ? styles.selectedRow : ''}
                                >
                                    <td className={styles["cell-select"]}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelect(index)}
                                            checked={item.selected || false}
                                            disabled={editingRow !== null}
                                            style={{
                                                cursor: editingRow !== null ? "not-allowed" : "pointer"
                                            }}
                                        />
                                    </td>
                                    
                                    {editingRow === item.id ? (
                                        <>
                                            <td>{renderTableCell(item.name, "name", item.id)}</td>
                                            <td>{renderTableCell(item.lastname, "lastname", item.id)}</td>
                                        </>
                                    ) : (
                                        <td
                                            colSpan={editingRow !== null ? 2 : 1}
                                        >{renderTableCell(item.name + " " + item.lastname, "name", item.id)}</td>
                                    )}
                                    <td>{renderTableCell(item.email, "email", item.id)}</td>
                                    <td>{renderTableCell(item.phone, "phone", item.id)}</td>
                                    <td>{String(item.index).padStart(10, '0')}</td>
                                    <td>
                                        <button className={styles.contactbtn} onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${item.numero}`}><i className="fab fa-whatsapp"></i></button>
                                        <button className={styles.contactbtnt} onClick={() => window.location.href = `tel:${item.numero}`}>
                                            <i className="fas fa-phone-alt"></i>
                                        </button>
                                        <button className={styles.contactbtn} onClick={() => window.location.href = `mailto:${item.email}`}><i className="fa-solid fa-envelope"></i></button>
                                    </td>
                                    <td className={styles["cell-confirmed"]}>
                                        <p className={`${styles.confirmed} ${item.confirmed ? styles["confirmed-yes"] : styles["confirmed-no"]}`}>
                                            {item.confirmed ? "Sí" : "No"}
                                        </p>
                                    </td>
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
                        } else {
                            item.visible = false;
                            item.selected = false;
                        }
                    })}
                </TableDashboard>
            </div>
            {modalDelete && 
                <Modal 
                    modalActive={setModalDelete}
                    text='¿Estás seguro de eliminar los productos seleccionados?'
                    actionBtnText='Eliminar'
                    actionBtnLoadingText='Eliminando...'
                    actionModal={deleteSelected}
                />
            }
        </div>
    );
}

export default Customers;
