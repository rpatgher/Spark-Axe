import React, { useState, useEffect, Fragment } from 'react';
import clientAxios from '../../config/clientAxios';

// ******************** Styles ********************
import styles from './Delivery.module.css';

// ******************** Components ********************
import FloatAlert from '../../components/Alert/FloatAlert';
import ModalStates from '../../components/Modals/ModalState';
import ModalCities from '../../components/Modals/ModalCity';
import ModalEditStates from '../../components/Modals/ModalEditStates'; // Modal for creating/editing states and cities
import GoTopBtn from '../../components/Btns/GoTopBtn';
import TableDashboard from '../../components/TableDashboard/TableDashboard';
import PageHeaderDash from '../../components/PageHeaderDash/PageHeaderDash';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

import img from '../../assets/img/Illustrations/Productos.png';




const Delivery = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();

    const [deliveries, setDeliveries] = useState([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([]);
    const [states, setStates] = useState([]);

    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');

    const [modalStates, setModalStates] = useState([]);
    const [modalCities, setModalCities] = useState(false);
    const [modalEditStates, setModalEditStates] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const configHeaders = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            try {
                // Fetch all states
                const statesResponse = await clientAxios.get(`/api/deliveries/states`, configHeaders);
                const fetchedStates = statesResponse.data || [];

                // Fetch cities for each state
                const citiesPromises = fetchedStates.map(state =>
                    clientAxios.get(`/api/deliveries/cities/${state.id}`, configHeaders)
                        .then(response => response.data || [])
                        .catch(() => [])
                );

                const citiesResults = await Promise.all(citiesPromises);

                // Combine states and cities
                let combinedDeliveries = [];
                fetchedStates.forEach((state, index) => {
                    combinedDeliveries.push({
                        id: state.id,
                        state: state.state,
                        city: null,
                        cost: state.cost,
                    });
                    const cities = citiesResults[index];
                    cities.forEach(city => {
                        combinedDeliveries.push({
                            id: city.id,
                            state: state.state,
                            city: city.city,
                            cost: city.cost,
                        });
                    });
                });

                setStates(fetchedStates);
                setDeliveries(combinedDeliveries);
                setFilteredDeliveries(combinedDeliveries);
            } catch (error) {
                console.error('Error fetching data:', error);
                handleAlert("Error al obtener los estados y ciudades", true);
            }
        };
        fetchData();
    }, [auth.websites, handleAlert]);

    // Filter deliveries based on search
    const filterDeliveries = (searchTerm) => {
        if (!searchTerm) {
            setFilteredDeliveries(deliveries);
            return;
        }
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = deliveries.filter(del =>
            (del.state && del.state.toLowerCase().includes(lowerSearch)) ||
            (del.city && del.city.toLowerCase().includes(lowerSearch))
        );
        setFilteredDeliveries(filtered);
    };

    return (
        <div className={styles["products-wrapper"]}>
            {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
            <PageHeaderDash 
                title={'Envíos'}
                description={'Crea y edita nuevos destinos de envíos'}
                image={img}
            />
            <div className={styles.filters}>
                <div className={styles.buttons}>
                    {/* Button to open ModalEditStates */}
                    <button
                        className={styles["btn-edit-categories"]}
                        onClick={() => setModalEditStates(true)}
                    >
                        <i className="fa-solid fa-layer-group"></i>
                        <p>Agregar Estado o Ciudad</p>
                    </button>
                </div>
            </div>
            <TableDashboard
                columns={[
                    { prop: 'Estado', width: '15%' },
                    { prop: 'Ciudad', width: '15%' },
                    { prop: 'Costo', width: '10%' },
                ]}
                listLength={filteredDeliveries.length}
                filterList={(search) => filterDeliveries(search)}
                search={search}
                limit={limit}
                setLimit={setLimit}
                visibleOptions={[]}
                listName='destinos'
                createNew={null}
            >
                {filteredDeliveries.slice(0, limit).map((delivery, index) => (
                    <tr key={index}>
                        <td>{delivery.state}</td>
                        <td>{delivery.city || '—'}</td>
                        <td>{delivery.cost ? `${delivery.cost}$` : '—'}</td>
                    </tr>
                ))}
            </TableDashboard>

            <GoTopBtn />
            {modalStates.length > 0 &&
                <ModalStates 
                    categories={modalStates}
                    closeModal={() => setModalStates([])}
                />
            }
            {modalCities && 
                <ModalCities 
                    closeModal={() => setModalCities(false)}
                />
            }
            {modalEditStates && 
                <ModalEditStates
                    closeModal={() => setModalEditStates(false)}
                    states={states}
                    setStates={setStates}
                />
            }
        </div>
    );
};

export default Delivery;
