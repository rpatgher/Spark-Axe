import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import clientAxios from '../../config/clientAxios';

// *************** Styles ***************
import styles from './NewPointOfSale.module.css';

// ************** Hooks *************
import useApp from '../../hooks/useApp';

// ************** Components *************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';
import GeneralModal from '../../components/Modals/GeneralModal';
import FormPointOfSale from '../../components/FormPointOfSale/FormPointOfSale';

const EditPointOfSale = () => {
    const navigate = useNavigate();
    const { alert, handleAlert } = useApp();
    const { id } = useParams();

    const [pos, setPos] = useState({});

    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        const getPos = async () => {
            // Fetch pos from API
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const response = await clientAxios.get(`/api/pos/${id}`, config);
                setPos(response.data);
            } catch (error) {
                console.log(error);
                handleAlert('Error al obtener el punto de venta', true);
            }
        };
        getPos();
    }, []);

    const deletePos = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const response = await clientAxios.delete(`/api/pos/${id}`, config);
            handleAlert('Punto de venta eliminado correctamente', false);
            navigate('/dashboard/pos');
        } catch (error) {
            console.log(error);
            handleAlert('Error al eliminar el punto de venta', true);
        } finally {
            setModalDelete(false);
        }
    };


    return (
        <>
            <div className={styles.form}>
                <HeadingsRuta 
                    currentHeading={`Editar Punto de Venta: ${pos.name || ''}`}
                    routes={[
                        {name: "Puntos de Venta", path: "/dashboard/pos"},
                    ]}
                />
                <div className={styles["go-back"]}>
                    <Link to='/dashboard/pos'>
                        <i className="fa-solid fa-arrow-left"></i> Regresar
                    </Link>
                </div>
                <FormPointOfSale 
                    initialPoS={pos}
                    setModalDelete={setModalDelete}
                />
            </div>
            {modalDelete && (
                <GeneralModal
                    modalActive={setModalDelete}
                    actionModal={deletePos}
                    actionBtnText='Eliminar'
                    text='¿Estás seguro de eliminar este anuncio?'
                />
            )}
        </>
    )
}

export default EditPointOfSale;