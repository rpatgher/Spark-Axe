import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Images ********************
import Contactimg from '../../assets/img/Illustrations/Contact.png';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Helpers ********************
import formatDate from "../../helpers/formatDate";

// **************** Styles ****************
import styles from './Contact.module.css';

// ********************* Components ********************
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';
import Modal from '../../components/Modals/GeneralModal';
import SearcherDashboard from '../../components/SearcherDashboard/SearcherDashboard';
import TableDashboard from '../../components/TableDashboard/TableDashboard';

const Contact = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();

    const [contacts, setContacts] = useState([]);

    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('name');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [limit, setLimit] = useState(10);

    const [contactMessage, setContactMessage] = useState({});

    const [show, setShow] = useState(false);

    const [modalDelete, setModalDelete] = useState(false);
    

    const showModal = () => {
        setTimeout(() => {
            setShow(true);
        }, 300);
    }

    const unshowModal = () => {
        setShow(false);
        setTimeout(() => {
            setContactMessage({});
        }, 300);
    }



    useEffect(() => {
        const getContacts = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/contacts/${auth.websites[0].id}`, config);
                setContacts(response.data);
                setFilteredContacts(response.data);
            } catch (error) {
                console.log(error);
                handleAlert('Error al obtener los contactos', true);
            } 
        }
        return () => getContacts();
    }, []);

    useEffect(() => {
        const count = filteredContacts.filter(contact => contact.selected).length;
        const countVisible = filteredContacts.filter(contact => contact.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredContacts, limit]);

    const sordedContacts = filteredContacts.sort((a, b) => {
        if(order === 'asc'){
            if(orderType === 'name'){
                return a.name.localeCompare(b.name);
            }
            if (orderType === "date") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        }
        if(order === 'desc'){
            if(orderType === 'name'){
                return b.name.localeCompare(a.name);
            }
            if (orderType === "date") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
        }
    });

    const filterContacts = (search, visible) => {
        setSelectAll(false);
        setFilteredContacts(filteredContacts.map(contact => contact.selected = false));
        const visibleContacts = contacts.filter(contact => {
            if(visible === 'all'){
                return contact;
            }
            if(visible === 'completed'){
                return contact.completed;
            }
            if(visible === 'incompleted'){
                return !contact.completed;
            }
        });
        if (search === '') {
            return setFilteredContacts(visibleContacts);
        }
        const searchAdvertisements = visibleContacts.filter(contact => {
            return contact.name.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredContacts(searchAdvertisements);
    }


    const handleSelectAll = () => {
        const newData = filteredContacts.map(contact => (contact.visible ? {...contact, selected: !selectAll} : contact));
        setFilteredContacts(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...filteredContacts];
        newData[index].selected = !newData[index].selected;
        setFilteredContacts(newData);
    }

    const handleChangeStatus = async (e) => {
        const status = e.target.value;
        const id = e.target.dataset.id;
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            document.body.style.cursor = "wait";
            const response = await clientAxios.put(`/api/contacts/${auth.websites[0].id}/${id}`, { status }, config);
            if(response.status === 200 ||   response.status === 201){
                setContacts(contacts.map(contact => {
                    if(contact.id === id){
                        contact.completed = status === 'C' ? true : false;
                    }
                    return contact;
                }));
                setFilteredContacts(filteredContacts.map(contact => {
                    if(contact.id === id){
                        contact.completed = status === 'C' ? true : false;
                    }
                    return contact;
                }));
                filterContacts(search, visible);
                handleAlert("Estatus actualizado correctamente", false);
            }
        } catch (error) {
            console.log(error);
            handleAlert("Hubo un error al actualizar el estatus", true);
        } finally {
            document.body.style.cursor = "default";
        }
    }

    const deleteSelected = async () => {
        const selected = filteredContacts.filter(contact => contact.selected);
        const ids = selected.map(contact => contact.id);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            await clientAxios.post(`/api/contacts/delete`, { ids }, config);
            setContacts(contacts.filter(contact => !ids.includes(contact.id)));
            setFilteredContacts(filteredContacts.filter(contact => !ids.includes(contact.id)));
            handleAlert('Contactos eliminados correctamente', false);
        } catch (error) {
            console.log(error);
            handleAlert('Error al eliminar los contactos', true);
            let newData = [...filteredContacts];
            newData = filteredContacts.map(contact => contact.selected = false);
            setFilteredContacts(newData);
        } finally {
            setSelectAll(false);
            setModalDelete(false);
        }
    }

    return (
        <div className={styles['contact-wrapper']}>
            <PageHeaderDash 
                title={'Contacto'}
                description={'Mantente en contacto con tus clientes'}
                image={Contactimg}
            />
            <div className={`${styles.filters}`}>
                <SearcherDashboard 
                    setSearch={setSearch}
                    filterList={filterContacts}
                    visible={visible}
                    setOrder={setOrder}
                    order={order}
                    setOrderType={setOrderType}
                    orderType={orderType}
                    sortedList={sordedContacts}
                    setFilteredList={setFilteredContacts}
                    setSelectAll={setSelectAll}
                    options={[
                        {name: 'Nombre', type: 'name'},
                        {name: 'Fecha', type: 'date'}
                    ]}
                    listName={'contactos'}
                />
            </div>
            <TableDashboard 
                columns={[
                    {prop: 'checkbox', width: '5%'},
                    {prop: 'Nombre', width: '15%'},
                    {prop: 'Email', width: '15%'},
                    {prop: 'Teléfono', width: '15%'},
                    {prop: 'Fecha', width: '20%'},
                    {prop: 'Estatus', width: '15%'},
                    {prop: 'actions', width: '15%'},
                ]}
                listLength={filteredContacts.length}
                filterList={filterContacts}
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
                    {type: 'completed', name: 'Completados'},
                    {type: 'incompleted', name: 'No Completados'}
                ]}
                listName={'contactos'}
                colspan={[3,2,2]}
                setModalDelete={setModalDelete}
            >
                {filteredContacts.map((contact, index) => {
                    if(index < limit){
                        contact.visible = true;
                        return (
                            <tr 
                                key={contact.id}
                                className={`${contact.selected ? styles.selectedRow : ''} ${styles["contact-row"]}`}
                            >
                                <td className={styles["cell-select"]}>
                                    <input 
                                        type="checkbox"
                                        checked={contact.selected || false}
                                        onChange={() => handleSelect(index)}
                                    />
                                </td>
                                <td className={styles["cell-name"]}>{contact.name} {contact.lastname}</td>
                                <td className={styles["cell-email"]}>{contact.email}</td>
                                <td className={styles["cell-phone"]}>{contact.phone || '--'}</td>
                                <td className={styles["cell-date"]}>{formatDate(contact.createdAt)}</td>
                                {/* <td className={styles["cell-completed"]}><div className={`${contact.completed ? styles.completed : styles.incompleted}`}>{contact.completed ? 'Completado' : 'No Completado'}</div></td> */}
                                <td className={styles["cell-completed"]}>
                                    <select
                                            className={`${styles.select} ${contact.completed ? styles.completed : styles.incompleted}`}
                                            value={contact.completed ? 'C' : 'NC'}
                                            data-id={contact.id}
                                            onChange={handleChangeStatus}
                                        >
                                            <option value="C">
                                                Completado
                                            </option>
                                            <option value="NC">
                                                No Completado
                                            </option>
                                        </select>
                                </td>
                                <td className={styles["cell-message"]}>
                                    <button 
                                        className={styles["show-message"]}
                                        onClick={() => {
                                            setContactMessage(contact);
                                            showModal();
                                        }}
                                    >
                                        Ver Mensaje
                                    </button>
                                </td>
                            </tr>
                        )
                    } else {
                        contact.visible = false;
                        contact.selected = false;
                    }
                })}
            </TableDashboard>
            {contactMessage.name &&
                <div className={styles["modal-wrapper"]}>
                    <div className={`${styles["modal-message"]} ${show ? styles.show : ''}`}>
                        <button 
                            className={styles["close-modal"]}
                            onClick={unshowModal}
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                        <h2>Detalles del Contacto</h2>
                        <hr />
                        <p className={styles.from}>De: <span>{contactMessage.name} {contactMessage.lastname}</span></p>
                        <p className={styles.label}>Mensaje:</p>
                        <p className={styles.message}>{contactMessage.message}</p>
                    </div>
                </div>
            }
            {modalDelete && 
                <Modal 
                    modalActive={setModalDelete}
                    text='¿Estás seguro de eliminar los contactos seleccionados?'
                    actionBtnText='Eliminar'
                    actionBtnLoadingText='Eliminando...'
                    actionModal={deleteSelected}
                />
            }
        </div>
    )
}
export default Contact;