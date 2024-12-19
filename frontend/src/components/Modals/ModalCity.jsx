import { useState, useEffect } from 'react';
import clientAxios from '../../config/clientAxios';
import styles from './ModalCity.module.css';

const ModalCity = ({ cities, stateName, websiteId, closeModal, setCities }) => {
    const [currentCity, setCurrentCity] = useState(null); // city being edited
    const [newCity, setNewCity] = useState(null);         // data for creating a new city
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => setShow(true), 300);
    }, []);

    const unshowModal = () => {
        setShow(false);
        setTimeout(() => closeModal(), 300);
    };

    const handleEditCity = async () => {
        if (!currentCity?.city || currentCity.cost === undefined) return;
        setLoading(true);
        try {
            const { data } = await clientAxios.put(`/api/deliveries/${currentCity.id}`, {
                state: stateName,
                city: currentCity.city,
                cost: currentCity.cost
            });

            setCities(prev =>
                prev.map(ct => (ct.id === currentCity.id ? { ...ct, ...data.delivery } : ct))
            );
            setCurrentCity(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCity = async (id) => {
        setLoading(true);
        try {
            await clientAxios.delete(`/api/deliveries/${id}`);
            setCities(prev => prev.filter(city => city.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCity = async () => {
        if (!newCity?.city || newCity.cost === undefined) return;
        setLoading(true);
        try {
            const { data: createdCity } = await clientAxios.post(`/api/deliveries/city`, {
                websiteId: websiteId,
                state: stateName,
                city: newCity.city,
                cost: newCity.cost
            });
            setCities(prev => [...prev, createdCity]);
            setNewCity(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['modal-wrapper']}>
            <div className={`${styles['modal']} ${show ? styles.show : ''}`}>
                <button className={styles['close-modal']} onClick={unshowModal}>
                    <i className="fa-solid fa-times"></i>
                </button>
                <h2>Gestión de Ciudades para {stateName}</h2>
                <hr />
                <div className={styles.cities}>
                    {cities.map(city => (
                        <div key={city.id} className={styles.city}>
                            {currentCity?.id === city.id ? (
                                <div className={styles.inputs}>
                                    <p>Nombre de la Ciudad</p>
                                    <input
                                        type="text"
                                        value={currentCity.city}
                                        onChange={(e) => setCurrentCity({ ...currentCity, city: e.target.value })}
                                    />
                                    <p>Costo de Envío</p>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={currentCity.cost || ''}
                                        onChange={(e) => setCurrentCity({ ...currentCity, cost: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <h3>{city.city}: {city.cost || 0}$</h3>
                            )}
                            <div className={styles.actions}>
                                {currentCity?.id === city.id ? (
                                    <>
                                        <button
                                            onClick={handleEditCity}
                                            disabled={loading}
                                            className={styles.save}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={() => setCurrentCity(null)}
                                            className={styles.cancel}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setCurrentCity(city)}
                                            className={styles.edit}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCity(city.id)}
                                            disabled={loading}
                                            className={styles.delete}
                                        >
                                            Borrar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className={styles.addNew}>
                        <p>Nombre de la Ciudad</p>
                        <input
                            type="text"
                            placeholder="Nuevo nombre de ciudad"
                            value={newCity?.city || ''}
                            onChange={(e) =>
                                setNewCity({ ...newCity, city: e.target.value })
                            }
                        />
                        <p>Costo de Envío</p>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Costo"
                            value={newCity?.cost || ''}
                            onChange={(e) =>
                                setNewCity({ ...newCity, cost: e.target.value })
                            }
                        />
                        <button onClick={handleCreateCity} disabled={loading}>
                            Agregar Ciudad
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCity;
