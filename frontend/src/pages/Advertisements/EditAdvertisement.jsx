import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// ********************* Styles ********************
import styles from './NewAdvertisement.module.css';

// ************** Components *************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';
import GeneralModal from '../../components/Modals/GeneralModal';
import FormAdvertisement from '../../components/FormAdvertisement/FormAdvertisement';

// ************** Hooks *************
import useApp from '../../hooks/useApp';

const EditAdvertisement = () => {
    const navigate = useNavigate();
    const { alert, handleAlert } = useApp();
    const { id } = useParams();
    const [advertisement, setAdvertisement] = useState({});

    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        const getAdvertisement = async () => {
            // Fetch advertisement from API
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/advertisements/${id}`, config);
                setAdvertisement(response.data);
            } catch (error) {
                console.log(error);
                handleAlert('Error al obtener el anuncio', true);
            }
        }
        getAdvertisement();
    }, []);

    const deleteAdvertisement = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const response = await clientAxios.delete(`/api/advertisements/${id}`, config);
            navigate('/dashboard/advertisements');
        } catch (error) {
            console.log(error);
            if(error?.response?.data?.msg === 'Cannot delete this advertisement'){
                handleAlert('No se puede eliminar este anuncio, porque está asociado a otro elemento', true);    
            }else{
                handleAlert('Error al eliminar el anuncio', true);
            }
        } finally{
            setModalDelete(false);
        }
    }

    return (
        <>
            <div className={styles.form}>
                <HeadingsRuta 
                    currentHeading={`Nuevo Anuncio: ${advertisement.title || ''}`}
                    routes={[
                        {name: "Anuncios", path: "/dashboard/advertisements"},
                    ]}
                />
                <div className={styles["go-back"]}>
                    <Link to='/dashboard/advertisements'>
                        <i className="fa-solid fa-arrow-left"></i> Regresar
                    </Link>
                </div>
                <FormAdvertisement 
                    initialAdvertisment={advertisement}
                    setModalDelete={setModalDelete}
                />
            </div>
            {modalDelete && (
                <GeneralModal
                    modalActive={setModalDelete}
                    actionModal={deleteAdvertisement}
                    actionBtnText='Eliminar'
                    text='¿Estás seguro de eliminar este anuncio?'
                />
            )}
        </>
    )
}

export default EditAdvertisement;