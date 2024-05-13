import { Fragment, useEffect, useState } from 'react';

import clientAxios from '../../config/clientAxios';


// ******************** Styles ********************
import styles from './Orders.module.css';

// ******************** Hooks ********************
import useAuth from '../../hooks/useAuth';
import useApp from '../../hooks/useApp';

// ******************** Helpers ********************
import formatToMoney from '../../helpers/formatMoney';
import formatDate from '../../helpers/formatDate';
import zeroFill from '../../helpers/zeroFill';

// **************** Images ****************
import lunaAxImage from '../../assets/img/luna_ax.png';
import HeadingsRuta from '../../components/HeadingsRuta/HeadingsRuta';

// **************** Images ****************
import FloatAlert from '../../components/Alert/FloatAlert';

const Orders = () => {
    const { auth } = useAuth();
    const { alert, handleAlert } = useApp();
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState('asc'); // For sorting the orders
    const [orderType, setOrderType] = useState('id');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [visible, setVisible] = useState('all');
    const [search, setSearch] = useState('');

    const dataLength = orders.length;
    const [visibleCount, setVisibleCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [limitIncrement, setLimitIncrement] = useState(10);

    useEffect(() => {
        const countVisible = filteredOrders.filter(item => item.visible).length;
        setVisibleCount(countVisible);
    }, [filteredOrders, limit]);

    const sortedOrders = orders.sort((a, b) => {
        if (order === 'asc') {
            if (orderType === 'id') {
                return a.id - b.id;
            }
            if (orderType === 'date') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            if (orderType === 'due-date') {
                return new Date(a.deadline) - new Date(b.deadline);
            }
            if (orderType === 'total') {
                return a.total - b.total;
            }
        }
        if (order === 'desc') {
            if (orderType === 'id') {
                return b.id - a.id;
            }
            if (orderType === 'date') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (orderType === 'due-date') {
                return new Date(b.deadline) - new Date(a.deadline);
            }
            if (orderType === 'total') {
                return b.total - a.total;
            }
        }
    });

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
                setFilteredOrders(data);
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

 
    const handleOrder = (e) => {
        setOrder(e.target.value);
        setFilteredOrders(sortedOrders);
    };

    const handleOrderType = (e) => {
        setOrderType(e.target.value);
        setFilteredOrders(sortedOrders);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        filterOrders(e.target.value, visible);
    };

    const handleVisible = (e) => {
        setVisible(e.target.dataset.value);
        filterOrders(search, e.target.dataset.value);
    };

    const filterOrders = (search, visible) => {
        setFilteredOrders(filteredOrders.map(order => order.selected = false));
        const visibleFiltered = orders.filter(order => {
            if (visible === 'all') {
                return order;
            }
            if (visible === 'send') {
                return order.status === 'S';
            }
            if (visible === 'progress') {
                return order.status === 'IP';
            }
            if (visible === 'closed') {
                return order.status === 'C';
            }
            if (visible === 'canceled') {
                return order.status === 'CA';
            }
        });
        if (search === '') {
            setFilteredOrders(visibleFiltered);
            return;
        }
        const filtered = visibleFiltered.filter(order => zeroFill(order.id, 10).toLowerCase().includes(search.toLowerCase()));
        setFilteredOrders(filtered);
    };

    const handleChangeStatus = async (e) => {
        const status = e.target.value;
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };
        try {
            document.body.style.cursor = 'wait';
            const response = await clientAxios.put(`/api/orders/status/${auth.websites[0].id}/${e.target.dataset.id}`, { status }, config);
            if(response.status === 200 || response.status === 202){
                setFilteredOrders(filteredOrders.map(order => {
                    if (order.id === parseInt(e.target.dataset.id)) {
                        order.status = status;
                    }
                    return order;
                }));
                setOrders(orders.map(order => {
                    if (order.id === parseInt(e.target.dataset.id)) {
                        order.status = status;
                    }
                    return order;
                }));
                handleAlert("Estatus actualizado correntamente", false);
            }else{
                handleAlert("Hubo un error al actualizar el estatus", true);
            }
        } catch (error) {
            console.log(error);
        }finally{
            document.body.style.cursor = 'default';
        }
    }

    return (
        <div className={styles["orders-wrapper"]}>
            {alert.msg && <FloatAlert msg={alert.msg} error={alert.error} />}
            <HeadingsRuta
                currentHeading="Pedidos de Productos"
                routes={[]}
            />
            <h4>Administra tus pedidos</h4>
            <div className={`${styles.filters} `}>
                <div className={styles.searcher}>
                    <input
                        type="text"
                        placeholder="Buscar pedidos"
                        onChange={handleSearch}
                    />
                    <i className={`fa-solid fa-search ${styles["search-icon"]}`}></i>
                    <div className={styles.filterter}>
                        <button className={`${styles["btn-filter"]}`}>
                            <strong className={`${styles["Textfilter"]}`}>Filtrar</strong>
                            <i className='fa-solid fa-sort'></i>
                        </button>
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownContent}>
                                <button
                                    className={`${orderType === 'id' ? styles.active : ''}`}
                                    value={'id'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-hashtag"></i>
                                    Número
                                </button>
                                <button
                                    className={`${orderType === 'date' ? styles.active : ''}`}
                                    value={'date'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-calendar"></i>
                                    Fecha de pedido
                                </button>
                                <button
                                    className={`${orderType === 'due-date' ? styles.active : ''}`}
                                    value={'due-date'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-regular fa-calendar-days"></i>
                                    Fecha de Entrega
                                </button>
                                <button
                                    className={`${orderType === 'total' ? styles.active : ''}`}
                                    value={'total'}
                                    onClick={handleOrderType}
                                >
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    Total
                                </button>
                                <hr className={styles.divider} />
                                <button
                                    className={`${order === 'asc' ? styles.active : ''}`}
                                    value={'asc'}
                                    onClick={handleOrder}
                                >
                                    Ascendente
                                </button>
                                <button
                                    className={`${order === 'desc' ? styles.active : ''}`}
                                    value={'desc'}
                                    onClick={handleOrder}
                                >
                                    Descendente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["Filtertabs"]}>
                <div className={styles["radio-inputs"]}>
                    <p className={styles.visibles}>Visibles: </p>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "all" ? styles.active : ''}`} data-value="all">Todos</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "send" ? styles.active : ''}`} data-value="send">Enviados</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "progress" ? styles.active : ''}`} data-value="progress">En progreso</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "closed" ? styles.active : ''}`} data-value="closed">Cerrados</button>
                    <button onClick={handleVisible} className={`${styles.visibles2} ${visible === "canceled" ? styles.active : ''}`} data-value="canceled">Cancelados</button>
                </div>
            </div>
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
                        {filteredOrders.length === 0 ? (
                            <tr>

                                <td colSpan="10" className={styles.noproducts}>
                                    <div>
                                        <img className={styles["imgAX"]} src={lunaAxImage} alt="Axolotl-Waiting" />
                                    </div>
                                    No cuentas con pedidos aún.</td>
                            </tr>
                        ) :
                        
                            filteredOrders.map((order, index) => {
                                if(index < limit){
                            order.visible = true;
                            //Share to whatsapp pedidos
                            const share = () => {
                                const formatProductTable = (products) => {
                            let table = "\n";
                            table += "Producto\tCantidad\tPrecio\tSubtotal\n"
                            products.forEach(product => {
                                table += `${product.name}\t${product.quantity}\t${product.price}\t${product.price * product.quantity}\n`;
                            });
                            return table;
                        };

                        const shareToWhatsApp = (message) => {
                            const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
                            window.open(url, '_blank');
                        };

                        const shareArrayToWhatsApp = (products) => {
                            const message = `
*ID de Pedido:* ${order.id}
*Fecha de Pedido:* ${formatDate(order.createdAt)}
*Cliente :* Issac Shakalo
*Nota de pedido:* ${order.notes}
*Destino:* ubicacion de entrega
${formatProductTable(products)}
*Total:* $${formatToMoney(parseFloat(order.total))}
                            `;
                            shareToWhatsApp(message);
                        };

                        // Example product array
                        const products = [
                            { name: "Producto 1", quantity: 2, price: 10 },
                            { name: "Producto 2", quantity: 1, price: 20 }
                        ];

                        shareArrayToWhatsApp(products);

                            };
                            
                          
                                    return (
                                        <Fragment key={`${order.id}-${order.website_id}`}>
                                            <tr className={`${details === order.id ? styles["details-active"] : ''}`}>
                                                <td>{String(order.id).padStart(10, '0')}</td>
                                                <td>{formatDate(order.createdAt)}</td>
                                                <td>{formatDate(order.deadline)}</td>
                                                {/* TODO: Poner bien el customer */}
                                                <td>Issac Shakalo</td>
                                                <td>
                                                    <select
                                                        className={`${styles.select} ${styles[`select-${order.status}`]}`}
                                                        value={order.status}
                                                        data-id={order.id}
                                                        onChange={handleChangeStatus}
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
                                                        <div className={styles.pedidofinal}>
                                                        <div>
                                                        <h2 className={styles.infofloatr}>Total de Pedido: <span className={styles.infofloatrb}>${formatToMoney(parseFloat(order.total))}</span></h2>
                                                        <h2 className={styles.infofloatr}>Status: <span className={styles.infofloatrb}>{(order.status)}</span></h2>
                                                        
                                                        </div>
                                                        <button className={styles.STW} onClick={share}>Compartir pedido <i className="fa-solid fa-share"></i></button>
                                                        </div>
                                                        
                                                    </td>

                                                </tr>
                                            )}
                                        </Fragment>
                                    )
                                }else{
                                    order.visible = false;
                                }
                            })
                        }
                        {dataLength > limitIncrement &&
                                <tr className={styles.megarow}>
                                    <td colSpan="3">
                                        <strong>Pedidos cargados: </strong>{visibleCount}
                                    </td>
                                    <td colSpan="1">
                                        {dataLength > limit &&
                                            <button 
                                                className={styles.cargar}
                                                type='button'
                                                onClick={() => {
                                                    setLimit(limit + limitIncrement);
                                                }}
                                            >Cargar más</button>
                                        }
                                    </td>
                                    <td colSpan="1">
                                        {limit > limitIncrement &&
                                            <button 
                                                className={styles.cargar}
                                                type='button'
                                                onClick={() => setLimit(limit - limitIncrement)}
                                            >Cargar menos</button>
                                        }
                                    </td>
                                    <td colSpan="3"></td>
                                </tr>
                            }
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Orders;
