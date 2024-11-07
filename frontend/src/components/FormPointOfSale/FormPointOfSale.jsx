import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { OpenStreetMapProvider } from 'leaflet-geosearch';

import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import * as esriGeo from 'esri-leaflet-geocoder';

import clientAxios from '../../config/clientAxios';

// ********************* Styles ********************
import styles from './FormPointOfSale.module.css';

// ************** hooks *************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ************** components *************

const FormPointOfSale = ({ initialPoS, setModalDelete }) => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const navigate = useNavigate();
    const mapRef = useRef();
    const markerRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [initialCenter, setInitialCenter] = useState([19.4269841, -99.1692928]);

    const [markerPosition, setMarkerPosition] = useState({
        lat: 19.4269841,
        lng: -99.1692928
    });
    const [pos, setPoS] = useState({
        name: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        countryCode: '',
        latitude: '',
        longitude: '',
        image: '',
        email: '',
        phone: '',
        category_id: ''
    });
    const [configPoS, setConfigPoS] = useState({});

    const [savingPoS, setSavingPoS] = useState(false);

    useEffect(() => {
        const getPoSConfig = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clientAxios(`/api/config/pos/${auth.websites[0].id}`, config);
                setConfigPoS(data.config);
            } catch (error) {
                console.log(error);
            }
        }
        return () => getPoSConfig();
    }, []);

    useEffect(() => {
        const getCategories = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/pos-categories/${auth.websites[0].id}`, config);
                setCategories(response.data);
            } catch (error) {
                console.log(error);
                handleAlert('Error al obtener las categorias', true);
            }
        }
        return () => getCategories();
    }, []);

    useEffect(() => {
        setPoS({
            name: initialPoS?.name || '',
            address: initialPoS?.address || '',
            city: initialPoS?.city || '',
            country: initialPoS?.country || '',
            postalCode: initialPoS?.postalCode || '',
            countryCode: initialPoS?.countryCode || '',
            latitude: initialPoS?.latitude || '',
            longitude: initialPoS?.longitude || '',
            image: '',
            email: initialPoS?.email || '',
            phone: initialPoS?.phone || '',
            category_id: initialPoS?.pos_category_id || ''
        });
        if (initialPoS?.latitude && initialPoS?.longitude) {
            setMarkerPosition({
                lat: initialPoS.latitude,
                lng: initialPoS.longitude
            });
            setInitialCenter([initialPoS.latitude, initialPoS.longitude]);
            mapRef.current.setView([initialPoS.latitude, initialPoS.longitude], 16);
        }
    }, [initialPoS]);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [markerPosition]);

    const handleChange = (e) => {
        if(Array.from(e.target.classList).includes(styles["empty-field"])){
            e.target.classList.remove(styles["empty-field"]);
        }
        setPoS({
            ...pos,
            [e.target.name]: e.target.value
        });
    }

    const handleChangeFile = (e) => {
        setPoS({
            ...pos,
            [e.target.name]: e.target.files[0]
        });
    }

    const handleSearchAddress = async (e) => {
        e.preventDefault();
        if(Array.from(e.target.classList).includes(styles["empty-field"])){
            e.target.classList.remove(styles["empty-field"]);
        }
        const accessToken = import.meta.env.VITE_GEOCODING_API_KEY;
        const geocodeService = esriGeo.geocodeService({
            token: accessToken
        });
        geocodeService.geocode().text(e.target.value).run((err, results) => {
            if (err) {
                console.log(err);
            } else {
                if(results.results.length > 0){
                    const { latlng } = results.results[0];
                    mapRef.current.setView(latlng, 16);
                    setMarkerPosition(latlng);
                    esriGeo.reverseGeocode({
                        token: accessToken
                    }).latlng(latlng).run((err, result) => {
                        if(err){
                            console.log(err);
                        } else {
                            setPoS({
                                ...pos,
                                address: result.address.Match_addr,
                                city: result.address.Region,
                                country: result.address.CntryName,
                                postalCode: result.address.Postal,
                                countryCode: result.address.CountryCode,
                                latitude: latlng.lat,
                                longitude: latlng.lng
                            });
                        }
                    });
                }
            }
        });
    }

    const markerEventHandlers = useMemo(() => ({
        dragend(e) {
            const accessToken = import.meta.env.VITE_GEOCODING_API_KEY;
            const marker = markerRef.current;
            if (marker != null) {
                const { lat, lng } = e.target.getLatLng();
                const latlng = [lat, lng];
                mapRef.current.setView(latlng, 16);
                setMarkerPosition(latlng);
                esriGeo.reverseGeocode({
                    token: accessToken
                }).latlng(latlng).run((err, result) => {
                    if(err){
                        console.log(err);
                    } else {
                        setPoS({
                            name: document.getElementById('name').value,
                            email: document.getElementById('email').value,
                            phone: document.getElementById('phone').value,
                            category_id: document.getElementById('category_id').value,
                            image: document.getElementById('image').files[0],
                            address: result.address.Match_addr,
                            city: result.address.Region,
                            country: result.address.CntryName,
                            postalCode: result.address.Postal,
                            countryCode: result.address.CountryCode,
                            latitude: result.latlng.lat,
                            longitude: result.latlng.lng
                        });
                    }
                });
            }
        }
    }), []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if([pos.name, pos.email, pos.phone, pos.address, pos.city, pos.country, pos.countryCode, pos.latitude, pos.longitude, pos.postalCode].includes('')){
            handleAlert('Todos los campos son requeridos', true);
            const objKeys = Object.keys(pos).filter(key => key !== 'city' && key !== 'country' && key !== 'countryCode' && key !== 'latitude' && key !== 'longitude' && key !== 'postalCode');
            objKeys.forEach(key => {
                if(pos[key] === ''){
                    if(key === 'image'){
                        document.getElementById('image-field').classList.add(styles["empty-field-image"]);
                    }else if(key === 'address'){
                        document.getElementById('searcher').classList.add(styles["empty-field"]);
                    } else {
                        document.getElementById(key).classList.add(styles["empty-field"]);
                    }
                }
            });
            return;
        }
        if (pos.image === '' && !initialPoS?.id) {
            handleAlert("La imagen es obligatoria", true);
            document.getElementById('image-field').classList.add(styles["empty-field-image"]);
            return;
        }
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        const formData = new FormData();
        formData.append('name', pos.name);
        formData.append('email', pos.email);
        formData.append('phone', pos.phone);
        formData.append('category_id', pos.category_id);
        formData.append('address', pos.address);
        formData.append('city', pos.city);
        formData.append('country', pos.country);
        formData.append('countryCode', pos.countryCode);
        formData.append('latitude', pos.latitude);
        formData.append('longitude', pos.longitude);
        formData.append('postalCode', pos.postalCode);
        formData.append('image', pos.image);
        formData.append('website_id', auth.websites[0].id);
        setSavingPoS(true);
        try {
            if (initialPoS) {
                const response = await clientAxios.put(`/api/pos/${initialPoS.id}`, formData, config);
                if (response.status === 200) {
                    handleAlert('Punto de Venta actualizado correctamente', false);
                }
            } else {
                const response = await clientAxios.post('/api/pos', formData, config);
                if (response.status === 200) {
                    handleAlert('Punto de Venta creado correctamente', false);
                }
            }
            navigate('/dashboard/pos');
        } catch (error) {
            console.log(error);
            handleAlert('Hubo un error al guardar el Punto de Venta', true);
        } finally {
            setSavingPoS(false);
        }
    }


    return (
        <form
            className={styles.body}
            onSubmit={handleSubmit}
        >
            <div className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="name" className={styles.required}>Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder={`Nombre del Punto de Venta`}
                        value={pos.name}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="email" className={styles.required}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder={`Email del Punto de Venta`}
                        value={pos.email}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="phone" className={styles.required}>Teléfono</label>
                    <input
                        type="number"
                        id="phone"
                        name="phone"
                        placeholder={`Teléfono del Punto de Venta`}
                        value={pos.phone}
                        onChange={handleChange}
                    />
                </div>
                {configPoS.category && (
                    <div className={styles.field}>
                        <label htmlFor="category_id" className={styles.required}>Categoría</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={pos.category_id}
                            onChange={handleChange}
                        >
                            <option value="" disabled> ---Selecciona una categoría--- </option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className={`${styles.field}`}>
                    <label htmlFor="searcher" className={styles.required}>Dirección</label>
                    <input
                        type="text"
                        id="searcher"
                        name="searcher"
                        placeholder={`Busca la dirección del Punto de Venta`}
                        // value={pos.address}
                        onChange={handleSearchAddress}
                    />
                    <p className={styles.address}>Dirección Encontrada: <span>{pos.address}</span></p>
                    <p className={styles.note}>**Si la dirección encontrada no fue exacta, puede arrastrar el punto en el mapa para precisar la ubicación del punto de venta.</p>
                    <MapContainer 
                        center={initialCenter}
                        zoom={13}
                        className={styles.map}
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* <MyComponent /> */}
                        <Marker
                            draggable={true}
                            position={markerPosition}
                            ref={markerRef}
                            eventHandlers={markerEventHandlers}
                        >
                            <Popup
                                autoPan={false} 
                                className={styles["popup-restyling"]}
                            >
                                <p>{pos.address}</p>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className={styles.field}>
                    <div id="image-field" className={`${styles["field-images"]} ${pos.image ? styles["field-images-done"] : ''}`}>
                        <p className={styles.required}>{pos.image ? 'Imagen Subida' : 'Sube Primera Imagen'}</p>
                        <div>
                            <label htmlFor="image">
                                <div>
                                    <svg viewBox="0 0 640 512" height="1em">
                                        <path
                                            d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                                        ></path>
                                    </svg>
                                    <p>{pos.image ? 'Subida correcamente' : 'Arrastra la imagen'}</p>
                                    <p>o</p>
                                    <span>{pos.image ? 'Cambiar archivo' : 'Sube un archivo'}</span>
                                </div>
                                <input 
                                    type="file" 
                                    id="image" 
                                    name="image" 
                                    onChange={handleChangeFile}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.preview}>
                    <div className={styles["content-preview"]}>
                        <p>Vista Previa</p>
                        {/* TODO: Preview */}
                    </div>
                </div>
                <button
                    className={`${styles.button} ${savingPoS ? styles["btn-saving"] : ''} ${initialPoS && !initialPoS?.name ? styles["btn-disabled"] : ''}`}
                    type='submit'
                    data-action='save'
                    disabled={savingPoS || (initialPoS && !initialPoS?.name)}
                >
                    <i className="fa-solid fa-save"></i>
                    {savingPoS ? 'Guardando...' : 'Guardar Punto de Venta'}
                </button>
                {initialPoS && (
                    <button
                        className={`${styles.button} ${styles["btn-delete"]} ${!initialPoS?.name ? styles["btn-disabled"] : ''}`}
                        type='button'
                        onClick={() => setModalDelete(true)}
                        disabled={!initialPoS.name}
                    >
                        <i className="fa-solid fa-trash"></i>
                        Borrar Punto de Venta
                    </button>
                )}
            </div>
        </form>
    )
}

export default FormPointOfSale;