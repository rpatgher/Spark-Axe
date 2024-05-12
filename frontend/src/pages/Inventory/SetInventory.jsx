import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";

import clientAxios from '../../config/clientAxios';


// ******************** Images ********************
import lunaAxImage from '../../assets/img/envio.png';

// ******************** Styles ********************
import styles from './SetInventory.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Components ********************
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';
import FloatAlert from '../../components/Alert/FloatAlert';



function SetInventory() {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState({});

    useEffect(() => {
        const getInventory = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clientAxios(`/api/inventories/${auth.websites[0].id}`, config);
                setInventory(data);
            } catch (error) {
                console.log(error);
            }
        }
        return () => getInventory();
    }, []);

    const handleChange = (e) => {
        setInventory({
            ...inventory,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(inventory.low === '' || inventory.medium === '' || inventory.high === ''){
            handleAlert('Todos los campos son obligatorios', true);
        }
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await clientAxios.put(`/api/inventories/${auth.websites[0].id}`, inventory, config);
            handleAlert("Inventario actualizado correctamente", false);
            navigate('/dashboard/inventory');
        } catch (error) {
            console.log(error);
            handleAlert(error.response.data.msg, true);
        }
    };

    return (
        <div className={styles["inventory-wrapper"]}>
            {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
            <div className={styles.enviocontent}>
                <div id="London" className={styles.tabcontent1}>
                    <HeadingsRuta
                        currentHeading="Editar"
                        routes={[
                            {name: "Inventario", path: "/dashboard/inventory"},
                        ]}
                    />
                    <div className={styles["go-back"]}>
                        <Link to='/dashboard/inventory'><button> <i className="fa-solid fa-arrow-left"  ></i> Regresar</button></Link>
                    </div>
                    <form
                        className={styles.body} 
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.field}>
                            <label htmlFor="low">Menos de la cantidad mínima para ser considerado inventario Bajo</label>
                            <input
                                type="number"
                                id="low"
                                name="low"
                                placeholder={"Por defecto: 10"}
                                onChange={handleChange}
                                value={inventory.low || ''}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="medium">Menos de la cantidad mínima para ser considerado inventario Medio</label>
                            <input
                                type="number"
                                id="medium"
                                name="medium"
                                placeholder={"Por defecto: 20"}
                                onChange={handleChange}
                                value={inventory.medium || ''}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="high">Mas de la cantidad mínima para ser considerado inventario Alto</label>
                            <input
                                type="number"
                                id="high"
                                name="high"
                                placeholder={"Por defecto: 30"}
                                onChange={handleChange}
                                value={inventory.high || ''}
                            />
                        </div>
                        <p className={styles.notes}>Esta configuracion se aplicara para todos los productos y es para que tengas mas control sobre tu inventario</p>
                        <p className={styles.notes}>Por defecto: Bajo es 10, Medio es 20 y Alto es 30</p>
                        <button 
                            className={styles.Buttonguardar}
                            type="submit"
                        >
                            Guardar cambios
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default SetInventory
