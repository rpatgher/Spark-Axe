import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Images ********************
import Adsimg from '../../assets/img/Illustrations/Anuncios.png';

// ********************* Styles ********************
import styles from './Advertisements.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ********************* Components ********************
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';
import Modal from '../../components/Modals/GeneralModal';
import TableDashboard from '../../components/TableDashboard/TableDashboard';
import SearcherDashboard from '../../components/SearcherDashboard/SearcherDashboard';


const Advertisements = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [advertisements, setAdvertisements] = useState([]);

    const [order, setOrder] = useState('asc');
    const [orderType, setOrderType] = useState('title');
    const [filteredAdvertisements, setFilteredAdvertisements] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [limit, setLimit] = useState(10);

    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        const count = filteredAdvertisements.filter(advertisement => advertisement.selected && advertisement.visible).length;
        const countVisible = filteredAdvertisements.filter(advertisement => advertisement.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredAdvertisements, limit]);

    useEffect(() => {
        const newData = [...filteredAdvertisements];
        newData.forEach(advertisement => advertisement.selected = false);
        setFilteredAdvertisements(newData);
    }, [advertisements]);

    const sordedAdvertisements = advertisements.sort((a, b) => {
        if(order === 'asc'){
            if(orderType === 'title'){
                return a.title.localeCompare(b.title);
            }
            if(orderType === 'section'){
                return a.section.name.localeCompare(b.section.name);
            }
        }
        if(order === 'desc'){
            if(orderType === 'title'){
                return b.title.localeCompare(a.title);
            }
            if(orderType === 'section'){
                return b.section.name.localeCompare(a.section.name);
            }
        }
    });

    useEffect(() => {
        const getAdvertisements = async () => {
            // Fetch advertisements from API
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/advertisements/all/${auth.websites[0].id}`, config);
                setAdvertisements(response.data);
                setFilteredAdvertisements(response.data);
            } catch (error) {
                console.log(error);
                handleAlert('Error al obtener los anuncios', true);
            }
        }
        return () => getAdvertisements();
    }, []);

    const filterAdvertisements = (search, visible) => {
        setSelectAll(false);
        setFilteredAdvertisements(filteredAdvertisements.map(advertisement => advertisement.selected = false));
        const visibleAdvertisements = advertisements.filter(advertisement => {
            if(visible === 'all'){
                return advertisement;
            }
            if(visible === 'published'){
                return advertisement.published;
            }
            if(visible === 'unpublished'){
                return !advertisement.published;
            }
        });
        if (search === '') {
            setFilteredAdvertisements(visibleAdvertisements);
            return;
        }
        const searchAdvertisements = visibleAdvertisements.filter(advertisement => advertisement.title.toLowerCase().includes(search.toLowerCase()));
        setFilteredAdvertisements(searchAdvertisements);
    }

    const handleSelectAll = () => {
        const newData = filteredAdvertisements.map(advertisement => (advertisement.visible ? {...advertisement, selected: !selectAll} : advertisement));
        setFilteredAdvertisements(newData);
        setSelectAll(!selectAll);
    };

    const handleSelect = (index) => {
        const newData = [...filteredAdvertisements];
        newData[index].selected = !newData[index].selected;
        setFilteredAdvertisements(newData);
    }

    const deleteSelected = async () => {
        const selected = filteredAdvertisements.filter(advertisement => advertisement.selected);
        const ids = selected.map(advertisement => advertisement.id);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            await clientAxios.post('/api/advertisements/delete', { ids }, config);
            setAdvertisements(advertisements.filter(advertisement => !ids.includes(advertisement.id)));
            setFilteredAdvertisements(filteredAdvertisements.filter(advertisement => !ids.includes(advertisement.id)));
            handleAlert('Anuncios eliminados correctamente', false);
        } catch (error) {
            console.log(error);
            if(error?.response?.data?.msg === 'Cannot delete some advertisements'){
                handleAlert('Error al eliminar algunos anuncion', true);
                setAdvertisements(advertisements.filter(advertisement => !error.response.data.advertisements.map(add => add.id).includes(advertisement.id)));
                setFilteredAdvertisements(filteredAdvertisements.filter(advertisement => !error.response.data.advertisements.map(add => add.id).includes(advertisement.id)));
            } else {
                handleAlert('Error al eliminar los anuncios', true);
                setAdvertisements(advertisements);
                setFilteredAdvertisements(filteredAdvertisements);
            }
        } finally {
            setSelectAll(false);
            setModalDelete(false);
        }
    }

    
    return (
        <div className={styles['adverts-wrapper']}>
            <PageHeaderDash 
                title={'Anuncios'}
                description={'Publica tus anuncios'}
                image={Adsimg}
            />
            <div className={`${styles.filters}`}>
                <SearcherDashboard
                    setSearch={setSearch}
                    filterList={filterAdvertisements}
                    visible={visible}
                    setOrder={setOrder}
                    order={order}
                    setOrderType={setOrderType}
                    orderType={orderType}
                    sortedList={sordedAdvertisements}
                    setFilteredList={setFilteredAdvertisements}
                    setSelectAll={setSelectAll}
                    options={[
                        { name: 'Título', type: 'title' },
                        { name: 'Sección', type: 'section' }
                    ]}
                    listName={'anuncios'}
                />
                <div className={styles.buttons}>
                    <Link to='/dashboard/advertisements/new'>
                        <button
                            className={styles["btn-new-add"]}
                        >
                            <i className="fa-solid fa-plus"></i>
                            Agregar Anuncio
                        </button>
                    </Link>
                </div>
            </div>
            <TableDashboard 
                columns={[
                    {prop: 'checkbox', width: '10%'},
                    {prop: 'Imagen', width: '10%'},
                    {prop: 'Título', width: '30%'},
                    {prop: 'Sección', width: '20%'},
                    {prop: 'Publicado', width: '20%'},
                    {prop: 'actions', width: '10%'},
                ]}
                listLength={filteredAdvertisements.length}
                filterList={filterAdvertisements}
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
                    { type: 'published', name: 'Publicados' },
                    { type: 'unpublished', name: 'Archivados' },
                ]}
                listName={'anuncios'}
                colspan={[3,2,2]}
                createNew={'/dashboard/advertisements/new'}
                setModalDelete={setModalDelete}
            >
                {filteredAdvertisements.map((advertisement, index) => {
                    if(index < limit){
                        advertisement.visible = true;
                        return (
                            <tr 
                                key={advertisement.id}
                                className={`${advertisement.selected ? styles.selectedRow : ''}`}
                            >
                                <td className={styles["cell-select"]}>
                                    <input 
                                        type="checkbox"
                                        checked={advertisement.selected || false}
                                        onChange={() => handleSelect(index)}
                                    />
                                </td>
                                <td className={styles["cell-image"]}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/advertisements/${advertisement.image}`} alt={`${advertisement.title} Advertisemente image`} />
                                </td>
                                <td className={styles["cell-title"]}>{advertisement.title}</td>
                                <td className={styles["cell-section"]}>{advertisement.section.name}</td>
                                <td className={styles["cell-published"]}><div className={`${advertisement.published ? styles.published : styles.unpublished}`}>{advertisement.published ? 'Publicado' : 'Archivado'}</div></td>
                                <td 
                                    className={styles["cell-actions"]}
                                >
                                    <Link to={`edit/${advertisement.id}`} className={styles.editar}>
                                        <i className="fa-solid fa-pen"></i>
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        )
                    } else {
                        advertisement.visible = false;
                        advertisement.selected = false;
                    }
                })}

            </TableDashboard>
            {modalDelete && 
                <Modal 
                    modalActive={setModalDelete}
                    text='¿Estás seguro de eliminar los anuncios seleccionados?'
                    actionBtnText='Eliminar'
                    actionBtnLoadingText='Eliminando...'
                    actionModal={deleteSelected}
                />
            }
        </div>
    )
}

export default Advertisements
