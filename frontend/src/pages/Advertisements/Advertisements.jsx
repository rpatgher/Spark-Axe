import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ******************** Images ********************
import clients from '../../assets/img/clients.png';

// ********************* Styles ********************
import styles from './Advertisements.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ********************* Components ********************
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';
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

    useEffect(() => {
        const count = filteredAdvertisements.filter(advertisement => advertisement.selected).length;
        const countVisible = filteredAdvertisements.filter(advertisement => advertisement.visible).length;
        setSelectedCount(count);
        setVisibleCount(countVisible);
    }, [filteredAdvertisements, limit]);

    const sordedAdvertisements = filteredAdvertisements.sort((a, b) => {
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
            return setFilteredAdvertisements(visibleAdvertisements);
        }
        const searchAdvertisements = visibleAdvertisements.filter(advertisement => {
            return advertisement.title.toLowerCase().includes(search.toLowerCase());
        });
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

    
    return (
        <div className={styles['adverts-wrapper']}>
            <PageHeaderDash 
                title={'Anuncios'}
                description={'Publica tus anuncios'}
                image={clients}
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
                setModalDelete={setModalDelete}
                listName={'anuncios'}
                createNew={'/dashboard/advertisements/new'}
                colspan={[3,2,2]}

            >
                {filteredAdvertisements.map((advertisement, index) => {
                    if(index < limit){
                        return (
                            <tr key={advertisement.id}>
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
        </div>
        
    )
}

export default Advertisements
