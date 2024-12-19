import { Fragment, useEffect, useState } from 'react';
import clientAxios from '../../config/clientAxios';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

import styles from './ModalEditStates.module.css';

import useApp from '../../hooks/useApp';
import useAuth from '../../hooks/useAuth';

import SortableItem from './SortableItem';

const ModalEditStates = ({ closeModal, states, setStates }) => {
    const { handleAlert } = useApp();
    const { auth } = useAuth();

    const [show, setShow] = useState(false);

    const [cities, setCities] = useState(null);
    const [currentState, setCurrentState] = useState(null);

    const [editState, setEditState] = useState(false);
    const [editingState, setEditingState] = useState(null);
    const [editingCity, setEditingCity] = useState(null);

    const [loading, setLoading] = useState(false);

    const [newState, setNewState] = useState(null);
    const [newStateActive, setNewStateActive] = useState(false);

    const [newCity, setNewCity] = useState(null);
    const [newCityActive, setNewCityActive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Load states from the server
    const loadStates = async () => {
        setLoading(true);
        document.body.style.cursor = "wait";
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await clientAxios.get('/api/deliveries/states', config);
            if (response.status === 200) {
                setStates(response.data);
            } else {
                setStates([]);
                handleAlert('No se pudieron cargar los estados', true);
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al cargar los estados', true);
            setStates([]);
        } finally {
            setLoading(false);
            document.body.style.cursor = "default";
        }
    };

    // When modal is shown, load states
    useEffect(() => {
        if (show) {
            loadStates();
        }
    }, [show]);

    const loadCitiesForState = async (st) => {
        setLoading(true);
        document.body.style.cursor = "wait";
        
        // Always set currentState immediately, even before the request succeeds
        setCurrentState(st);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await clientAxios.get(`/api/deliveries/cities/${st.id}`, config);

            if (response.status === 200) {
                setCities(response.data); // Set cities if found
                // Update the corresponding state to include cities
                setStates(states.map(s => s.id === st.id ? { ...s, cities: response.data } : s));
            } else {
                // Handle cases where no cities are returned
                setCities([]);
            }
        } catch (error) {
            console.error(error);
            handleAlert('No se pudieron cargar las ciudades del estado', true);
            setCities([]);
        } finally {
            setLoading(false);
            document.body.style.cursor = "default";
        }
    };

    const selectState = (state) => {
        if (state) {
            loadCitiesForState(state);
        }
    };

    const unshowModal = () => {
        setShow(false);
        setTimeout(() => {
            closeModal();
        }, 300);
    };

    const handleEditCityInput = (e) => {
        const { value } = e.target;
        setEditingCity((prev) => ({ ...prev, name: value }));
    };

    const editCityFunc = async (e) => {
        e.preventDefault();
        if (!editingCity) return;
        if (!currentState) {
            handleAlert('Seleccione un estado antes de editar una ciudad', true);
            return;
        }

        setLoading(true);
        document.body.style.cursor = "wait";
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const data = {
                state: currentState.state,
                city: editingCity.name,
                cost: editingCity.cost
            };
            const response = await clientAxios.put(`/api/deliveries/${editingCity.id}`, data, config);
            if (response.status === 200) {
                handleAlert('Ciudad editada correctamente', false);
                setCities(cities.map(ct => ct.id === editingCity.id ? { ...ct, city: editingCity.name, cost: editingCity.cost } : ct));
                setStates(states.map(st => {
                    if (st.id === currentState.id) {
                        return {
                            ...st,
                            cities: st.cities.map(ct => ct.id === editingCity.id ? { ...ct, city: editingCity.name, cost: editingCity.cost } : ct)
                        };
                    }
                    return st;
                }));
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al editar la ciudad', true);
        } finally {
            setLoading(false);
            setEditingCity(null);
            document.body.style.cursor = "default";
        }
    };

    const deleteCity = async (id) => {
        if (!currentState) {
            handleAlert('Seleccione un estado antes de eliminar una ciudad', true);
            return;
        }
        setLoading(true);
        document.body.style.cursor = "wait";
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await clientAxios.delete(`/api/deliveries/${id}`, config);
            if (response.status === 200) {
                handleAlert('Ciudad eliminada correctamente', false);
                setCities(cities.filter(ct => ct.id !== id));
                setStates(states.map(st => {
                    if (st.id === currentState.id) {
                        return {
                            ...st,
                            cities: st.cities.filter(ct => ct.id !== id)
                        };
                    }
                    return st;
                }));
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al eliminar la ciudad', true);
        } finally {
            setLoading(false);
            setEditingCity(null);
            document.body.style.cursor = "default";
        }
    };

    const editStateFunc = async (e) => {
        e.preventDefault();
        if (!editingState) return;
        setLoading(true);
        document.body.style.cursor = "wait";
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const data = {
                state: editingState.name,
                city: null,
                cost: editingState.cost
            };
            const response = await clientAxios.put(`/api/deliveries/${editingState.id}`, data, config);
            if (response.status === 200) {
                handleAlert('Estado editado correctamente', false);
                setStates(states.map(st => st.id === editingState.id ? { ...st, state: editingState.name, cost: editingState.cost } : st));
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al editar el estado', true);
        } finally {
            setLoading(false);
            setEditingState(null);
            document.body.style.cursor = "default";
        }
    };

    const deleteStateFunc = async (id) => {
        setLoading(true);
        document.body.style.cursor = "wait";
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await clientAxios.delete(`/api/deliveries/${id}`, config);
            if (response.status === 200) {
                handleAlert('Estado eliminado correctamente', false);
                setStates(states.filter(st => st.id !== id));
                if (currentState && currentState.id === id) {
                    setCurrentState(null);
                    setCities(null);
                }
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al eliminar el estado', true);
        } finally {
            setLoading(false);
            setEditingState(null);
            setEditState(false);
            document.body.style.cursor = "default";
        }
    };

    const newStateFunc = async (e) => {
        e.preventDefault();
        if (!newState?.name || newState.cost === undefined) {
            handleAlert('Nombre del estado y costo son requeridos', true);
            return;
        }
        setLoading(true);
        document.body.style.cursor = "wait";
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const data = {
                state: newState.name,
                cost: newState.cost
            };
            const response = await clientAxios.post('/api/deliveries/state', data, config);
            if (response.status === 201) {
                handleAlert('Estado creado correctamente', false);
                setStates([...states, { ...response.data, cities: [] }]);
            }
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al crear el estado', true);
        } finally {
            setLoading(false);
            setNewState(null);
            setNewStateActive(false);
            document.body.style.cursor = "default";
        }
    };

    const newCityFunc = async (e) => {
        e.preventDefault();

        if (!currentState) {
            handleAlert('Seleccione un estado antes de crear una ciudad', true);
            return;
        }
        if (!newCity?.name || newCity.cost === undefined) {
            handleAlert('Nombre de la ciudad y costo son requeridos', true);
            return;
        }

        setLoading(true);
        document.body.style.cursor = "wait";

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const data = {
                state: currentState.state,
                city: newCity.name,
                cost: newCity.cost
            };
            const response = await clientAxios.post('/api/deliveries/city', data, config);

            if (response.status === 201) {
                handleAlert('Ciudad creada correctamente', false);
                const createdCity = response.data;

                setCities([...cities, createdCity]);

                setStates(states.map(st => {
                    if (st.id === currentState.id) {
                        return {
                            ...st,
                            cities: [...(st.cities || []), createdCity]
                        };
                    }
                    return st;
                }));
            }
        } catch (error) {
            console.error(error);
            handleAlert('Hubo un error al crear la ciudad', true);
        } finally {
            setLoading(false);
            setNewCity(null);
            setNewCityActive(false);
            document.body.style.cursor = "default";
        }
    };

    const handleDragEndCities = ({ active, over }) => {
        if (!cities || !currentState) return;
        if (active?.id !== over?.id) {
            const activeIndex = cities.findIndex(ct => ct.id === active.id);
            const overIndex = cities.findIndex(ct => ct.id === over.id);

            const newCities = [...cities];
            const [movedCity] = newCities.splice(activeIndex, 1);
            newCities.splice(overIndex, 0, movedCity);

            newCities.forEach((city, index) => {
                city.index = index + 1;
            });

            setCities(newCities);
            setStates(states.map(st => st.id === currentState.id ? { ...st, cities: newCities } : st));
        }
    };

    const handleDragEndStates = ({ active, over }) => {
        if (active?.id !== over?.id) {
            const activeIndex = states.findIndex(st => st.id === active.id);
            const overIndex = states.findIndex(st => st.id === over.id);

            const newStates = [...states];
            const [movedState] = newStates.splice(activeIndex, 1);
            newStates.splice(overIndex, 0, movedState);

            newStates.forEach((st, index) => {
                st.index = index + 1;
            });

            setStates(newStates);
        }
    };

    return (
        <div className={styles["modal-wrapper"]}>
            <div className={`${styles["modal"]} ${show ? styles.show : ''}`}>
                <button
                    className={styles["close-modal"]}
                    onClick={unshowModal}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
                {cities !== null ? (
                    <Fragment>
                        <div className={styles.header}>
                            <h2>
                                <span
                                    className={styles.backhead}
                                    onClick={() => {
                                        setCities(null);
                                        setCurrentState(null);
                                        setEditingCity(null);
                                        setEditState(false);
                                    }}
                                >
                                    Estados
                                </span> / {currentState?.state}
                            </h2>
                            {!newCityActive && (
                                <button
                                    className={styles.create}
                                    style={{
                                        opacity: loading ? 0.5 : 1,
                                        cursor: loading ? "wait" : "pointer"
                                    }}
                                    disabled={loading}
                                    onClick={() => {
                                        if (!currentState) {
                                            handleAlert('Seleccione un estado primero', true);
                                            return;
                                        }
                                        setNewCityActive(true);
                                    }}
                                >
                                    <i className="fa-solid fa-plus"></i> Crear Ciudad
                                </button>
                            )}
                        </div>
                        <hr className={styles.divider}></hr>
                        <div className={styles.subcategories}>
                            {(!cities || cities.length === 0) && !newCityActive ? (
                                <p className={styles.nocategories}>No hay ciudades</p>
                            ) : (
                                <DndContext
                                    onDragEnd={handleDragEndCities}
                                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToFirstScrollableAncestor]}
                                >
                                    <SortableContext items={cities || []}>
                                        {cities && cities.map(city => (
                                            <SortableItem
                                                key={city.id}
                                                id={city.id}
                                                handleActive={true}
                                            >
                                                <div className={styles.subcategory}>
                                                    {editingCity?.id === city.id ? (
                                                        <div className={styles.inputs}>
                                                            <p>Nombre de la Ciudad</p>
                                                            <input
                                                                type="text"
                                                                value={editingCity.name}
                                                                onChange={handleEditCityInput}
                                                            />
                                                            <p>Costo de Envío</p>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={editingCity.cost || ''}
                                                                onChange={(e) => {
                                                                    setEditingCity({
                                                                        ...editingCity,
                                                                        cost: e.target.value
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className={styles.content}>
                                                            <h3>{city.city}: {city.cost || 0}$</h3>
                                                        </div>
                                                    )}
                                                    <div className={styles.buttons}>
                                                        {editingCity?.id === city.id ? (
                                                            <>
                                                                <button
                                                                    onClick={editCityFunc}
                                                                    style={{
                                                                        opacity: loading ? 0.5 : 1,
                                                                        cursor: loading ? "wait" : "pointer"
                                                                    }}
                                                                    disabled={loading}
                                                                    className={styles.save}
                                                                >
                                                                    <i className="fa-solid fa-floppy-disk"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCity(null);
                                                                    }}
                                                                    style={{
                                                                        opacity: loading ? 0.5 : 1,
                                                                        cursor: loading ? "wait" : "pointer"
                                                                    }}
                                                                    disabled={loading}
                                                                    className={styles.cancel}
                                                                >
                                                                    <i className="fa-solid fa-times"></i>
                                                                </button>
                                                                <button
                                                                    style={{
                                                                        opacity: loading ? 0.5 : 1,
                                                                        cursor: loading ? "wait" : "pointer"
                                                                    }}
                                                                    disabled={loading}
                                                                    onClick={() => {
                                                                        deleteCity(city.id);
                                                                    }}
                                                                    className={styles.deleteCat}
                                                                >
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                            </>
                                                        ) : editingCity === null && !newCityActive && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCity({ ...city, name: city.city, cost: city.cost });
                                                                }}
                                                                style={{
                                                                    opacity: loading ? 0.5 : 1,
                                                                    cursor: loading ? "wait" : "pointer"
                                                                }}
                                                                disabled={loading}
                                                                className={styles.editBtn}
                                                            >
                                                                <i className="fa-solid fa-pencil"></i> Editar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </SortableItem>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                            {newCityActive &&
                                <div className={styles.newSubcat}>
                                    <form onSubmit={newCityFunc}>
                                        <p>Nombre de la Ciudad</p>
                                        <input
                                            type="text"
                                            value={newCity?.name || ''}
                                            onChange={(e) => {
                                                setNewCity({
                                                    ...newCity,
                                                    name: e.target.value
                                                });
                                            }}
                                            name='name'
                                            autoFocus={true}
                                        />
                                        <p>Costo de Envío</p>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newCity?.cost || ''}
                                            onChange={(e) => {
                                                setNewCity({
                                                    ...newCity,
                                                    cost: e.target.value
                                                });
                                            }}
                                            name='cost'
                                        />
                                        <div className={styles.buttonsNewSubcat}>
                                            <button
                                                style={{
                                                    opacity: loading ? 0.5 : 1,
                                                    cursor: loading ? "wait" : "pointer"
                                                }}
                                                disabled={loading}
                                                className={styles.save}
                                                type='submit'
                                            >
                                                <i className="fa-solid fa-floppy-disk"></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setNewCity(null);
                                                    setNewCityActive(false);
                                                }}
                                                style={{
                                                    opacity: loading ? 0.5 : 1,
                                                    cursor: loading ? "wait" : "pointer"
                                                }}
                                                disabled={loading}
                                                className={styles.cancel}
                                            >
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <div className={styles.header}>
                            <h2>Estados</h2>
                            {!newStateActive && (
                                <div className={styles.buttonsCat}>
                                    {!editState && (
                                        <button
                                            className={styles.create}
                                            onClick={() => {
                                                setNewStateActive(true);
                                            }}
                                        >
                                            <i className="fa-solid fa-plus"></i> Crear Estado
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditState(!editState);
                                            setEditingState(null);
                                        }}
                                        style={{
                                            opacity: loading ? 0.5 : 1,
                                            cursor: loading ? "wait" : "pointer"
                                        }}
                                        disabled={loading}
                                        className={`${editState ? styles.cancel : styles.edit}`}
                                    >
                                        {editState ? (
                                            <>
                                                <i className="fa-solid fa-times"></i> Cancelar
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-pencil"></i> Editar
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        <hr className={styles.divider}></hr>
                        <div className={styles.categories}>
                            {states.length === 0 && !newStateActive ? (
                                <p className={styles.nocategories}>No hay estados</p>
                            ) : (
                                <DndContext
                                    onDragEnd={handleDragEndStates}
                                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToFirstScrollableAncestor]}
                                >
                                    <SortableContext items={states}>
                                        {states.map(st => (
                                            <SortableItem
                                                key={st.id}
                                                id={st.id}
                                                handleActive={editState}
                                            >
                                                <div
                                                    key={st.id}
                                                    className={`${styles.category} ${!editState ? styles["category-hover"] : ''} ${editingState !== null ? styles['editing-category'] : ''}`}
                                                    onClick={() => {
                                                        if (!editState && !newStateActive) {
                                                            loadCitiesForState(st);
                                                        }
                                                    }}
                                                >
                                                    {editingState?.id === st.id ? (
                                                        <div className={styles.inputs}>
                                                            <p>Nombre del Estado</p>
                                                            <input
                                                                type="text"
                                                                name='name'
                                                                value={editingState.name}
                                                                onChange={(e) => {
                                                                    setEditingState({
                                                                        ...editingState,
                                                                        name: e.target.value
                                                                    });
                                                                }}
                                                            />
                                                            <p>Costo de Envío</p>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={editingState.cost || ''}
                                                                onChange={(e) => {
                                                                    setEditingState({
                                                                        ...editingState,
                                                                        cost: e.target.value
                                                                    });
                                                                }}
                                                                name='cost'
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className={styles.content}>
                                                            <h3>{st.state}: {st.cost || 0}$</h3>
                                                        </div>
                                                    )}
                                                    {editState && editingState === null ? (
                                                        <button
                                                            className={styles.rename}
                                                            onClick={() => {
                                                                setEditingState({ ...st, name: st.state });
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </button>
                                                    ) : null}
                                                    {editingState?.id === st.id ? (
                                                        <div className={styles.actions}>
                                                            <button
                                                                style={{
                                                                    opacity: loading ? 0.5 : 1,
                                                                    cursor: loading ? "wait" : "pointer"
                                                                }}
                                                                disabled={loading}
                                                                onClick={editStateFunc}
                                                                className={styles.save}
                                                            >
                                                                <i className="fa-solid fa-floppy-disk"></i>
                                                            </button>
                                                            <button
                                                                style={{
                                                                    opacity: loading ? 0.5 : 1,
                                                                    cursor: loading ? "wait" : "pointer"
                                                                }}
                                                                disabled={loading}
                                                                onClick={() => {
                                                                    setEditingState(null);
                                                                }}
                                                                className={styles.cancel}
                                                            >
                                                                <i className="fa-solid fa-times"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {editState ? (
                                                        <button
                                                            style={{
                                                                opacity: loading ? 0.5 : 1,
                                                                cursor: loading ? "wait" : "pointer"
                                                            }}
                                                            disabled={loading}
                                                            onClick={() => {
                                                                deleteStateFunc(st.id);
                                                            }}
                                                            className={styles.deleteCat}
                                                        >
                                                            <i className="fa-solid fa-trash"></i> {editingState === null ? (loading ? 'Eliminando...' : 'Eliminar') : ''}
                                                        </button>
                                                    ) : !newStateActive && (
                                                        <i className="fa-solid fa-chevron-right"></i>
                                                    )}
                                                </div>
                                            </SortableItem>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                            {newStateActive &&
                                <div className={styles.newCat}>
                                    <form onSubmit={newStateFunc}>
                                        <p>Nombre del Estado</p>
                                        <input
                                            type="text"
                                            value={newState?.name || ''}
                                            onChange={(e) => {
                                                setNewState({
                                                    ...newState,
                                                    name: e.target.value
                                                });
                                            }}
                                            id='newCategoryInput'
                                            autoFocus={true}
                                            name='name'
                                        />
                                        <p>Costo de Envío</p>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newState?.cost || ''}
                                            onChange={(e) => {
                                                setNewState({
                                                    ...newState,
                                                    cost: e.target.value
                                                });
                                            }}
                                            name='cost'
                                        />
                                        <div className={styles.buttonsNewCat}>
                                            <button
                                                style={{
                                                    opacity: loading ? 0.5 : 1,
                                                    cursor: loading ? "wait" : "pointer"
                                                }}
                                                disabled={loading}
                                                className={styles.save}
                                                type='submit'
                                            >
                                                <i className="fa-solid fa-floppy-disk"></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setNewState(null);
                                                    setNewStateActive(false);
                                                }}
                                                style={{
                                                    opacity: loading ? 0.5 : 1,
                                                    cursor: loading ? "wait" : "pointer"
                                                }}
                                                disabled={loading}
                                                className={styles.cancel}
                                            >
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default ModalEditStates;