import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ********************* Styles ********************
import styles from './FormAdvertisement.module.css';

// ************** hooks *************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ************** components *************
import DynamicAdvertisement from '../DynamicAdvertisement';

const FormAdvertisement = ({ initialAdvertisment, setModalDelete }) => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const navigate = useNavigate();
    const [advertisment, setAdvertisment] = useState({
        title: '',
        image: '',
        section_id: '',
        published: false
    });

    const [sections, setSections] = useState([]);

    const [savingAdvertisment, setSavingAdvertisment] = useState(false);
    const [publishingAdvertisment, setPublishingAdvertisment] = useState(false);

    useEffect(() => {
        setAdvertisment({
            title: initialAdvertisment?.title || '',
            image: '',
            section_id: initialAdvertisment?.section_id || '',
            published: initialAdvertisment?.published || false
        });
    }, [initialAdvertisment]);

    useEffect(() => {
        const getSections = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/sections/${auth.websites[0].id}`, config);
                setSections(response.data);
            } catch (error) {
                console.log(error);
                handleAlert('Error al obtener las sectiones', true);
            }
        }
        return () => getSections();
    }, []);


    const handleChange = (e) => {
        if(Array.from(e.target.classList).includes(styles["empty-field"])){
            e.target.classList.remove(styles["empty-field"]);
        }
        setAdvertisment({
            ...advertisment,
            [e.target.name]: e.target.value
        });
    }

    const handleChangeFile = (e) => {
        setAdvertisment({
            ...advertisment,
            [e.target.name]: e.target.files[0]
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ([advertisment.title, advertisment.section_id].includes('')) {
            handleAlert("Todos los campos son obligatorios", true);
            const objKeys = Object.keys(advertisment).filter(key => key !== 'initialImage' && key !== 'published');
            objKeys.forEach(key => {
                if(advertisment[key] === ''){
                    if(key === 'image'){
                        document.getElementById('image-field').classList.add(styles["empty-field-image"]);
                    }else{
                        document.getElementById(key).classList.add(styles["empty-field"]);
                    }
                }
            });
            return;
        }
        if (advertisment.image === '' && !initialAdvertisment?.id) {
            handleAlert("La imagen es obligatoria", true);
            document.getElementById('image-field').classList.add(styles["empty-field-image"]);
            return;
        }
        let msgAlert = '';
        if(e.nativeEvent.submitter.dataset.action === 'publish'){
            advertisment.published = true; 
            setPublishingAdvertisment(true);
            msgAlert = 'Anuncio publicado exitosamente';
        }else if (e.nativeEvent.submitter.dataset.action === 'unpublish'){
            advertisment.published = false; 
            setPublishingAdvertisment(true);
            msgAlert = 'Anuncio archivado exitosamente';
        }else{
            setSavingAdvertisment(true);
            msgAlert = 'Anuncio guardado exitosamente';
        }
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        const formData = new FormData();
        formData.append('title', advertisment.title);
        formData.append('image', advertisment.image);
        formData.append('section_id', advertisment.section_id);
        if(advertisment.published !== undefined && advertisment.published !== null){
            formData.append('published', advertisment.published);
        }
        formData.append('website_id', auth.websites[0].id);
        
        try {
            let response;
            if(!initialAdvertisment && !initialAdvertisment?.id){
                response = await clientAxios.post('/api/advertisements', formData, config);
            }else{
                response = await clientAxios.put(`/api/advertisements/${initialAdvertisment.id}`, formData, config);
            }
            if(response.status === 200 || response.status === 201){
                handleAlert(msgAlert);
                setAdvertisment({
                    title: '',
                    image: '',
                    published: false
                });
                navigate('/dashboard/advertisements');
            }
        } catch (error) {
            console.log(error);
            handleAlert(error.response.data.message, true);   
        } finally {
            setSavingAdvertisment(false);
            setPublishingAdvertisment(false);
        }
    }


    return (
        <form
            className={styles.body}
            onSubmit={handleSubmit}
        >
            <div className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="title" className={styles.required}>Título</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder={`Título del Anuncio`}
                        value={advertisment.title}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="section_id" className={styles.required}>Sección</label>
                    <select
                        id="section_id"
                        name="section_id"
                        value={advertisment.section_id}
                        onChange={handleChange}
                    >
                        <option value="" disabled> ---Selecciona una sección--- </option>
                        {sections.map(section => (
                            <option key={section.id} value={section.id}>{section.name}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <div id="image-field" className={`${styles["field-images"]} ${advertisment.image ? styles["field-images-done"] : ''}`}>
                        <p className={styles.required}>{advertisment.image ? 'Imagen Subida' : 'Sube Primera Imagen'}</p>
                        <div>
                            <label htmlFor="image">
                                <div>
                                    <svg viewBox="0 0 640 512" height="1em">
                                        <path
                                            d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                                        ></path>
                                    </svg>
                                    <p>{advertisment.image ? 'Subida correcamente' : 'Arrastra la imagen'}</p>
                                    <p>o</p>
                                    <span>{advertisment.image ? 'Cambiar archivo' : 'Sube un archivo'}</span>
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
                        <DynamicAdvertisement 
                            advertisement={advertisment}
                            userSiteType={auth.websites[0].name}
                        />
                    </div>
                    <p>Estado del Anuncio: <span className={`${advertisment.published ? styles["status-published"] : styles["status-unpublished"] }`}>{advertisment.published ? 'Publicado' : 'Archivado'}</span> </p>
                </div>
                <button
                    className={`${styles.button} ${savingAdvertisment ? styles["btn-saving"] : ''} ${initialAdvertisment && !initialAdvertisment?.title ? styles["btn-disabled"] : ''}`}
                    type='submit'
                    data-action='save'
                    disabled={savingAdvertisment || (initialAdvertisment && !initialAdvertisment?.title)}
                >
                    <i className="fa-solid fa-save"></i>
                    {savingAdvertisment ? 'Guardando...' : 'Guardar Anuncio'}
                </button>
                <div className={styles["delete-publish"]}>
                    <button
                        className={`${styles.button} ${styles["btn-publish"]} ${initialAdvertisment?.published ? styles["btn-unpublish"] : '' } ${publishingAdvertisment ? styles["btn-saving"] : ''} ${initialAdvertisment && !initialAdvertisment?.title ? styles["btn-disabled"] : ''}`}
                        data-action={initialAdvertisment && initialAdvertisment?.published ? 'unpublish' : 'publish'}
                        type='submit'
                        style={{
                            width: !initialAdvertisment ? '100%' : '50%'
                        }}
                        disabled={initialAdvertisment && !initialAdvertisment?.title}
                    >
                        {initialAdvertisment?.published ? (<i className="fa-solid fa-box-archive"></i>) : (<i className="fa-solid fa-upload"></i>)}
                        {initialAdvertisment?.published ? !publishingAdvertisment ? 'Archivar Producto' : 'Archivando...' : !publishingAdvertisment ? 'Publicar Anuncio' : 'Publicando...'}
                    </button>
                    {initialAdvertisment && (
                        <button
                            className={`${styles.button} ${styles["btn-delete"]} ${!initialAdvertisment.title ? styles["btn-disabled"] : ''}`}
                            type='button'
                            onClick={() => setModalDelete(true)}
                            disabled={!initialAdvertisment.title}
                        >
                            <i className="fa-solid fa-trash"></i>
                            Borrar Anuncio
                        </button>
                    )}
                </div>
            </div>
        </form>
    )
}

export default FormAdvertisement;
