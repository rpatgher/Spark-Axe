import { Fragment, useEffect, useState } from 'react';

import clientAxios from '../../config/clientAxios';


// ******************** Styles ********************
import styles from './Orders.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';
import formatDate from '../../helpers/formatDate';
// **************** Images ****************
import lunaAxImage from '../../assets/img/luna_ax.png';

const Orders = () => {
    const { auth } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Get orders from the server
        const getOrders = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clientAxios.get(`/api/orders/${auth.websites[0].id}`, config);
                setOrders(data);
            } catch (error) {
                console.log(error);
            }
        }
        return () => getOrders();
    }, []);

    const [details, setDetails] = useState('');

    const toggleDetails = (orderId) => {
        setDetails(details === orderId ? '' : orderId);
    }
    
    //Share to whatsapp pedidos
        const shareArrayToWhatsApp = () => {
        const message = "hello"; // Join array elements with new lines
        shareToWhatsApp(message);
    };
    const shareToWhatsApp = (message) => {
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };
    //**********Acaba Share to whatsapp *///////////////

    return (
        <>
            <h2 className={styles.heading}>Pedidos de Productos</h2>
            <h4>Administra tus pedidos</h4>
            <div className={styles["table-wrapper"]}>
                <table className={styles["orders-table"]}>
                    <thead>
                        <tr>
                            <th className={styles['col-id']}>Número</th>
                            <th className={styles['col-date']}>Fecha de pedido</th>
                            <th className={styles['col-deadline']}>Fecha de entrega</th>
                            <th className={styles['col-customer']}>Cliente</th>
                            <th className={styles['col-status']}>Estado</th>
                            <th className={styles['col-notes']}>Nota</th>
                            <th className={styles['col-total']}>Total</th>
                            <th className={styles['col-details']}>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                
                                <td colSpan="10" className={styles.noproducts}>
                                <div>
                               <img className={styles["imgAX"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                               </div>
                                    No cuentas con pedidos aún.</td>
                            </tr>
                        ) :
                            orders.map(order => (
                                <Fragment key={`${order.id}-${order.website_id}`}>
                                    <tr className={`${details === order.id ? styles["details-active"] : ''}`}>
                                        <td>{String(order.id).padStart(10, '0')}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{formatDate(order.deadline)}</td>
                                        {/* TODO: Poner bien el customer */}
                                        <td>Issac Shakalo</td>
                                        <td>
                                            <select 
                                                className={styles.select}
                                                value={order.status}
                                                onChange={(e) => console.log(e.target.value)}
                                            >
                                                <option value="IP">En proceso</option>
                                                <option value="S">Enviado</option>
                                                <option value="C">Cerrado</option>
                                                <option value="CA">Cancelado</option>
                                            </select>
                                        </td>
                                        <td>{order.notes}</td>
                                        <td>${formatToMoney(parseFloat(order.total))}</td>
                                        <td
                                            className={styles.details}
                                            onClick={() => toggleDetails(order.id)}
                                        >Ver  <i className="fa-regular fa-eye"></i></td>
                                    </tr>
                                    {details === order.id && (
                                        <tr>
                                            <td colSpan="8" className={styles.products23}>
                                            <button className={styles.STW} onClick={shareArrayToWhatsApp}>Compartir pedido <i class="fa-solid fa-share"></i></button>
                                    <h1> Pedido: {String(order.id).padStart(10, '0')}</h1>
    <div className={styles.Descriptioncontfather}>
    <div className={styles.Descriptioncont}>
    <h2 className={styles.infofloatl}>Productos en el pedido:</h2>
    <table className={styles["products-table"]}>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            {order.elements.map((element) => (
                <tr key={`${element.name}-${order.id}`}>
                    <td>{element.name}</td>
                    <td>{element.order_element.quantity}</td>
                    <td>${formatToMoney(element.price)}</td>
                    <td>${formatToMoney(element.price * element.order_element.quantity)}</td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
    <div className={styles.Descriptioncont}>
    <h2> Ubicacion de entrega:</h2>
    <p> Case de Remy 43, Colonia chapultepec, CDMX</p>
    <h2>Nota de pedido</h2>
    <p>Notas de pedido como que te odio remy</p>

    </div>
    </div>
    <h2 className={styles.infofloatr}>Total de Pedido: <span className={styles.infofloatrb}>${formatToMoney(parseFloat(order.total))}</span></h2>
    <h2 className={styles.infofloatr}>Status: <span className={styles.infofloatrb}>{(order.status)}</span></h2>
</td>

                                        </tr>
                                    )}
                                </Fragment>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            
        </>
    );
}

export default Orders;
