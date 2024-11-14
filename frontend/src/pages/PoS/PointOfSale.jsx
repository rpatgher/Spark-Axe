import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Images ********************
import POSimg from '../../assets/img/Illustrations/POS.png';

// *************** Styles ***************
import styles from './PointOfSale.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ********************* Components ********************
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';
import Modal from '../../components/Modals/GeneralModal';
import TableDashboard from '../../components/TableDashboard/TableDashboard';
import SearcherDashboard from '../../components/SearcherDashboard/SearcherDashboard';

const PointOfSale = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [poss, setPoss] = useState([]);

    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('name');
    const [filteredPoss, setFilteredPoss] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [limit, setLimit] = useState(10);

    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        const count = filteredPoss.filter(pos => pos.selected && pos.visible).length;
        const countVisible = filteredPoss.filter(pos => pos.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredPoss, limit]);

    useEffect(() => {
        const newData = [...filteredPoss];
        newData.map(pos => pos.selected = false);
        setFilteredPoss(newData);
    }, [poss]);
        

    const sordedPoss = poss.sort((a, b) => {
        if(order === 'asc'){
            if(orderType === 'name'){
                return a.name.localeCompare(b.name);
            }
        }
        if(order === 'desc'){
            if(orderType === 'name'){
                return b.name.localeCompare(a.name);
            }
        }
    });

    useEffect(() => {
        const getPoS = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/pos/all/${auth.websites[0].id}`, config);
                setPoss(response.data);
                setFilteredPoss(response.data);
            } catch (error) {
                console.log(error);
                handleAlert('No se pudo obtener la lista de puntos de venta', true);
            }
        }
        return () => getPoS();
    }, []);


    const filterPoss = (search, visible) => {
        setSelectAll(false);
        setFilteredPoss(filteredPoss.map(pos => pos.selected = false));
        const visiblePoss = poss.filter(pos => {
            if(visible === 'all'){
                return pos;
            }
            if(visible === 'selected'){
                return pos.selected;
            }
            if(visible === 'unselected'){
                return !pos.selected;
            }
        });
        if ( search === '' ) {
            setFilteredPoss(visiblePoss);
            return;
        }
        const seachPoss = visiblePoss.filter(pos => pos.name.toLowerCase().includes(search.toLowerCase()));
        setFilteredPoss(seachPoss);
    }

    const handleSelectAll = () => {
        const newData = filteredPoss.map(pos => (pos.visible ? {...pos, selected: !selectAll} : pos));
        setFilteredPoss(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...filteredPoss];
        newData[index].selected = !newData[index].selected;
        setFilteredPoss(newData);
    }

    const deleteSelected = async () => {
        const selected = filteredPoss.filter(pos => pos.selected);
        const ids = selected.map(pos => pos.id);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            await clientAxios.post('/api/pos/delete', { ids }, config);
            handleAlert('Puntos de venta eliminados', false);
            setPoss(poss.filter(pos => !ids.includes(pos.id)));
            setFilteredPoss(filteredPoss.filter(pos => !ids.includes(pos.id)));
        } catch (error) {
            console.log(error);
            handleAlert('No se pudo eliminar los puntos de venta', true);
            if(error?.response?.data?.msh === 'Cannot delete some PoS'){
                handleAlert('No se pudo eliminar algunos puntos de venta', true);
                setPoss(poss.filter(pos => !error.response.data.pos.map(p => p.id).includes(pos.id)));
                setFilteredPoss(filteredPoss.filter(pos => !error.response.data.pos.map(p => p.id).includes(pos.id)));
            } else {
                handleAlert('No se pudo eliminar los puntos de venta', true);
                setPoss(poss);
                setFilteredPoss(filteredPoss);
            }
        } finally {
            setModalDelete(false);
        }
    }


    return (
        <div className={styles['pos-wrapper']}>
            <PageHeaderDash 
                title={'Puntos de Venta'}
                description={'Maneja el acesso de tus productos físicos'}
                image={POSimg}
            />
            <div className={`${styles.filters}`}>
            <SearcherDashboard 
                setSearch={setSearch}
                filterList={filterPoss}
                visible={visible}
                setOrder={setOrder}
                order={order}
                setOrderType={setOrderType}
                orderType={orderType}
                sortedList={sordedPoss}
                setFilteredList={setFilteredPoss}
                setSelectAll={setSelectAll}
                options={[
                    { name: 'Nombre', type: 'name' },
                    // { name: 'No seleccionados', type: 'unselected' }
                ]}
                listName={'puntos de venta por nombre'}
            />
                <div className={styles.buttons}>
                    <Link to='/dashboard/pos/new'>
                        <button
                            className={styles["btn-new-add"]}
                        >
                            <i className="fa-solid fa-plus"></i>
                           <span className={styles.btnP}> Agregar Punto de Venta </span>
                        </button>
                    </Link>
                </div>
            </div>
            <TableDashboard
                columns={[
                    {prop: 'checkbox', width: '10%'},
                    {prop: 'Imagen', width: '10%'},
                    {prop: 'Nombre', width: '20%'},
                    {prop: 'Dirección', width: '20%'},
                    {prop: 'Teléfono', width: '15%'},
                    {prop: 'Email', width: '15%'},
                    {prop: 'actions', width: '10%'},
                ]}
                listLength={filteredPoss.length}
                filterList={filterPoss}
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

                ]}
                listName={'puntos de venta por nombre'}
                createNew={'/dashboard/pos/new'}
                setModalDelete={setModalDelete}
            >
                {filteredPoss.map((pos, index) => {
                    if(index < limit ){
                        pos.visible = true;
                        return (
                            <tr 
                                key={pos.id}
                                className={`${pos.selected ? styles.selectedRow : ''}`}
                            >
                                <td className={styles["cell-select"]}>
                                    <input 
                                        type="checkbox"
                                        checked={pos.selected || false}
                                        onChange={() => handleSelect(index)}
                                    />
                                </td>
                                <td className={styles["cell-image"]}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/pos/${pos.image}`} alt={`${pos.title} Point of Sale Image`} />
                                </td>
                                <td className={styles["cell-name"]}>{pos.name}</td>
                                <td className={styles["cell-address"]}>{pos.address}</td>
                                <td className={styles["cell-phone"]}>{pos.phone}</td>
                                <td className={styles["cell-email"]}>{pos.email}</td>
                                <td 
                                    className={styles["cell-actions"]}
                                >
                                    <Link to={`edit/${pos.id}`} className={styles.editar}>
                                        <i className="fa-solid fa-pen"></i>
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        )
                    } else {
                        pos.visible = false;
                        pos.selected = false;
                   } 
                })}
            </TableDashboard>
            {modalDelete && 
                <Modal 
                    modalActive={setModalDelete}
                    text='¿Estás seguro de eliminar los puntos de venta seleccionados?'
                    actionBtnText='Eliminar'
                    actionBtnLoadingText='Eliminando...'
                    actionModal={deleteSelected}
                />
            }
        </div>
    )
}

export default PointOfSale
